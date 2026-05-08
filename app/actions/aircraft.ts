"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AircraftListItem {
    id: string;
    model: string;
    manufacturer: string | null;
    tail_number: string;
    seats: number;
    year: number | null;
    status: string;
    photos: string[];
}

export interface AircraftDocumentRow {
    id: string;
    document_type: string;
    document_url: string;
    rejected_reason: string | null;
    document_status: { code: string } | null;
}

export interface AircraftDetailData {
    id: string;
    model: string;
    manufacturer: string | null;
    tail_number: string;
    seats: number;
    year: number | null;
    range_km: number | null;
    status: string;
    photos: string[];
    documents: AircraftDocumentRow[];
    upcoming_flights: number;
}

export interface AddAircraftInput {
    model: string;
    manufacturer: string;
    tailNumber: string;
    year: string;
    seats: string;
    photos: string[];
    documents: { type: string; url: string }[];
}

// ─── getAircraftList ──────────────────────────────────────────────────────────

export async function getAircraftList(userId: string): Promise<AircraftListItem[]> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return [];

    const { data, error } = await supabase
        .from("aircrafts")
        .select("id, model, manufacturer, tail_number, seats, year, status, photos")
        .eq("owner_id", owner.id)
        .order("model", { ascending: true });

    if (error) {
        console.error("[getAircraftList] error:", error.message);
        return [];
    }

    return (data ?? []) as AircraftListItem[];
}

// ─── getAircraftDetail ────────────────────────────────────────────────────────

export async function getAircraftDetail(
    aircraftId: string,
    userId: string,
): Promise<AircraftDetailData | null> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return null;

    const [aircraftRes, docsRes, flightsRes] = await Promise.all([
        supabase
            .from("aircrafts")
            .select("id, model, manufacturer, tail_number, seats, year, range_km, status, photos")
            .eq("id", aircraftId)
            .eq("owner_id", owner.id)
            .single(),

        supabase
            .from("aircraft_documents")
            .select(
                "id, document_type, document_url, rejected_reason, document_status:document_status!aircraft_documents_document_status_id_fkey(code)",
            )
            .eq("aircraft_id", aircraftId),

        supabase
            .from("flights")
            .select("id, status_id, flight_status:flight_status!flights_status_id_fkey(code)")
            .eq("aircraft_id", aircraftId),
    ]);

    if (aircraftRes.error || !aircraftRes.data) return null;

    const upcomingFlights = ((flightsRes.data ?? []) as any[]).filter(
        (f) => !["COMPLETED", "CANCELLED"].includes(f.flight_status?.code ?? ""),
    ).length;

    return {
        ...(aircraftRes.data as any),
        documents: (docsRes.data ?? []) as unknown as AircraftDocumentRow[],
        upcoming_flights: upcomingFlights,
    } as AircraftDetailData;
}

// ─── addAircraft ──────────────────────────────────────────────────────────────

export async function addAircraft(
    ownerId: string,
    input: AddAircraftInput,
): Promise<{ error: string | null; id: string | null }> {
    const supabase = await createClient();

    const pendingStatusId = await getPendingStatusId(supabase);

    const { data: aircraft, error: aircraftError } = await supabase
        .from("aircrafts")
        .insert({
            owner_id:     ownerId,
            model:        input.model.trim(),
            manufacturer: input.manufacturer.trim() || null,
            tail_number:  input.tailNumber.trim(),
            year:         input.year ? parseInt(input.year) : null,
            seats:        parseInt(input.seats),
            photos:       input.photos,
            status:       "ACTIVE",
        })
        .select("id")
        .single();

    if (aircraftError) {
        console.error("[addAircraft] error:", aircraftError.message);
        return { error: aircraftError.message, id: null };
    }

    if (input.documents.length > 0 && pendingStatusId) {
        const docRows = input.documents.map((d) => ({
            aircraft_id:        aircraft.id,
            document_type:      d.type,
            document_url:       d.url,
            document_status_id: pendingStatusId,
        }));

        const { error: docsError } = await supabase
            .from("aircraft_documents")
            .insert(docRows);

        if (docsError) {
            console.error("[addAircraft] docs error:", docsError.message);
        }
    }

    return { error: null, id: aircraft.id };
}

// ─── updateAircraft ───────────────────────────────────────────────────────────

export async function updateAircraft(
    aircraftId: string,
    ownerId: string,
    input: Pick<AddAircraftInput, "model" | "manufacturer" | "tailNumber" | "year" | "seats">,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("aircrafts")
        .update({
            model:        input.model.trim(),
            manufacturer: input.manufacturer.trim() || null,
            tail_number:  input.tailNumber.trim(),
            year:         input.year ? parseInt(input.year) : null,
            seats:        parseInt(input.seats),
        })
        .eq("id", aircraftId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[updateAircraft] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── updateAircraftStatus ─────────────────────────────────────────────────────

export async function updateAircraftStatus(
    aircraftId: string,
    ownerId: string,
    status: string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("aircrafts")
        .update({ status })
        .eq("id", aircraftId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[updateAircraftStatus] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

async function getPendingStatusId(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data } = await supabase
        .from("document_status")
        .select("id")
        .eq("code", "PENDING_REVIEW")
        .single();
    return data?.id ?? null;
}
