import type { SupabaseClient } from "@supabase/supabase-js";
import type { ManifestPassenger, ManifestReservation } from "@/lib/emails/manifest-pdf";

export interface ManifestBuildResult {
    passengers:   ManifestPassenger[];
    reservations: ManifestReservation[];
}

/**
 * Fetches ALL confirmed passengers on a flight for the operator manifest.
 * Always includes the current reservation's passengers as a guaranteed fallback
 * so the manifest is never empty even if the broader DB query has issues.
 */
export async function buildFlightManifestData(
    supabase:          SupabaseClient,
    flightId:          string,
    confirmedStatusId: string,
    // Current reservation — used as guaranteed fallback
    currentReservation: {
        id:                string;
        booking_reference: string;
        contact_full_name: string | null;
        contact_email:     string | null;
        contact_phone:     string | null;
        passengers:        Array<{
            full_name:     string;
            date_of_birth: string | null;
            gender:        string | null;
            is_minor:      boolean;
            document_type: string;
        }>;
    },
): Promise<ManifestBuildResult> {

    // ── 1. All confirmed reservations for this flight ─────────────────────────
    const { data: confirmedReservations, error: resErr } = await supabase
        .from("reservations")
        .select("id, booking_reference, contact_full_name, contact_email, contact_phone")
        .eq("flight_id", flightId)
        .eq("reservation_status_id", confirmedStatusId)
        .order("confirmed_at", { ascending: true });

    if (resErr) {
        console.error("[manifest] Failed to fetch confirmed reservations:", resErr.message);
    }

    // Build reservation list — always include the current one
    const resList: typeof confirmedReservations = [...(confirmedReservations ?? [])];
    const hasCurrentRes = resList.some((r) => r.id === currentReservation.id);
    if (!hasCurrentRes) {
        resList.push({
            id:                currentReservation.id,
            booking_reference: currentReservation.booking_reference,
            contact_full_name: currentReservation.contact_full_name,
            contact_email:     currentReservation.contact_email,
            contact_phone:     currentReservation.contact_phone,
        });
    }

    const confirmedIds = resList.map((r) => r.id);
    const refMap: Record<string, string> = Object.fromEntries(
        resList.map((r) => [r.id, r.booking_reference]),
    );

    // ── 2. All passengers for confirmed reservations ──────────────────────────
    const { data: allPax, error: paxErr } = await supabase
        .from("reservation_passengers")
        .select("full_name, date_of_birth, gender, is_minor, document_type, reservation_id")
        .in("reservation_id", confirmedIds);

    if (paxErr) {
        console.error("[manifest] Failed to fetch passengers:", paxErr.message);
    }

    // Merge fetched passengers with the current reservation's passengers (fallback)
    const paxMap = new Map<string, { full_name: string; date_of_birth: string | null; gender: string | null; is_minor: boolean; document_type: string; reservation_id: string }>();

    for (const p of (allPax ?? [])) {
        paxMap.set(`${p.reservation_id}::${p.full_name}`, {
            full_name:     p.full_name,
            date_of_birth: p.date_of_birth,
            gender:        p.gender,
            is_minor:      p.is_minor ?? false,
            document_type: p.document_type,
            reservation_id: p.reservation_id,
        });
    }

    // Guarantee current reservation passengers are always present
    for (const p of currentReservation.passengers) {
        const key = `${currentReservation.id}::${p.full_name}`;
        if (!paxMap.has(key)) {
            paxMap.set(key, {
                full_name:     p.full_name,
                date_of_birth: p.date_of_birth,
                gender:        p.gender,
                is_minor:      p.is_minor,
                document_type: p.document_type,
                reservation_id: currentReservation.id,
            });
        }
    }

    const passengers: ManifestPassenger[] = [...paxMap.values()].map((p) => ({
        full_name:         p.full_name        ?? "—",
        date_of_birth:     p.date_of_birth    ?? null,
        gender:            p.gender           ?? null,
        is_minor:          p.is_minor         ?? false,
        document_type:     p.document_type    ?? "",
        booking_reference: refMap[p.reservation_id] ?? currentReservation.booking_reference,
    }));

    const reservations: ManifestReservation[] = resList.map((r) => ({
        booking_reference: r.booking_reference ?? "",
        contact_full_name: r.contact_full_name ?? "—",
        contact_email:     r.contact_email     ?? "—",
        contact_phone:     r.contact_phone     ?? null,
    }));

    return { passengers, reservations };
}
