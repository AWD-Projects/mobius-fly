import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createReservation } from "@/lib/reservations/create";
import { allowed, clientIp, tooManyRequests } from "@/lib/rate-limit-db";
import { z } from "zod";

const PASSENGER_DOC_RE =
    /^passenger-documents:(pending|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpg|png)$/i;

const uuidLike = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID");

const bodySchema = z.object({
    flightId:      uuidLike,
    purchaseType:  z.enum(["seats", "full_aircraft"]),
    seatsRequested:z.number().int().min(1).max(20),
    // basePrice is intentionally NOT accepted: the price is computed server-side
    // from the flight row. Unknown keys sent by old clients are stripped by Zod.
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
    if (!(await allowed(`reservations:ip:${clientIp(req)}`, 10, 60))) {
        return tooManyRequests(60);
    }

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

        const { flightId, purchaseType, seatsRequested, passengers } = parsed.data;

        // By seats: one passenger per seat. Full aircraft: the whole plane is bought
        // (seatsRequested is its capacity) and travelers may be fewer than seats.
        const passengerCountOk = purchaseType === "full_aircraft"
            ? passengers.length >= 1 && passengers.length <= seatsRequested
            : passengers.length === seatsRequested;

        if (!passengerCountOk) {
            return NextResponse.json(
                { error: "El número de pasajeros no coincide con los asientos solicitados." },
                { status: 422 },
            );
        }

        // ── Every passenger must carry a real, server-side identity document ──
        for (const p of passengers) {
            const ref = p.documentUrl ?? "";
            let valid = false;

            const m = PASSENGER_DOC_RE.exec(ref);
            if (m) {
                // Uploaded files live under the uploader's own folder.
                const folder = m[1].toLowerCase();
                valid = user ? folder === user.id.toLowerCase() : folder === "pending";
            } else if (user && ref.startsWith("identity-documents:")) {
                // Passenger #1 may reuse the account's own identity document.
                const path = ref.slice("identity-documents:".length);
                const { data: own } = await supabase
                    .from("user_documents")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("document_type", "IDENTITY")
                    .eq("document_url", path)
                    .limit(1)
                    .maybeSingle();
                valid = !!own;
            }

            if (!valid) {
                return NextResponse.json(
                    { error: "Cada pasajero debe adjuntar un documento de identidad válido." },
                    { status: 422 },
                );
            }
        }

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

            const nameFromProfile = profile
                ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                : "";
            const firstAdultName = passengers.find((p) => p.slotType === "adult")?.fullName ?? "";
            contactFullName = nameFromProfile || firstAdultName || "Pasajero";
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
        });

        return NextResponse.json(result, { status: 201 });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (message === "FLIGHT_NOT_FOUND") {
            return NextResponse.json({ error: "Vuelo no encontrado." }, { status: 404 });
        }
        if (message === "FLIGHT_NOT_AVAILABLE") {
            return NextResponse.json(
                { error: "Este vuelo no está disponible para reservar." },
                { status: 409 },
            );
        }
        if (message === "INVALID_PURCHASE_TYPE" || message === "INVALID_SEATS_REQUESTED") {
            return NextResponse.json(
                { error: "La solicitud de compra no es válida." },
                { status: 422 },
            );
        }
        if (message === "PRICE_MISMATCH" || message === "INVALID_FLIGHT_PRICE") {
            return NextResponse.json(
                { error: "El precio del vuelo cambió. Recarga la página e intenta de nuevo." },
                { status: 409 },
            );
        }
        if (message === "FLIGHT_DEPARTURE_TOO_SOON") {
            return NextResponse.json(
                { error: "Este vuelo no puede reservarse con menos de 3 horas de anticipación al despegue." },
                { status: 409 },
            );
        }
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
