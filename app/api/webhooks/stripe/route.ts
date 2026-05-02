import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { confirmReservationFromWebhook, BUSINESS_ERRORS } from "@/lib/payments/confirm";
import { confirmReservationFromPaymentIntent, INTENT_BUSINESS_ERRORS } from "@/lib/payments/confirmIntent";
import Stripe from "stripe";

// Next.js App Router — body is a ReadableStream by default, no body parsing
export async function POST(req: NextRequest) {
    const payload   = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("[stripe webhook] Missing STRIPE_WEBHOOK_SECRET");
        return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // ── Verify Stripe signature ───────────────────────────────────────────────
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown";
        console.error("[stripe webhook] Signature verification failed:", message);
        return NextResponse.json({ error: `Webhook signature invalid: ${message}` }, { status: 400 });
    }

    // ── Handle events ─────────────────────────────────────────────────────────
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await confirmReservationFromWebhook(session);
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.info(
                    `[stripe webhook] Checkout session expired: ${session.id}`,
                    `reservation: ${session.metadata?.reservation_id}`,
                );
                break;
            }

            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await confirmReservationFromPaymentIntent(paymentIntent);
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.info(
                    `[stripe webhook] PaymentIntent failed: ${paymentIntent.id}`,
                    `reservation: ${paymentIntent.metadata?.reservation_id}`,
                    `reason: ${paymentIntent.last_payment_error?.message}`,
                );
                break;
            }

            default:
                break;
        }

        return NextResponse.json({ received: true });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (BUSINESS_ERRORS.has(message) || INTENT_BUSINESS_ERRORS.has(message)) {
            // Known business states — retrying won't help, acknowledge to Stripe
            console.info(`[stripe webhook] Business exit (${message}) for event ${event.id}`);
            return NextResponse.json({ received: true, note: message });
        }

        // Infrastructure / unexpected error — return 500 so Stripe retries
        console.error(`[stripe webhook] Unhandled error for event ${event.id}:`, message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
