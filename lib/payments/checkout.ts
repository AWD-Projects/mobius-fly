import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export interface CreateCheckoutSessionInput {
    reservationId:    string;
    flightId:         string;
    bookingReference: string;
    amountTotalPaid:  number; // in MXN
    flightDescription:string; // e.g. "MEX → CUN · 2 asientos"
    userEmail:        string;
}

export interface CreateCheckoutSessionResult {
    checkoutUrl: string;
    sessionId:   string;
}

export async function createCheckoutSession(
    input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
    const supabase = createAdminClient();

    const {
        reservationId,
        flightId,
        bookingReference,
        amountTotalPaid,
        flightDescription,
        userEmail,
    } = input;

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

    if (resError || !reservation) {
        throw new Error("RESERVATION_NOT_FOUND");
    }

    const statusRaw  = reservation.reservation_status;
    const statusCode = (Array.isArray(statusRaw) ? statusRaw[0] : statusRaw as unknown as { code: string } | null)?.code;

    if (statusCode !== "BLOCKED") {
        throw new Error(statusCode === "EXPIRED" ? "RESERVATION_EXPIRED" : "RESERVATION_NOT_BLOCKED");
    }

    const blockedUntil = new Date(reservation.blocked_until);
    if (blockedUntil < new Date()) {
        throw new Error("RESERVATION_EXPIRED");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // ── 2. Create Stripe Checkout Session ────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
        mode:                 "payment",
        currency:             "mxn",
        customer_email:       userEmail,
        payment_method_types: ["card"],
        line_items: [
            {
                quantity:   1,
                price_data: {
                    currency:     "mxn",
                    unit_amount:  Math.round(amountTotalPaid * 100), // Stripe uses cents
                    product_data: {
                        name:        `Mobius Fly — ${bookingReference}`,
                        description: flightDescription,
                    },
                },
            },
        ],
        metadata: {
            reservation_id:    reservationId,
            booking_reference: bookingReference,
            flight_id:         flightId,
        },
        success_url: `${appUrl}/thank-you?ref=${bookingReference}`,
        cancel_url:  `${appUrl}/flights/${flightId}/payment?reservation_id=${reservationId}&cancelled=1`,
    });

    if (!session.url) {
        throw new Error("Stripe did not return a checkout URL");
    }

    // ── 3. Store Stripe session ID in payments row ────────────────────────────
    await supabase
        .from("payments")
        .update({
            stripe_checkout_session_id: session.id,
            updated_at:                 new Date().toISOString(),
        })
        .eq("reservation_id", reservationId)
        .eq("status", "PENDING");

    return {
        checkoutUrl: session.url,
        sessionId:   session.id,
    };
}
