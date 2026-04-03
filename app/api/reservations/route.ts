import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createReservation } from "@/lib/reservations/create";
import { z } from "zod";

const uuidLike = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID");

const bodySchema = z.object({
    flightId:      uuidLike,
    purchaseType:  z.enum(["seats", "full_aircraft"]),
    seatsRequested:z.number().int().min(1).max(20),
    basePrice:     z.number().positive(),
    passengers:    z.array(z.object({
        slotType:    z.enum(["adult", "minor"]),
        fullName:    z.string().optional(),
        sex:         z.string().optional(),
        dateOfBirth: z.string().optional(),
        email:       z.string().optional(),
        phone:       z.string().optional(),
        documentUrl: z.string().optional(),
        isCompleted: z.boolean(),
        responsibleName:         z.string().optional(),
        responsibleRelationship: z.string().optional(),
        responsiblePhone:        z.string().optional(),
    })).min(1),
});

export async function POST(req: NextRequest) {
    try {
        // ── Optional auth — guests can purchase without an account ────────────
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // ── Validate body ─────────────────────────────────────────────────────
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

        const { flightId, purchaseType, seatsRequested, basePrice, passengers } = parsed.data;

        // ── Resolve contact info ──────────────────────────────────────────────
        let contactFullName: string;
        let contactEmail: string;
        let contactPhone: string | null;

        if (user) {
            // Authenticated: pull from profile
            const { data: profile } = await supabase
                .from("user_profiles")
                .select("first_name, last_name, phone")
                .eq("id", user.id)
                .single();

            contactFullName = profile
                ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                : user.email ?? "Pasajero";
            contactEmail = user.email!;
            contactPhone = profile?.phone ?? null;
        } else {
            // Guest: use first adult passenger's data
            const firstAdult = passengers.find((p) => p.slotType === "adult");
            if (!firstAdult?.email || firstAdult.email.trim() === "") {
                return NextResponse.json(
                    { error: "Se requiere un email de contacto para continuar." },
                    { status: 422 },
                );
            }
            contactFullName = firstAdult.fullName ?? "Pasajero";
            contactEmail    = firstAdult.email;
            contactPhone    = firstAdult.phone ?? null;
        }

        // ── Create reservation ────────────────────────────────────────────────
        const result = await createReservation({
            flightId,
            userId:        user?.id ?? null,
            purchaseType,
            seatsRequested,
            passengers,
            contactFullName,
            contactEmail,
            contactPhone,
            basePrice,
        });

        return NextResponse.json(result, { status: 201 });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (message === "NOT_ENOUGH_SEATS") {
            return NextResponse.json(
                { error: "No hay suficientes asientos disponibles para este vuelo." },
                { status: 409 },
            );
        }
        if (message === "FULL_AIRCRAFT_NOT_AVAILABLE") {
            return NextResponse.json(
                { error: "El avión completo ya no está disponible." },
                { status: 409 },
            );
        }
        if (message === "PASSENGER_INSERT_FAILED" || message === "PAYMENT_INSERT_FAILED") {
            return NextResponse.json(
                { error: "Error al crear la reserva. Los asientos han sido liberados. Por favor intenta de nuevo." },
                { status: 500 },
            );
        }

        console.error("[POST /api/reservations]", message);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
