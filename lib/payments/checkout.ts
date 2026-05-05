import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export interface CreateCheckoutSessionInput {
    reservationId:     string;
    flightId:          string;
    bookingReference:  string;
    // amountTotalPaid intentionally omitted — server reads from DB to prevent client-side tampering
    flightDescription: string;
    userEmail:         string;
}

export interface CreateCheckoutSessionResult {
    checkoutUrl: string;
    sessionId:   string;
}

export async function createCheckoutSession(
    input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
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

    // ── 2. Fetch payment row — server-authoritative amount + idempotency key ──
    const { data: paymentRow } = await supabase
        .from("payments")
        .select("id, amount_total_paid, stripe_checkout_session_id")
        .eq("reservation_id", reservationId)
        .eq("status", "PENDING")
        .maybeSingle();

    if (!paymentRow) throw new Error("RESERVATION_NOT_FOUND");

    // ── 3. Idempotency: return existing session if already created ────────────
    // stripe_checkout_session_id is initialised to `pending_{reservationId}` as a
    // placeholder; a real session starts with "cs_".
    if (
        paymentRow.stripe_checkout_session_id &&
        !paymentRow.stripe_checkout_session_id.startsWith("pending_")
    ) {
        try {
            const existing = await stripe.checkout.sessions.retrieve(paymentRow.stripe_checkout_session_id);
            if (existing.url && existing.status !== "expired") {
                return {
                    checkoutUrl: existing.url,
                    sessionId:   existing.id,
                };
            }
        } catch {
            // Session not found or expired in Stripe — fall through to create a fresh one
        }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // ── 4. Create Stripe Checkout Session with server-side amount ─────────────
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
                    unit_amount:  Math.round(paymentRow.amount_total_paid * 100),
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

    // ── 5. Store real session ID (replaces the pending_ placeholder) ──────────
    // The .like() guard ensures we only overwrite the placeholder — not a real
    // session that a concurrent request may have already written.
    await supabase
        .from("payments")
        .update({
            stripe_checkout_session_id: session.id,
            updated_at:                 new Date().toISOString(),
        })
        .eq("id", paymentRow.id)
        .eq("status", "PENDING")
        .like("stripe_checkout_session_id", "pending_%");

    return {
        checkoutUrl: session.url,
        sessionId:   session.id,
    };
}
