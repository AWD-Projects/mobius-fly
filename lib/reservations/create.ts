"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { calculatePaymentBreakdown } from "@/lib/payments/fees";
import type { StoredPassenger } from "@/store/useBookingStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateReservationInput {
    flightId:          string;
    userId:            string | null; // null for guest (unauthenticated) purchases
    purchaseType:      "seats" | "full_aircraft";
    seatsRequested:    number;
    passengers:        StoredPassenger[];
    contactFullName:   string;
    contactEmail:      string;
    contactPhone:      string | null;
    basePrice:         number; // price_per_seat × N  OR  price_full_aircraft
}

export interface CreateReservationResult {
    reservationId:    string;
    bookingReference: string;
    blockedUntil:     string; // ISO 8601
    amountTotalPaid:  number;
    breakdown:        ReturnType<typeof calculatePaymentBreakdown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateBookingReference(): string {
    const digits = Math.floor(100000 + Math.random() * 900000).toString();
    return `MOB-${digits}`;
}

// Atomically cancels a BLOCKED reservation and restores its seats.
// Used as a compensation transaction when post-RPC inserts fail.
async function compensate(
    supabase: ReturnType<typeof createAdminClient>,
    reservationId: string,
): Promise<void> {
    try {
        await supabase.rpc("cancel_blocked_reservation", {
            p_reservation_id: reservationId,
        });
    } catch (err) {
        // Log as critical — seats may stay locked until pg_cron frees them (~1 min)
        console.error(
            "[createReservation] CRITICAL: compensation RPC failed — seats may still be locked for reservation:",
            reservationId,
            err instanceof Error ? err.message : err,
        );
    }
}

// ─── createReservation ────────────────────────────────────────────────────────

export async function createReservation(
    input: CreateReservationInput,
): Promise<CreateReservationResult> {
    const supabase = createAdminClient();

    const {
        flightId,
        userId,
        purchaseType,
        seatsRequested,
        passengers,
        contactFullName,
        contactEmail,
        contactPhone,
        basePrice,
    } = input;

    const breakdown = calculatePaymentBreakdown(basePrice);

    // ── 1. Atomic seat lock + reservation creation (with booking ref retry) ───
    // MOB-XXXXXX has 1M combinations; retry up to 3 times on unique constraint
    // collision (PostgreSQL error code 23505) before giving up.
    const MAX_REF_ATTEMPTS = 3;
    let resId!: string;
    let bookingReference!: string;

    for (let attempt = 1; attempt <= MAX_REF_ATTEMPTS; attempt++) {
        bookingReference = generateBookingReference();

        const { data: reservationId, error: rpcError } = await supabase.rpc(
            "lock_seats_and_create_reservation",
            {
                p_flight_id:         flightId,
                p_user_id:           userId,
                p_purchase_type:     purchaseType,
                p_seats_requested:   seatsRequested,
                p_booking_reference: bookingReference,
                p_contact_full_name: contactFullName,
                p_contact_email:     contactEmail,
                p_contact_phone:     contactPhone ?? null,
                p_base_price_total:  breakdown.base_price,
            },
        );

        if (!rpcError) {
            if (!reservationId) throw new Error("Reservation creation returned no ID");
            resId = reservationId as string;
            break;
        }

        const msg  = rpcError.message ?? "";
        const code = (rpcError as { code?: string }).code ?? "";

        if (msg.includes("FLIGHT_DEPARTURE_TOO_SOON"))    throw new Error("FLIGHT_DEPARTURE_TOO_SOON");
        if (msg.includes("NOT_ENOUGH_SEATS"))            throw new Error("NOT_ENOUGH_SEATS");
        if (msg.includes("FULL_AIRCRAFT_NOT_AVAILABLE")) throw new Error("FULL_AIRCRAFT_NOT_AVAILABLE");

        // Unique violation on booking_reference — retry with a new reference
        if (code === "23505" || msg.includes("unique") || msg.includes("booking_reference")) {
            if (attempt === MAX_REF_ATTEMPTS) {
                throw new Error(`Reservation creation failed after ${MAX_REF_ATTEMPTS} attempts (booking reference collision)`);
            }
            continue;
        }

        throw new Error(`Reservation creation failed: ${msg}`);
    }

    // ── 2. Insert passenger rows ──────────────────────────────────────────────
    const passengerRows = passengers.map((p) => ({
        reservation_id: resId,
        full_name:      p.fullName ?? "",
        date_of_birth:  p.dateOfBirth ?? null,
        gender:         p.sex ? p.sex.toUpperCase() : null,
        email:          p.email ?? null,
        phone:          p.phone ?? null,
        document_type:  "INE",
        document_url:   p.documentUrl ?? null,
        is_minor:       p.slotType === "minor",
    }));

    const { error: passengerError } = await supabase
        .from("reservation_passengers")
        .insert(passengerRows);

    if (passengerError) {
        console.error("[createReservation] passenger insert failed — compensating:", passengerError.message);
        await compensate(supabase, resId);
        throw new Error("PASSENGER_INSERT_FAILED");
    }

    // ── 3. Create PENDING payment row ─────────────────────────────────────────
    const { error: paymentError } = await supabase.from("payments").insert({
        reservation_id:               resId,
        flight_id:                    flightId,
        user_id:                      userId,
        payer_email:                  contactEmail,
        stripe_checkout_session_id:   `pending_${resId}`,
        base_price:                   breakdown.base_price,
        passenger_fee_rate:           breakdown.passenger_fee_rate,
        mobius_commission_rate:       breakdown.mobius_commission_rate,
        vat_rate:                     breakdown.vat_rate,
        passenger_fee_amount:         breakdown.passenger_fee_amount,
        mobius_commission_amount:     breakdown.mobius_commission_amount,
        mobius_commission_vat_amount: breakdown.mobius_commission_vat_amount,
        vat_amount_total:             breakdown.vat_amount_total,
        amount_total_paid:            breakdown.amount_total_paid,
        amount_owner_net:             breakdown.amount_owner_net,
        amount_mobius_total:          breakdown.amount_mobius_total,
        status:                       "PENDING",
    });

    if (paymentError) {
        console.error("[createReservation] payment insert failed — compensating:", paymentError.message);
        await compensate(supabase, resId);
        throw new Error("PAYMENT_INSERT_FAILED");
    }

    // ── 4. Fetch blocked_until from DB (authoritative server time) ────────────
    const { data: reservation } = await supabase
        .from("reservations")
        .select("blocked_until")
        .eq("id", resId)
        .single();

    return {
        reservationId:   resId,
        bookingReference,
        blockedUntil:    reservation?.blocked_until ?? new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        amountTotalPaid: breakdown.amount_total_paid,
        breakdown,
    };
}
