import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import {
    buildBuyerConfirmationEmail,
    buildOwnerNotificationEmail,
    buildMobiusInternalEmail,
    type PassengerRow,
} from "@/lib/emails/booking-templates";
import {
    generateManifestPDF,
    type ManifestPassenger,
} from "@/lib/emails/manifest-pdf";

const resend = new Resend(process.env.RESEND_API_KEY);

// Known business-level errors — webhook should return 200 for these
// (retrying won't fix them; they are expected states)
export const BUSINESS_ERRORS = new Set([
    "ALREADY_PAID",
    "ALREADY_REFUNDED",
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
        .select("id, status, reservation_id, amount_total_paid, amount_owner_net, amount_mobius_total")
        .eq("stripe_checkout_session_id", session.id)
        .single();

    if (paymentError || !payment) {
        throw new Error(`Payment not found for session ${session.id}`);
    }

    // Already processed — idempotent exits
    if (payment.status === "PAID")     throw new Error("ALREADY_PAID");
    if (payment.status === "REFUNDED") throw new Error("ALREADY_REFUNDED");

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
            }, { idempotencyKey: `refund-mismatch-${reservationId}` });
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
            flight_id,
            reservation_status_id,
            contact_email,
            contact_full_name,
            contact_phone,
            seats_requested,
            purchase_type,
            passengers:reservation_passengers (
                full_name,
                date_of_birth,
                gender,
                is_minor,
                document_type
            ),
            flight:flights!reservations_flight_id_fkey (
                flight_code,
                owner_id,
                departure_datetime,
                departure_fbo_name,
                arrival_fbo_name,
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
            }, { idempotencyKey: `refund-expired-${reservationId}` });
        }
        await supabase
            .from("payments")
            .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
            .eq("id", payment.id);

        console.warn(`[webhook] Reservation ${reservationId} expired before payment confirmed — refunded`);
        return;
    }

    // ── 6. Confirm reservation (only if still BLOCKED) ────────────────────────
    const { data: confirmedRows, error: confirmError } = await supabase
        .from("reservations")
        .update({
            reservation_status_id: confirmedStatusId,
            confirmed_at:          new Date().toISOString(),
            updated_at:            new Date().toISOString(),
        })
        .eq("id", reservationId)
        .eq("reservation_status_id", blockedStatusId)
        .select("id");

    if (confirmError) {
        throw new Error(`Failed to confirm reservation: ${confirmError.message}`);
    }

    // Race condition guard: pg_cron expired the reservation between step 5 and step 6.
    // Zero rows updated means the status was no longer BLOCKED when we tried to confirm.
    if (!confirmedRows || confirmedRows.length === 0) {
        const paymentIntentId = session.payment_intent as string | null;
        if (paymentIntentId) {
            const { stripe } = await import("@/lib/stripe");
            await stripe.refunds.create({
                payment_intent: paymentIntentId,
                reason:         "requested_by_customer",
                metadata: {
                    reason:         "reservation_expired_race_condition",
                    reservation_id: reservationId,
                },
            }, { idempotencyKey: `refund-race-${reservationId}` });
        }
        await supabase
            .from("payments")
            .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
            .eq("id", payment.id);
        console.warn(`[webhook] Race condition: reservation ${reservationId} expired before confirmation — payment refunded`);
        return;
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

    // ── 8. Send all notification emails (non-blocking) ───────────────────────
    const flight      = reservation?.flight as any;
    const depAirport  = flight?.departure_airport;
    const arrAirport  = flight?.arrival_airport;
    const depDate     = flight?.departure_datetime
        ? new Date(flight.departure_datetime).toLocaleDateString("es-MX", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
          })
        : "";
    const depTime     = flight?.departure_datetime
        ? new Date(flight.departure_datetime).toLocaleTimeString("es-MX", {
              hour: "2-digit", minute: "2-digit", hour12: true,
          })
        : "";
    const origin      = depAirport ? `${depAirport.city} (${depAirport.iata_code})` : "—";
    const destination = arrAirport ? `${arrAirport.city} (${arrAirport.iata_code})` : "—";
    const from        = process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com";
    const passengers  = ((reservation?.passengers ?? []) as PassengerRow[]);

    const sharedOpts = {
        bookingReference,
        origin,
        destination,
        originAirportName:  depAirport?.name ?? origin,
        departureFboName:   flight?.departure_fbo_name ?? "",
        arrivalFboName:     flight?.arrival_fbo_name ?? null,
        departureDate:      depDate,
        departureTime:      depTime,
        flightCode:         flight?.flight_code ?? "",
        purchaseType:       (reservation?.purchase_type ?? "seats") as "seats" | "full_aircraft",
        seatsRequested:     reservation?.seats_requested ?? 1,
        passengers,
        contactFullName:    reservation?.contact_full_name ?? "",
        contactEmail:       reservation?.contact_email ?? "",
        contactPhone:       reservation?.contact_phone ?? null,
        amountTotalPaid:    payment.amount_total_paid,
        amountOwnerNet:     (payment as any).amount_owner_net  ?? 0,
        amountMobiusTotal:  (payment as any).amount_mobius_total ?? 0,
    };

    // Build labelled email jobs so individual failures are identifiable in logs
    const emailJobs: { label: string; task: Promise<unknown> }[] = [];

    // ── Buyer confirmation ────────────────────────────────────────────────────
    if (reservation?.contact_email) {
        emailJobs.push({
            label: "buyer",
            task: resend.emails.send({
                from,
                to:      reservation.contact_email,
                subject: `Reserva confirmada — ${bookingReference} | Mobius Fly`,
                html:    buildBuyerConfirmationEmail({
                    contactName:      reservation.contact_full_name ?? "",
                    bookingReference,
                    origin,
                    destination,
                    departureDate:    depDate,
                    departureTime:    depTime,
                    flightCode:       flight?.flight_code ?? "",
                    departureFboName: flight?.departure_fbo_name ?? "",
                    seatsRequested:   reservation.seats_requested ?? 1,
                    purchaseType:     (reservation.purchase_type ?? "seats") as "seats" | "full_aircraft",
                }),
            }),
        });
    }

    // ── Owner notification — with full flight manifest PDF ────────────────────
    const ownerId = flight?.owner_id as string | null;
    const mobiusOpsEmailForOwner = process.env.MOBIUS_OPS_EMAIL ?? "operaciones@mobiusfly.com";
    let ownerEmail: string | null = null;
    if (ownerId) {
        const { data: ownerAuthUser } = await supabase.auth.admin.getUserById(ownerId);
        ownerEmail = ownerAuthUser?.user?.email ?? null;
    }
    const ownerEmailTarget = ownerEmail ?? mobiusOpsEmailForOwner;

    // Build full flight manifest: all confirmed passengers across all reservations
    const flightId = (reservation as any)?.flight_id as string | null;
    let manifestAttachment: { filename: string; content: Buffer } | null = null;
    if (flightId) {
        try {
            const { data: confirmedReservations } = await supabase
                .from("reservations")
                .select("id, booking_reference")
                .eq("flight_id", flightId)
                .eq("reservation_status_id", confirmedStatusId);

            const refMap: Record<string, string> = Object.fromEntries(
                (confirmedReservations ?? []).map((r: { id: string; booking_reference: string }) => [r.id, r.booking_reference]),
            );
            const confirmedIds = Object.keys(refMap);

            if (confirmedIds.length > 0) {
                const { data: allPax } = await supabase
                    .from("reservation_passengers")
                    .select("full_name, date_of_birth, gender, is_minor, document_type, reservation_id")
                    .in("reservation_id", confirmedIds);

                const manifestPassengers: ManifestPassenger[] = (allPax ?? []).map((p: any) => ({
                    full_name:         p.full_name,
                    date_of_birth:     p.date_of_birth,
                    gender:            p.gender,
                    is_minor:          p.is_minor,
                    document_type:     p.document_type,
                    booking_reference: refMap[p.reservation_id] ?? "",
                }));

                const pdfBuffer = await generateManifestPDF({
                    flightCode:       flight?.flight_code ?? "",
                    origin,
                    destination,
                    departureDate:    depDate,
                    departureTime:    depTime,
                    departureFboName: flight?.departure_fbo_name ?? "",
                    arrivalFboName:   flight?.arrival_fbo_name ?? null,
                    passengers:       manifestPassengers,
                    generatedAt:      new Date().toLocaleString("es-MX"),
                });

                manifestAttachment = {
                    filename: `manifiesto-${flight?.flight_code ?? "vuelo"}.pdf`,
                    content:  pdfBuffer,
                };
            }
        } catch (pdfErr) {
            console.error("[confirm] PDF manifest generation failed — sending email without attachment:", pdfErr);
        }
    }

    emailJobs.push({
        label: "owner",
        task: resend.emails.send({
            from,
            to:      ownerEmailTarget,
            subject: `Nueva reserva ${bookingReference} en tu vuelo ${flight?.flight_code ?? ""} | Mobius Fly`,
            html:    buildOwnerNotificationEmail(sharedOpts),
            ...(manifestAttachment ? { attachments: [manifestAttachment] } : {}),
        }),
    });

    // ── Mobius internal notification ──────────────────────────────────────────
    const mobiusOpsEmail = process.env.MOBIUS_OPS_EMAIL ?? "operaciones@mobiusfly.com";
    emailJobs.push({
        label: "mobius-internal",
        task: resend.emails.send({
            from,
            to:      mobiusOpsEmail,
            subject: `[Reserva confirmada] ${bookingReference} — ${origin} → ${destination}`,
            html:    buildMobiusInternalEmail(sharedOpts),
        }),
    });

    const emailResults = await Promise.race([
        Promise.allSettled(emailJobs.map((j) => j.task)),
        new Promise<PromiseSettledResult<unknown>[]>((_, reject) =>
            setTimeout(() => reject(new Error("email timeout")), 20_000),
        ),
    ]).catch((err) => {
        console.error("[webhook] Email sending timed out:", err?.message ?? err);
        return null;
    });

    if (emailResults) {
        emailResults.forEach((result, i) => {
            if (result.status === "rejected") {
                console.error(
                    `[webhook] ${emailJobs[i].label} email failed:`,
                    (result.reason as Error)?.message ?? result.reason,
                );
            }
        });
    }
}

