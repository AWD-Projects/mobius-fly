import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import {
    buildBuyerConfirmationEmail,
    buildOwnerNotificationEmail,
    buildMobiusInternalEmail,
    type PassengerRow,
} from "@/lib/emails/booking-templates";
import { generateManifestPDF } from "@/lib/emails/manifest-pdf";
import { generateConfirmationPDF } from "@/lib/emails/confirmation-pdf";
import { buildFlightManifestData } from "@/lib/payments/manifest";

const resend = new Resend(process.env.RESEND_API_KEY);

// Known business-level errors — webhook should return 200 for these
// (retrying won't fix them; they are expected states)
export const BUSINESS_ERRORS = new Set([
    "ALREADY_PAID",
    "ALREADY_REFUNDED",
    "RESERVATION_NOT_FOUND_IN_METADATA",
    "PAYMENT_NOT_FOUND_FOR_SESSION",
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
        .maybeSingle();

    if (paymentError) throw new Error(`Payment lookup failed: ${paymentError.message}`);
    if (!payment)     throw new Error("PAYMENT_NOT_FOUND_FOR_SESSION");

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
            const { error: refundMarkErr } = await supabase
                .from("payments")
                .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
                .eq("id", payment.id);
            if (refundMarkErr) {
                throw new Error(`CRITICAL: refund issued for mismatch but DB update failed: ${refundMarkErr.message}`);
            }
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
                flight_type,
                owner_id,
                departure_datetime,
                arrival_datetime,
                departure_fbo_name,
                arrival_fbo_name,
                departure_airport:airports!flights_departure_airport_id_fkey (iata_code, city),
                arrival_airport:airports!flights_arrival_airport_id_fkey (iata_code, city),
                aircraft:aircrafts!flights_aircraft_id_fkey (manufacturer, model, tail_number)
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
        const { error: refundMarkErr } = await supabase
            .from("payments")
            .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
            .eq("id", payment.id);
        if (refundMarkErr) {
            throw new Error(`CRITICAL: refund issued for expired reservation but DB update failed: ${refundMarkErr.message}`);
        }

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

    // Zero rows updated means BLOCKED guard failed — two possible causes:
    // (a) pg_cron expired the reservation between step 5 and step 6 → refund
    // (b) a concurrent webhook already confirmed it → mark PAID, no refund
    if (!confirmedRows || confirmedRows.length === 0) {
        const { data: currentRes } = await supabase
            .from("reservations")
            .select("reservation_status_id")
            .eq("id", reservationId)
            .single();

        if (currentRes?.reservation_status_id === confirmedStatusId) {
            // Concurrent webhook already confirmed — ensure payment is marked PAID
            await supabase
                .from("payments")
                .update({ status: "PAID", paid_at: new Date().toISOString(), updated_at: new Date().toISOString() })
                .eq("id", payment.id)
                .eq("status", "PENDING");
            console.info(`[webhook] Concurrent confirmation detected for ${reservationId} — marked PAID`);
            return;
        }

        // Reservation is EXPIRED — issue refund
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
        const { error: refundMarkErr } = await supabase
            .from("payments")
            .update({ status: "REFUNDED", updated_at: new Date().toISOString() })
            .eq("id", payment.id);
        if (refundMarkErr) {
            throw new Error(`CRITICAL: refund issued for race condition but DB update failed: ${refundMarkErr.message}`);
        }
        console.warn(`[webhook] Race condition: reservation ${reservationId} expired before confirmation — payment refunded`);
        return;
    }

    // ── 7. Update payment to PAID ─────────────────────────────────────────────
    const { error: paidMarkErr } = await supabase
        .from("payments")
        .update({
            status:                   "PAID",
            stripe_payment_intent_id: session.payment_intent as string | null,
            paid_at:                  new Date().toISOString(),
            raw_stripe_payload:       session as unknown as Record<string, unknown>,
            updated_at:               new Date().toISOString(),
        })
        .eq("id", payment.id);
    if (paidMarkErr) {
        // Reservation is confirmed — do not block emails. Log for manual review.
        console.error(`[webhook] WARN: reservation ${reservationId} confirmed but payment PAID update failed:`, paidMarkErr.message);
    }

    // ── 8. Send all notification emails (non-blocking) ───────────────────────
    const flight      = reservation?.flight as any;
    const depAirport  = flight?.departure_airport;
    const arrAirport  = flight?.arrival_airport;
    const aircraft    = flight?.aircraft;
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
    const arrivalTime = flight?.arrival_datetime
        ? new Date(flight.arrival_datetime).toLocaleTimeString("es-MX", {
              hour: "2-digit", minute: "2-digit", hour12: true,
          })
        : undefined;
    const origin      = depAirport ? `${depAirport.city} (${depAirport.iata_code})` : "—";
    const destination = arrAirport ? `${arrAirport.city} (${arrAirport.iata_code})` : "—";
    const aircraftType = aircraft ? `${aircraft.manufacturer} ${aircraft.model}` : undefined;
    const tailNumber   = aircraft?.tail_number ?? undefined;
    const flightType   = (flight?.flight_type ?? undefined) as "ONE_WAY" | "ROUND_TRIP" | undefined;
    const from        = process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com";
    const passengers  = ((reservation?.passengers ?? []) as PassengerRow[]);

    // ── Owner profile (name + email) for Mobius internal email ───────────────
    const ownerId = flight?.owner_id as string | null;
    let ownerEmail: string | null = null;
    let ownerFullName: string | undefined;
    if (ownerId) {
        const { data: ownerAuthUser } = await supabase.auth.admin.getUserById(ownerId);
        ownerEmail = ownerAuthUser?.user?.email ?? null;
        const { data: ownerProfile } = await supabase
            .from("user_profiles")
            .select("first_name, last_name")
            .eq("id", ownerId)
            .single();
        if (ownerProfile) {
            ownerFullName = [ownerProfile.first_name, ownerProfile.last_name].filter(Boolean).join(" ") || undefined;
        }
    }
    const ownerEmailTarget = ownerEmail ?? (process.env.MOBIUS_OPS_EMAIL ?? "operaciones@mobiusfly.com");

    const sharedOpts = {
        bookingReference,
        origin,
        destination,
        originAirportName:  depAirport?.name ?? origin,
        departureFboName:   flight?.departure_fbo_name ?? "",
        arrivalFboName:     flight?.arrival_fbo_name ?? null,
        departureDate:      depDate,
        departureTime:      depTime,
        arrivalTime,
        flightCode:         flight?.flight_code ?? "",
        aircraftType,
        tailNumber,
        flightType,
        purchaseType:       (reservation?.purchase_type ?? "seats") as "seats" | "full_aircraft",
        seatsRequested:     reservation?.seats_requested ?? 1,
        passengers,
        contactFullName:    reservation?.contact_full_name ?? "",
        contactEmail:       reservation?.contact_email ?? "",
        contactPhone:       reservation?.contact_phone ?? null,
        amountTotalPaid:    payment.amount_total_paid,
        amountOwnerNet:     (payment as any).amount_owner_net  ?? 0,
        amountMobiusTotal:  (payment as any).amount_mobius_total ?? 0,
        ownerFullName,
        ownerEmail:         ownerEmail ?? undefined,
    };

    // Build labelled email jobs so individual failures are identifiable in logs
    const emailJobs: { label: string; task: Promise<unknown> }[] = [];

    // ── Buyer confirmation + PDF attachment ──────────────────────────────────
    if (reservation?.contact_email) {
        let confirmationPdfAttachment: { filename: string; content: string } | null = null;
        try {
            const pdfBuf = await generateConfirmationPDF({
                bookingReference,
                contactFullName:  reservation.contact_full_name ?? "",
                contactEmail:     reservation.contact_email ?? "",
                contactPhone:     reservation.contact_phone ?? null,
                origin,
                destination,
                departureDate:    depDate,
                departureTime:    depTime,
                arrivalTime,
                departureFboName: flight?.departure_fbo_name ?? "",
                arrivalFboName:   flight?.arrival_fbo_name ?? null,
                flightCode:       flight?.flight_code ?? "",
                aircraftType,
                tailNumber,
                flightType,
                purchaseType:     (reservation.purchase_type ?? "seats") as "seats" | "full_aircraft",
                seatsRequested:   reservation.seats_requested ?? 1,
                passengers,
                amountTotalPaid:  payment.amount_total_paid,
                generatedAt:      new Date().toLocaleString("es-MX"),
            });
            confirmationPdfAttachment = {
                filename: `confirmacion-${bookingReference}.pdf`,
                content:  pdfBuf.toString("base64"),
            };
        } catch (pdfErr) {
            console.error("[confirm] Confirmation PDF generation failed — sending email without attachment:", pdfErr);
        }

        emailJobs.push({
            label: "buyer",
            task: resend.emails.send({
                from,
                to:      reservation.contact_email,
                subject: `Reserva confirmada — ${bookingReference} | Mobius Fly`,
                html:    buildBuyerConfirmationEmail({
                    contactName:      reservation.contact_full_name ?? "",
                    contactEmail:     reservation.contact_email ?? "",
                    contactPhone:     reservation.contact_phone ?? null,
                    bookingReference,
                    origin,
                    destination,
                    departureDate:    depDate,
                    departureTime:    depTime,
                    arrivalTime,
                    flightCode:       flight?.flight_code ?? "",
                    departureFboName: flight?.departure_fbo_name ?? "",
                    aircraftType,
                    tailNumber,
                    flightType,
                    seatsRequested:   reservation.seats_requested ?? 1,
                    purchaseType:     (reservation.purchase_type ?? "seats") as "seats" | "full_aircraft",
                    passengers,
                    amountTotalPaid:  payment.amount_total_paid,
                    appUrl:           process.env.NEXT_PUBLIC_APP_URL ?? "https://mobiusfly.com",
                }),
                ...(confirmationPdfAttachment ? { attachments: [confirmationPdfAttachment] } : {}),
            }),
        });
    }

    // ── Owner notification — with full flight manifest PDF ────────────────────
    const flightId = (reservation as any)?.flight_id as string | null;
    let manifestAttachment: { filename: string; content: string } | null = null;
    if (flightId) {
        try {
            const { passengers: manifestPassengers, reservations: manifestReservations } =
                await buildFlightManifestData(supabase, flightId, confirmedStatusId, {
                    id:                reservationId,
                    booking_reference: bookingReference,
                    contact_full_name: reservation.contact_full_name,
                    contact_email:     reservation.contact_email,
                    contact_phone:     reservation.contact_phone,
                    passengers:        (reservation?.passengers ?? []) as any[],
                });

            const pdfBuffer = await generateManifestPDF({
                flightCode:       flight?.flight_code ?? "",
                origin,
                destination,
                departureDate:    depDate,
                departureTime:    depTime,
                arrivalTime,
                departureFboName: flight?.departure_fbo_name ?? "",
                arrivalFboName:   flight?.arrival_fbo_name ?? null,
                aircraftType,
                tailNumber,
                passengers:       manifestPassengers,
                reservations:     manifestReservations,
                generatedAt:      new Date().toLocaleString("es-MX"),
            });

            manifestAttachment = {
                filename: `manifiesto-${flight?.flight_code ?? "vuelo"}.pdf`,
                content:  pdfBuffer.toString("base64"),
            };
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

