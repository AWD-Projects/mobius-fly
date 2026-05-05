import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export interface CreatePaymentIntentInput {
    reservationId:     string;
    flightId:          string;
    bookingReference:  string;
    // amountTotalPaid intentionally omitted — server reads from DB to prevent client-side tampering
    flightDescription: string;
    userEmail:         string;
}

export interface CreatePaymentIntentResult {
    clientSecret:    string;
    paymentIntentId: string;
}

export async function createPaymentIntent(
    input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResult> {
    const supabase = createAdminClient();
    const { reservationId, flightId, bookingReference, flightDescription, userEmail } = input;

    // ── 1. Verify reservation is still BLOCKED and not expired ───────────────
    const { data: reservation, error: resError } = await supabase
        .from("reservations")
        .select(`
            id,
            blocked_until,
            reservation_status:reservation_status!reservations_reservation_status_id_fkey (code)
        `)
        .eq("id", reservationId)
        .single();

    if (resError || !reservation) throw new Error("RESERVATION_NOT_FOUND");

    const statusRaw  = reservation.reservation_status;
    const statusCode = (Array.isArray(statusRaw) ? statusRaw[0] : statusRaw as unknown as { code: string } | null)?.code;

    if (statusCode !== "BLOCKED") {
        throw new Error(statusCode === "EXPIRED" ? "RESERVATION_EXPIRED" : "RESERVATION_NOT_BLOCKED");
    }

    if (new Date(reservation.blocked_until) < new Date()) {
        throw new Error("RESERVATION_EXPIRED");
    }

    // ── 2. Fetch payment row — server-authoritative amount + idempotency key ──
    const { data: paymentRow } = await supabase
        .from("payments")
        .select("id, amount_total_paid, stripe_payment_intent_id")
        .eq("reservation_id", reservationId)
        .eq("status", "PENDING")
        .maybeSingle();

    if (!paymentRow) throw new Error("RESERVATION_NOT_FOUND");

    // ── 3. Idempotency: return existing PI if already created ─────────────────
    // Prevents double-charging if the client calls this endpoint twice.
    if (paymentRow.stripe_payment_intent_id) {
        try {
            const existing = await stripe.paymentIntents.retrieve(paymentRow.stripe_payment_intent_id);
            if (existing.client_secret && existing.status !== "canceled") {
                return {
                    clientSecret:    existing.client_secret,
                    paymentIntentId: existing.id,
                };
            }
        } catch {
            // PI not found or inaccessible in Stripe — fall through to create a fresh one
        }
    }

    // ── 4. Create PaymentIntent with server-side amount (not client-provided) ─
    const paymentIntent = await stripe.paymentIntents.create({
        amount:                    Math.round(paymentRow.amount_total_paid * 100),
        currency:                  "mxn",
        automatic_payment_methods: { enabled: true },
        receipt_email:             userEmail,
        description:               `Mobius Fly — ${bookingReference} · ${flightDescription}`,
        metadata: {
            reservation_id:    reservationId,
            booking_reference: bookingReference,
            flight_id:         flightId,
        },
    });

    if (!paymentIntent.client_secret) {
        throw new Error("Stripe did not return a client secret");
    }

    // ── 5. Store PaymentIntent ID — only if no concurrent request already did ──
    // Uses IS NULL guard to detect a race: if 0 rows updated, another request
    // already saved a different PI. Cancel ours and return theirs.
    const { data: updated } = await supabase
        .from("payments")
        .update({
            stripe_payment_intent_id: paymentIntent.id,
            updated_at:               new Date().toISOString(),
        })
        .eq("id", paymentRow.id)
        .eq("status", "PENDING")
        .is("stripe_payment_intent_id", null)
        .select("id");

    if (!updated || updated.length === 0) {
        // Another concurrent request already saved a PI — cancel ours and use theirs
        await stripe.paymentIntents.cancel(paymentIntent.id).catch(() => {});
        const { data: saved } = await supabase
            .from("payments")
            .select("stripe_payment_intent_id")
            .eq("id", paymentRow.id)
            .single();
        if (!saved?.stripe_payment_intent_id) throw new Error("PI_CONFLICT_UNRESOLVABLE");
        const existing = await stripe.paymentIntents.retrieve(saved.stripe_payment_intent_id);
        if (!existing.client_secret) throw new Error("PI_CONFLICT_UNRESOLVABLE");
        return {
            clientSecret:    existing.client_secret,
            paymentIntentId: existing.id,
        };
    }

    return {
        clientSecret:    paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    };
}
