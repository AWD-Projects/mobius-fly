import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Known business-level errors — webhook should return 200 for these
// (retrying won't fix them; they are expected states)
export const BUSINESS_ERRORS = new Set([
    "ALREADY_PAID",
    "RESERVATION_NOT_FOUND_IN_METADATA",
    "AMOUNT_MISMATCH",
]);

export async function confirmReservationFromWebhook(
    session: Stripe.Checkout.Session,
): Promise<void> {
    const supabase = createAdminClient();

    const reservationId    = session.metadata?.reservation_id;
    const bookingReference = session.metadata?.booking_reference;

    if (!reservationId || !bookingReference) {
        throw new Error("RESERVATION_NOT_FOUND_IN_METADATA");
    }

    // ── 1. Pre-fetch all status IDs in one query ──────────────────────────────
    const { data: statuses } = await supabase
        .from("reservation_status")
        .select("id, code");

    const statusMap = Object.fromEntries(
        (statuses ?? []).map((s: { id: string; code: string }) => [s.code, s.id]),
    );
    const blockedStatusId  = statusMap["BLOCKED"];
    const confirmedStatusId = statusMap["CONFIRMED"];
    const expiredStatusId  = statusMap["EXPIRED"];

    if (!blockedStatusId || !confirmedStatusId || !expiredStatusId) {
        throw new Error("Could not load reservation status codes");
    }

    // ── 2. Fetch payment row (idempotency check) ──────────────────────────────
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("id, status, reservation_id, amount_total_paid")
        .eq("stripe_checkout_session_id", session.id)
        .single();

    if (paymentError || !payment) {
        throw new Error(`Payment not found for session ${session.id}`);
    }

    // Already processed — idempotent exit
    if (payment.status === "PAID") {
        throw new Error("ALREADY_PAID");
    }

    // ── 3. Verify the charged amount matches what we expected ─────────────────
    const expectedCents = Math.round(payment.amount_total_paid * 100);
    const chargedCents  = session.amount_total ?? 0;

    if (chargedCents !== expectedCents) {
        console.error(
            `[webhook] Amount mismatch on session ${session.id}:`,
            `expected ${expectedCents} cents, got ${chargedCents} cents`,
        );
        // Refund immediately — do not confirm the reservation
        const paymentIntentId = session.payment_intent as string | null;
        if (paymentIntentId) {
            const { stripe } = await import("@/lib/stripe");
            await stripe.refunds.create({
                payment_intent: paymentIntentId,
                reason:         "fraudulent",
                metadata: {
                    reason:         "amount_mismatch",
                    reservation_id: reservationId,
                    expected_cents: String(expectedCents),
                    charged_cents:  String(chargedCents),
                },
            });
            await supabase
                .from("payments")
                .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
                .eq("id", payment.id);
        }
        throw new Error("AMOUNT_MISMATCH");
    }

    // ── 4. Fetch reservation status ───────────────────────────────────────────
    const { data: reservation } = await supabase
        .from("reservations")
        .select(`
            id,
            reservation_status_id,
            contact_email,
            contact_full_name,
            seats_requested,
            flight:flights!reservations_flight_id_fkey (
                flight_code,
                departure_datetime,
                departure_airport:airports!flights_departure_airport_id_fkey (iata_code, city),
                arrival_airport:airports!flights_arrival_airport_id_fkey (iata_code, city)
            )
        `)
        .eq("id", reservationId)
        .single();

    // ── 5. Handle EXPIRED reservation — refund immediately ───────────────────
    if (!reservation || reservation.reservation_status_id === expiredStatusId) {
        const paymentIntentId = session.payment_intent as string | null;
        if (paymentIntentId) {
            const { stripe } = await import("@/lib/stripe");
            await stripe.refunds.create({
                payment_intent: paymentIntentId,
                reason:         "requested_by_customer",
                metadata: {
                    reason:         "reservation_expired_before_webhook",
                    reservation_id: reservationId,
                },
            });
        }
        await supabase
            .from("payments")
            .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
            .eq("id", payment.id);

        console.warn(`[webhook] Reservation ${reservationId} expired before payment confirmed — refunded`);
        return;
    }

    // ── 6. Confirm reservation (only if still BLOCKED) ────────────────────────
    const { error: confirmError } = await supabase
        .from("reservations")
        .update({
            reservation_status_id: confirmedStatusId,
            confirmed_at:          new Date().toISOString(),
            updated_at:            new Date().toISOString(),
        })
        .eq("id", reservationId)
        .eq("reservation_status_id", blockedStatusId);

    if (confirmError) {
        throw new Error(`Failed to confirm reservation: ${confirmError.message}`);
    }

    // ── 7. Update payment to PAID ─────────────────────────────────────────────
    await supabase
        .from("payments")
        .update({
            status:                   "PAID",
            stripe_payment_intent_id: session.payment_intent as string | null,
            paid_at:                  new Date().toISOString(),
            raw_stripe_payload:       session as unknown as Record<string, unknown>,
            updated_at:               new Date().toISOString(),
        })
        .eq("id", payment.id);

    // ── 8. Send booking confirmation email (non-blocking) ────────────────────
    if (reservation?.contact_email) {
        const flight     = reservation.flight as any;
        const depAirport = flight?.departure_airport;
        const arrAirport = flight?.arrival_airport;
        const depDate    = flight?.departure_datetime
            ? new Date(flight.departure_datetime).toLocaleDateString("es-MX", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
              })
            : "";

        // Fire-and-forget with a timeout guard
        const emailPromise = resend.emails.send({
            from:    process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com",
            to:      reservation.contact_email,
            subject: `Reserva confirmada — ${bookingReference} | Mobius Fly`,
            html:    buildConfirmationEmail({
                contactName:    reservation.contact_full_name ?? "",
                bookingReference,
                origin:         depAirport ? `${depAirport.city} (${depAirport.iata_code})` : "—",
                destination:    arrAirport ? `${arrAirport.city} (${arrAirport.iata_code})` : "—",
                departureDate:  depDate,
                seatsRequested: reservation.seats_requested ?? 1,
            }),
        });

        const timeout = new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error("email timeout")), 8000),
        );

        await Promise.race([emailPromise, timeout]).catch((err) => {
            console.error("[webhook] Confirmation email failed:", err?.message ?? err);
        });
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildConfirmationEmail(opts: {
    contactName:      string;
    bookingReference: string;
    origin:           string;
    destination:      string;
    departureDate:    string;
    seatsRequested:   number;
}): string {
    const { contactName, bookingReference, origin, destination, departureDate, seatsRequested } = opts;
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F6F4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F6F4;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden">
        <tr>
          <td style="background:#39424E;padding:32px 40px">
            <p style="margin:0;color:#C4A77D;font-size:22px;font-weight:bold;letter-spacing:1px">MOBIUS FLY</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px">
            <p style="color:#39424E;font-size:16px;margin:0 0 16px">Hola, <strong>${contactName}</strong></p>
            <p style="color:#39424E;font-size:16px;margin:0 0 32px">
              Tu reserva ha sido confirmada. ¡Te esperamos a bordo!
            </p>
            <div style="background:#F6F6F4;border-radius:8px;padding:20px 24px;margin-bottom:32px;text-align:center">
              <p style="margin:0 0 4px;color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase">Referencia de reserva</p>
              <p style="margin:0;color:#39424E;font-size:28px;font-weight:bold;letter-spacing:3px">${bookingReference}</p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
              <tr style="background:#f9f9f9">
                <td style="padding:12px 20px;color:#666;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Detalle del vuelo</td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-top:1px solid #e5e5e5">
                  <table width="100%">
                    <tr>
                      <td style="color:#666;font-size:14px;padding:4px 0">Ruta</td>
                      <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right">${origin} → ${destination}</td>
                    </tr>
                    <tr>
                      <td style="color:#666;font-size:14px;padding:4px 0">Fecha de salida</td>
                      <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right">${departureDate}</td>
                    </tr>
                    <tr>
                      <td style="color:#666;font-size:14px;padding:4px 0">Pasajeros</td>
                      <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right">${seatsRequested}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="color:#666;font-size:13px;margin:32px 0 0;line-height:1.6">
              Presenta una identificación oficial vigente al momento de abordar.<br>
              Para cualquier duda escríbenos a <a href="mailto:contacto@mobiusfly.com" style="color:#C4A77D">contacto@mobiusfly.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#39424E;padding:24px 40px;text-align:center">
            <p style="margin:0;color:#aaa;font-size:12px">© ${new Date().getFullYear()} Mobius Fly. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
