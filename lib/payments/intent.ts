import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export interface CreatePaymentIntentInput {
    reservationId:     string;
    flightId:          string;
    bookingReference:  string;
    amountTotalPaid:   number;  // MXN
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
    const { reservationId, flightId, bookingReference, amountTotalPaid, flightDescription, userEmail } = input;

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

    // ── 2. Create PaymentIntent ───────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
        amount:                    Math.round(amountTotalPaid * 100),
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

    // ── 3. Store PaymentIntent ID so the webhook can look it up ──────────────
    await supabase
        .from("payments")
        .update({
            stripe_payment_intent_id: paymentIntent.id,
            updated_at:               new Date().toISOString(),
        })
        .eq("reservation_id", reservationId)
        .eq("status", "PENDING");

    return {
        clientSecret:    paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    };
}
