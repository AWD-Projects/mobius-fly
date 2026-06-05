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
    aircraft_type: AircraftType | null;
    doc_status?: "missing" | "pending" | "rejected" | "approved";
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

export type AircraftType = "vlj" | "light" | "midsize" | "super_midsize" | "heavy" | "ultra_long" | "turboprop" | "piston" | "helicopter";

export interface AddAircraftInput {
    model: string;
    manufacturer: string;
    tailNumber: string;
    year: string;
    seats: string;
    aircraftType: AircraftType | "";
    photos: string[];
    documents: { type: string; url: string }[];
}

// ─── getAllAircraftForManagement ──────────────────────────────────────────────
// For the management page: all aircraft (all statuses) with computed doc_status.

export async function getAllAircraftForManagement(userId: string): Promise<AircraftListItem[]> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return [];

    const { data, error } = await supabase
        .from("aircrafts")
        .select(`
            id, model, manufacturer, tail_number, seats, year, status, photos, aircraft_type,
            aircraft_documents!aircraft_documents_aircraft_id_fkey(
                document_status:document_status!aircraft_documents_document_status_id_fkey(code)
            )
        `)
        .eq("owner_id", owner.id)
        .order("model", { ascending: true });

    if (error) {
        console.error("[getAllAircraftForManagement] error:", error.message);
        return [];
    }

    return ((data ?? []) as any[]).map((row) => {
        const docs = (row.aircraft_documents ?? []) as { document_status: { code: string } | null }[];
        let doc_status: AircraftListItem["doc_status"] = "missing";
        if (docs.length > 0) {
            const codes = docs.map((d) => d.document_status?.code ?? "");
            if (codes.some((c) => c === "REJECTED"))       doc_status = "rejected";
            else if (codes.some((c) => c === "PENDING_REVIEW")) doc_status = "pending";
            else                                            doc_status = "approved";
        }
        return {
            id:            row.id,
            model:         row.model,
            manufacturer:  row.manufacturer,
            tail_number:   row.tail_number,
            seats:         row.seats,
            year:          row.year,
            status:        row.status,
            photos:        row.photos,
            aircraft_type: row.aircraft_type ?? null,
            doc_status,
        } satisfies AircraftListItem;
    });
}

// ─── getAircraftList ──────────────────────────────────────────────────────────

async function getUnapprovedAircraftIds(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string[]> {
    const { data: approvedStatus } = await supabase
        .from("document_status")
        .select("id")
        .eq("code", "APPROVED")
        .single();

    if (!approvedStatus) return [];

    const { data: nonApproved } = await supabase
        .from("aircraft_documents")
        .select("aircraft_id")
        .neq("document_status_id", approvedStatus.id);

    return [...new Set((nonApproved ?? []).map((d: any) => d.aircraft_id))];
}

export async function getAircraftList(userId: string): Promise<AircraftListItem[]> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return [];

    const unapprovedIds = await getUnapprovedAircraftIds(supabase);

    let query = supabase
        .from("aircrafts")
        .select("id, model, manufacturer, tail_number, seats, year, status, photos, aircraft_type")
        .eq("owner_id", owner.id)
        .eq("status", "ACTIVE")
        .order("model", { ascending: true });

    if (unapprovedIds.length > 0) {
        query = query.not("id", "in", `(${unapprovedIds.join(",")})`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("[getAircraftList] error:", error.message);
        return [];
    }

    return (data ?? []) as AircraftListItem[];
}

// ─── getAvailableAircraftForTimeSlot ─────────────────────────────────────────

export async function getAvailableAircraftForTimeSlot(
    ownerId: string,
    departureDatetime: string,
    arrivalDatetime: string,
    excludeFlightId?: string,
): Promise<AircraftListItem[]> {
    const supabase = await createClient();

    const { data: closedStatuses } = await supabase
        .from("flight_status")
        .select("id")
        .in("code", ["COMPLETED", "CANCELLED"]);

    const closedIds = (closedStatuses ?? []).map((r: any) => r.id);

    // Get aircraft IDs that have a conflicting flight in the requested time slot
    let conflictQuery = supabase
        .from("flights")
        .select("aircraft_id")
        .lt("departure_datetime", arrivalDatetime)
        .gt("arrival_datetime",   departureDatetime);

    if (closedIds.length > 0) {
        conflictQuery = conflictQuery.not("status_id", "in", `(${closedIds.join(",")})`);
    }
    if (excludeFlightId) {
        conflictQuery = conflictQuery.neq("id", excludeFlightId);
    }

    const { data: conflicting } = await conflictQuery;
    const busyIds = [...new Set((conflicting ?? []).map((f: any) => f.aircraft_id))];

    const unapprovedIds = await getUnapprovedAircraftIds(supabase);
    const excludedIds = [...new Set([...busyIds, ...unapprovedIds])];

    let query = supabase
        .from("aircrafts")
        .select("id, model, manufacturer, tail_number, seats, year, status, photos, aircraft_type")
        .eq("owner_id", ownerId)
        .eq("status", "ACTIVE")
        .order("model", { ascending: true });

    if (excludedIds.length > 0) {
        query = query.not("id", "in", `(${excludedIds.join(",")})`);
    }

    const { data, error } = await query;
    if (error) {
        console.error("[getAvailableAircraftForTimeSlot] error:", error.message);
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
            owner_id:      ownerId,
            model:         input.model.trim(),
            manufacturer:  input.manufacturer.trim() || null,
            tail_number:   input.tailNumber.trim(),
            year:          input.year ? parseInt(input.year) : null,
            seats:         parseInt(input.seats),
            aircraft_type: input.aircraftType || null,
            photos:        input.photos,
            status:        "ACTIVE",
        })
        .select("id")
        .single();

    if (aircraftError) {
        console.error("[addAircraft] error:", aircraftError.message);
        if (aircraftError.message.includes("tail_number") && aircraftError.message.includes("unique")) {
            return { error: "Esta matrícula ya está registrada. Usa una matrícula diferente.", id: null };
        }
        return { error: "No se pudo registrar la aeronave. Inténtalo de nuevo.", id: null };
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
        if (error.message.includes("tail_number") && error.message.includes("unique")) {
            return { error: "Esta matrícula ya está registrada. Usa una matrícula diferente." };
        }
        return { error: "No se pudo actualizar la aeronave. Inténtalo de nuevo." };
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

// ─── deleteAircraft ───────────────────────────────────────────────────────────

export async function deleteAircraft(
    aircraftId: string,
    ownerId:    string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    // Block if any flights reference this aircraft (aircraft_id is NOT NULL)
    const { count } = await supabase
        .from("flights")
        .select("id", { count: "exact", head: true })
        .eq("aircraft_id", aircraftId);

    if ((count ?? 0) > 0) {
        return { error: "No se puede eliminar: la aeronave tiene vuelos asociados. Elimina o reasigna los vuelos primero." };
    }

    // Delete aircraft (aircraft_documents cascade automatically)
    const { error } = await supabase
        .from("aircrafts")
        .delete()
        .eq("id", aircraftId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[deleteAircraft] error:", error.message);
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
