import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentIntent } from "@/lib/payments/intent";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const limiter = rateLimit({ limit: 10, windowMs: 60_000 });

const uuidLike = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID");

const bodySchema = z.object({
    reservationId:     uuidLike,
    flightId:          uuidLike,
    bookingReference:  z.string().min(1),
    amountTotalPaid:   z.number().positive(),
    flightDescription: z.string().min(1),
});

export async function POST(req: NextRequest) {
    const limited = limiter(req);
    if (limited) return limited;

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 422 },
            );
        }

        const { reservationId, flightId, bookingReference, amountTotalPaid, flightDescription } = parsed.data;

        // Resolve payer email (auth user or guest stored during reservation)
        let userEmail: string;
        if (user?.email) {
            userEmail = user.email;
        } else {
            const { createAdminClient } = await import("@/lib/supabase/server");
            const admin = createAdminClient();
            const { data: payment } = await admin
                .from("payments")
                .select("payer_email")
                .eq("reservation_id", reservationId)
                .single();
            if (!payment?.payer_email) {
                return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
            }
            userEmail = payment.payer_email;
        }

        const result = await createPaymentIntent({
            reservationId,
            flightId,
            bookingReference,
            amountTotalPaid,
            flightDescription,
            userEmail,
        });

        return NextResponse.json(result);

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (message === "RESERVATION_EXPIRED") {
            return NextResponse.json(
                { error: "Tu reserva ha expirado. Por favor busca otro vuelo." },
                { status: 410 },
            );
        }
        if (message === "RESERVATION_NOT_FOUND") {
            return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
        }
        if (message === "RESERVATION_NOT_BLOCKED") {
            return NextResponse.json(
                { error: "Esta reserva ya no se puede pagar." },
                { status: 409 },
            );
        }

        console.error("[POST /api/payments/intent]", message);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
