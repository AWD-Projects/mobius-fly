"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CrewListItem {
    id: string;
    first_name: string;
    last_name: string;
    status: string;
    license_number: string | null;
    email: string | null;
    phone: string | null;
    crew_role: { code: string } | null;
}

export interface CrewRoleRow {
    id: string;
    code: string;
    name: string | null;
}

export interface AddCrewMemberInput {
    firstName: string;
    lastName: string;
    crewRoleId: string;
    licenseNumber: string;
    phone: string;
}

// ─── getCrewRoles ─────────────────────────────────────────────────────────────

export async function getCrewRoles(): Promise<CrewRoleRow[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("crew_roles")
        .select("id, code, name")
        .order("code");

    if (error) {
        console.error("[getCrewRoles] error:", error.message);
        return [];
    }

    return (data ?? []) as CrewRoleRow[];
}

// ─── addCrewMember ────────────────────────────────────────────────────────────

export async function addCrewMember(
    ownerId: string,
    input: AddCrewMemberInput,
): Promise<{ error: string | null; id: string | null }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("crew_members")
        .insert({
            owner_id:       ownerId,
            first_name:     input.firstName.trim(),
            last_name:      input.lastName.trim(),
            crew_role_id:   input.crewRoleId,
            license_number: input.licenseNumber.trim() || null,
            phone:          input.phone.trim() || null,
            status:         "ACTIVE",
        })
        .select("id")
        .single();

    if (error) {
        console.error("[addCrewMember] error:", error.message);
        return { error: error.message, id: null };
    }

    return { error: null, id: data.id };
}

export interface CrewDocumentRow {
    id: string;
    document_type: string;
    document_url: string;
    rejected_reason: string | null;
    document_status: { code: string } | null;
}

export interface AssignedFlightRow {
    flight_id: string;
    departure_iata: string;
    arrival_iata: string;
    departure_datetime: string;
    tail_number: string;
    status_code: string;
}

export interface CrewDetailData {
    id: string;
    first_name: string;
    last_name: string;
    status: string;
    license_number: string | null;
    email: string | null;
    phone: string | null;
    crew_role: { id: string; code: string; name: string | null } | null;
    documents: CrewDocumentRow[];
    assigned_flights: AssignedFlightRow[];
}

// ─── getCrewMemberDetail ──────────────────────────────────────────────────────

export async function getCrewMemberDetail(
    crewId: string,
    userId: string,
): Promise<CrewDetailData | null> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return null;

    const [memberRes, docsRes, flightCrewRes] = await Promise.all([
        supabase
            .from("crew_members")
            .select(
                "id, first_name, last_name, status, license_number, email, phone, crew_role:crew_roles!crew_members_crew_role_id_fkey(id, code, name)",
            )
            .eq("id", crewId)
            .eq("owner_id", owner.id)
            .single(),

        supabase
            .from("crew_documents")
            .select(
                "id, document_type, document_url, rejected_reason, document_status:document_status!crew_documents_document_status_id_fkey(code)",
            )
            .eq("crew_member_id", crewId),

        supabase
            .from("flight_crew")
            .select(`
                flight_id,
                flights:flights!flight_crew_flight_id_fkey(
                    id, departure_datetime,
                    departure_airport:airports!flights_departure_airport_id_fkey(iata_code),
                    arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code),
                    aircraft:aircrafts!flights_aircraft_id_fkey(tail_number),
                    flight_status:flight_status!flights_status_id_fkey(code)
                )
            `)
            .eq("crew_member_id", crewId),
    ]);

    if (memberRes.error || !memberRes.data) return null;

    const assignedFlights: AssignedFlightRow[] = ((flightCrewRes.data ?? []) as any[]).map((fc) => {
        const f = fc.flights as any;
        return {
            flight_id:          fc.flight_id,
            departure_iata:     f?.departure_airport?.iata_code ?? "—",
            arrival_iata:       f?.arrival_airport?.iata_code  ?? "—",
            departure_datetime: f?.departure_datetime           ?? "",
            tail_number:        f?.aircraft?.tail_number        ?? "—",
            status_code:        f?.flight_status?.code          ?? "",
        };
    });

    return {
        ...(memberRes.data as any),
        documents:        (docsRes.data ?? []) as unknown as CrewDocumentRow[],
        assigned_flights: assignedFlights,
    } as CrewDetailData;
}

// ─── updateCrewMember ─────────────────────────────────────────────────────────

export async function updateCrewMember(
    crewId: string,
    ownerId: string,
    input: AddCrewMemberInput,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("crew_members")
        .update({
            first_name:     input.firstName.trim(),
            last_name:      input.lastName.trim(),
            crew_role_id:   input.crewRoleId,
            license_number: input.licenseNumber.trim() || null,
            phone:          input.phone.trim() || null,
        })
        .eq("id", crewId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[updateCrewMember] error:", error.message);
        return { error: error.message };
    }
    return { error: null };
}

// ─── updateCrewMemberStatus ───────────────────────────────────────────────────

export async function updateCrewMemberStatus(
    crewId: string,
    ownerId: string,
    status: string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("crew_members")
        .update({ status })
        .eq("id", crewId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[updateCrewMemberStatus] error:", error.message);
        return { error: error.message };
    }
    return { error: null };
}

// ─── deleteCrewMember ─────────────────────────────────────────────────────────

export async function deleteCrewMember(
    crewId:  string,
    ownerId: string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    // 1. Get flight IDs this crew member is assigned to
    const { data: assignments } = await supabase
        .from("flight_crew")
        .select("flight_id")
        .eq("crew_member_id", crewId);

    const flightIds = ((assignments ?? []) as any[]).map((a) => a.flight_id);

    // 2. Check if any of those flights are still active
    if (flightIds.length > 0) {
        const { data: activeStatuses } = await supabase
            .from("flight_status")
            .select("id")
            .in("code", ["SCHEDULED", "DELAYED", "IN_FLIGHT", "ON_TIME"]);

        const activeStatusIds = ((activeStatuses ?? []) as any[]).map((s) => s.id);

        const { count } = await supabase
            .from("flights")
            .select("id", { count: "exact", head: true })
            .in("id", flightIds)
            .in("status_id", activeStatusIds);

        if ((count ?? 0) > 0) {
            return { error: "No se puede eliminar: el tripulante tiene vuelos activos asignados." };
        }
    }

    // 3. Remove flight_crew entries (NO ACTION FK — must clean up manually)
    if (flightIds.length > 0) {
        const { error: fcError } = await supabase
            .from("flight_crew")
            .delete()
            .eq("crew_member_id", crewId);

        if (fcError) {
            console.error("[deleteCrewMember] flight_crew:", fcError.message);
            return { error: fcError.message };
        }
    }

    // 4. Delete crew member (crew_documents cascade automatically)
    const { error } = await supabase
        .from("crew_members")
        .delete()
        .eq("id", crewId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[deleteCrewMember] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── getAvailableCrewForTimeSlot ─────────────────────────────────────────────

export async function getAvailableCrewForTimeSlot(
    ownerId: string,
    departureDatetime: string,
    arrivalDatetime: string,
    excludeFlightId?: string,
): Promise<CrewListItem[]> {
    const supabase = await createClient();

    const { data: closedStatuses } = await supabase
        .from("flight_status")
        .select("id")
        .in("code", ["COMPLETED", "CANCELLED"]);

    const closedIds = (closedStatuses ?? []).map((r: any) => r.id);

    // Find crew members assigned to a flight that overlaps the requested slot
    let conflictQuery = supabase
        .from("flight_crew")
        .select("crew_member_id, flights!flight_crew_flight_id_fkey(departure_datetime, arrival_datetime, status_id)")
        .filter("flights.departure_datetime", "lt", arrivalDatetime)
        .filter("flights.arrival_datetime",   "gt", departureDatetime);

    if (closedIds.length > 0) {
        conflictQuery = conflictQuery.not(
            "flights.status_id", "in", `(${closedIds.join(",")})`,
        );
    }
    if (excludeFlightId) {
        conflictQuery = conflictQuery.neq("flight_id", excludeFlightId);
    }

    const { data: conflicting } = await conflictQuery;
    const busyIds = [...new Set((conflicting ?? [])
        .filter((r: any) => r.flights !== null)
        .map((r: any) => r.crew_member_id))];

    let query = supabase
        .from("crew_members")
        .select(
            "id, first_name, last_name, status, license_number, email, phone, crew_role:crew_roles!crew_members_crew_role_id_fkey(code)",
        )
        .eq("owner_id", ownerId)
        .eq("status", "ACTIVE")
        .order("first_name", { ascending: true });

    if (busyIds.length > 0) {
        query = query.not("id", "in", `(${busyIds.join(",")})`);
    }

    const { data, error } = await query;
    if (error) {
        console.error("[getAvailableCrewForTimeSlot] error:", error.message);
        return [];
    }
    return (data ?? []) as unknown as CrewListItem[];
}

// ─── getCrewList ──────────────────────────────────────────────────────────────

export async function getCrewList(userId: string): Promise<CrewListItem[]> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return [];

    const { data, error } = await supabase
        .from("crew_members")
        .select(
            "id, first_name, last_name, status, license_number, email, phone, crew_role:crew_roles!crew_members_crew_role_id_fkey(code)",
        )
        .eq("owner_id", owner.id)
        .eq("status", "ACTIVE")
        .order("first_name", { ascending: true });

    if (error) {
        console.error("[getCrewList] error:", error.message);
        return [];
    }

    return (data ?? []) as unknown as CrewListItem[];
}
