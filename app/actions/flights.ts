"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import type {
    FlightListItem,
    FlightDetail,
    RoundTripPair,
    Airport,
    AircraftPublic,
    CrewMemberPublic,
} from "@/types/app.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchFlightsParams {
    origin: string;
    destination: string;
    date: string;
    returnDate?: string;
    type: "one_way" | "round_trip";
    passengers: number;
    page?: number;
    pageSize?: number;
    sortBy?: "price_asc" | "price_desc";
}

export interface SearchFlightsResult {
    items: FlightListItem[] | RoundTripPair[];
    totalCount: number;
    totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESERVABLE_CODES = ["SCHEDULED", "ON_TIME", "DELAYED"] as const;

// Columns for flight list (no crew/aircraft detail)
const LIST_SELECT = `
    id, flight_code, flight_type,
    departure_fbo_name, arrival_fbo_name,
    departure_datetime, arrival_datetime,
    return_departure_datetime,
    total_seats, available_seats,
    price_per_seat, price_full_aircraft,
    currency, duration_minutes,
    departure_airport:airports!flights_departure_airport_id_fkey (id, iata_code, name, city, state, country),
    arrival_airport:airports!flights_arrival_airport_id_fkey (id, iata_code, name, city, state, country),
    flight_status:flight_status!flights_status_id_fkey (code),
    aircraft:aircrafts!flights_aircraft_id_fkey (photos)
`.trim();

// Columns for flight detail (full aircraft + crew)
const DETAIL_SELECT = `
    id, flight_code, flight_type,
    departure_fbo_name, arrival_fbo_name,
    departure_datetime, arrival_datetime,
    return_departure_datetime,
    total_seats, available_seats,
    price_per_seat, price_full_aircraft,
    currency, duration_minutes, flight_plan_url,
    departure_airport:airports!flights_departure_airport_id_fkey (id, iata_code, name, city, state, country),
    arrival_airport:airports!flights_arrival_airport_id_fkey (id, iata_code, name, city, state, country),
    flight_status:flight_status!flights_status_id_fkey (code),
    aircraft:aircrafts!flights_aircraft_id_fkey (id, manufacturer, model, year, seats, range_km, photos, tail_number),
    flight_crew!flight_crew_flight_id_fkey (
        crew_members!flight_crew_crew_member_id_fkey (
            id, first_name, last_name, license_number,
            crew_roles!crew_members_crew_role_id_fkey (code)
        )
    )
`.trim();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToFlightListItem(row: any): FlightListItem {
    const statusCode: string = row.flight_status?.code ?? "APPROVED";
    return {
        id: row.id,
        flight_code: row.flight_code,
        flight_type: row.flight_type as "ONE_WAY" | "ROUND_TRIP",
        departure_airport: row.departure_airport as Airport,
        arrival_airport: row.arrival_airport as Airport,
        departure_fbo_name: row.departure_fbo_name ?? "",
        arrival_fbo_name: row.arrival_fbo_name ?? null,
        departure_datetime: row.departure_datetime,
        arrival_datetime: row.arrival_datetime,
        total_seats: row.total_seats,
        available_seats: row.available_seats,
        price_per_seat: Number(row.price_per_seat),
        price_full_aircraft: Number(row.price_full_aircraft),
        currency: "MXN",
        flight_status: statusCode as FlightListItem["flight_status"],
        is_reservable:
            (RESERVABLE_CODES as readonly string[]).includes(statusCode) &&
            row.available_seats > 0,
        duration_minutes: row.duration_minutes ?? null,
        aircraft_photo: (row.aircraft?.photos as string[] | null)?.[0] ?? null,
    };
}

// ─── searchFlights ────────────────────────────────────────────────────────────

export async function searchFlights(
    params: SearchFlightsParams,
): Promise<SearchFlightsResult> {
    const {
        origin,
        destination,
        date,
        returnDate,
        type,
        passengers,
        page = 1,
        pageSize = 4,
        sortBy = "price_asc",
    } = params;

    if (!origin || !destination || !date) {
        return { items: [], totalCount: 0, totalPages: 0 };
    }

    const supabase = await createClient();

    // ── Resolve airport IDs in parallel ──────────────────────────────────────
    const [{ data: depAirport }, { data: arrAirport }] = await Promise.all([
        supabase.from("airports").select("id").eq("iata_code", origin.toUpperCase()).single(),
        supabase.from("airports").select("id").eq("iata_code", destination.toUpperCase()).single(),
    ]);

    if (!depAirport || !arrAirport) {
        return { items: [], totalCount: 0, totalPages: 0 };
    }

    // ── Resolve reservable status IDs ─────────────────────────────────────────
    const { data: statuses } = await supabase
        .from("flight_status")
        .select("id")
        .in("code", RESERVABLE_CODES);

    const statusIds = statuses?.map((s) => s.id) ?? [];
    if (statusIds.length === 0) return { items: [], totalCount: 0, totalPages: 0 };

    const ascending = sortBy === "price_asc";
    const rangeFrom = (page - 1) * pageSize;
    const rangeTo = rangeFrom + pageSize - 1;
    const dateStart = `${date}T00:00:00-06:00`;
    const dateEnd   = `${date}T23:59:59-06:00`;

    // ── ONE_WAY ───────────────────────────────────────────────────────────────
    if (type === "one_way") {
        const { data, count, error } = await supabase
            .from("flights")
            .select(LIST_SELECT, { count: "exact" })
            .eq("is_visible", true)
            .eq("flight_type", "ONE_WAY")
            .eq("departure_airport_id", depAirport.id)
            .eq("arrival_airport_id", arrAirport.id)
            .gte("available_seats", passengers)
            .gte("departure_datetime", dateStart)
            .lte("departure_datetime", dateEnd)
            .in("status_id", statusIds)
            .order("price_per_seat", { ascending })
            .range(rangeFrom, rangeTo);

        if (error) {
            console.error("[searchFlights] one_way error:", error.message);
            return { items: [], totalCount: 0, totalPages: 0 };
        }

        const totalCount = count ?? 0;
        return {
            items: (data ?? []).map(rowToFlightListItem),
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        };
    }

    // ── ROUND_TRIP ────────────────────────────────────────────────────────────
    // Single record per round-trip: outbound airports + return_departure_datetime
    let roundQuery = supabase
        .from("flights")
        .select(LIST_SELECT, { count: "exact" })
        .eq("is_visible", true)
        .eq("flight_type", "ROUND_TRIP")
        .eq("departure_airport_id", depAirport.id)
        .eq("arrival_airport_id", arrAirport.id)
        .gte("available_seats", passengers)
        .gte("departure_datetime", dateStart)
        .lte("departure_datetime", dateEnd)
        .in("status_id", statusIds)
        .order("price_per_seat", { ascending });

    if (returnDate) {
        roundQuery = roundQuery
            .gte("return_departure_datetime", `${returnDate}T00:00:00-06:00`)
            .lte("return_departure_datetime", `${returnDate}T23:59:59-06:00`);
    }

    const { data: roundRows, count: roundCount, error: roundError } =
        await roundQuery.range(rangeFrom, rangeTo) as { data: any[] | null; count: number | null; error: unknown };

    if (roundError || !roundRows || roundRows.length === 0) {
        return { items: [], totalCount: 0, totalPages: 0 };
    }

    // Build synthetic inbound FlightListItem from the same record (reversed airports)
    const pairs: RoundTripPair[] = roundRows.map((row) => {
        const outbound = rowToFlightListItem(row);
        const inbound: FlightListItem = {
            ...outbound,
            id: `${row.id}-return`,
            departure_airport: row.arrival_airport as Airport,
            arrival_airport: row.departure_airport as Airport,
            departure_fbo_name: row.arrival_fbo_name ?? "",
            arrival_fbo_name: row.departure_fbo_name ?? null,
            departure_datetime: row.return_departure_datetime ?? row.departure_datetime,
            arrival_datetime: row.arrival_datetime,
        };
        return { id: row.id, outbound, inbound, currency: "MXN" };
    });

    const totalCount = roundCount ?? pairs.length;
    return {
        items: pairs,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
    };
}

// ─── getFlightById ────────────────────────────────────────────────────────────

export async function getFlightById(id: string): Promise<FlightDetail | null> {
    if (!id) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("flights")
        .select(DETAIL_SELECT)
        .eq("id", id)
        .eq("is_visible", true)
        .single();

    if (error || !data) {
        if (error?.code !== "PGRST116") {
            console.error("[getFlightById] error:", error?.message);
        }
        return null;
    }

    const row = data as any;
    const statusCode: string = row.flight_status?.code ?? "APPROVED";

    // Aircraft
    const ac = row.aircraft;
    const aircraft: AircraftPublic = {
        id: ac.id,
        manufacturer: ac.manufacturer ?? "",
        model: ac.model ?? "",
        year: ac.year ?? 0,
        seats: ac.seats ?? 0,
        range_km: ac.range_km ?? undefined,
        photos: (ac.photos as string[]) ?? [],
        tail_number: ac.tail_number ?? "",
    };

    // Crew
    const crew: CrewMemberPublic[] = ((row.flight_crew as unknown[]) ?? [])
        .map((fc) => {
            const m = (fc as any).crew_members;
            if (!m) return null;
            return {
                id: m.id,
                first_name: m.first_name,
                last_name: m.last_name,
                crew_role: (m.crew_roles?.code ??
                    "FLIGHT_ATTENDANT") as CrewMemberPublic["crew_role"],
                license_number: m.license_number ?? "",
            } satisfies CrewMemberPublic;
        })
        .filter((m): m is CrewMemberPublic => m !== null);

    return {
        id: row.id,
        flight_code: row.flight_code,
        flight_type: row.flight_type as "ONE_WAY" | "ROUND_TRIP",
        departure_airport: row.departure_airport as Airport,
        arrival_airport: row.arrival_airport as Airport,
        departure_fbo_name: row.departure_fbo_name ?? "",
        arrival_fbo_name: row.arrival_fbo_name ?? null,
        departure_datetime: row.departure_datetime,
        arrival_datetime: row.arrival_datetime,
        total_seats: row.total_seats,
        available_seats: row.available_seats,
        price_per_seat: Number(row.price_per_seat),
        price_full_aircraft: Number(row.price_full_aircraft),
        currency: "MXN",
        flight_status: statusCode as FlightDetail["flight_status"],
        is_reservable:
            (RESERVABLE_CODES as readonly string[]).includes(statusCode) &&
            row.available_seats > 0,
        duration_minutes: row.duration_minutes ?? null,
        aircraft_photo: (ac.photos as string[] | null)?.[0] ?? null,
        flight_plan_url: row.flight_plan_url ?? null,
        return_departure_datetime: row.return_departure_datetime ?? null,
        aircraft,
        crew,
    };
}

// ─── getOwnerFlightDetail ─────────────────────────────────────────────────────

export interface OwnerFlightPassenger {
    id:            string;
    full_name:     string;
    document_type: string | null;
}

export interface OwnerFlightCrewMember {
    id:             string;
    first_name:     string;
    last_name:      string;
    license_number: string | null;
    role_code:      string;
}

export interface OwnerFlightAircraft {
    id:           string;
    model:        string;
    manufacturer: string | null;
    tail_number:  string;
    seats:        number;
    status:       string;
}

export interface OwnerFlightDetail {
    id:                        string;
    flight_code:               string | null;
    flight_type:               string;
    departure_airport:         { iata_code: string; name: string; city: string };
    arrival_airport:           { iata_code: string; name: string; city: string };
    departure_fbo_name:        string | null;
    arrival_fbo_name:          string | null;
    departure_datetime:        string;
    arrival_datetime:          string;
    return_departure_datetime: string | null;
    return_arrival_datetime:   string | null;
    return_departure_fbo_name: string | null;
    return_arrival_fbo_name:   string | null;
    total_seats:               number;
    available_seats:           number;
    price_per_seat:            number;
    price_full_aircraft:       number;
    status_code:               string;
    rejected_reason:           string | null;
    is_visible:                boolean;
    flight_plan_url:           string | null;
    aircraft:                  OwnerFlightAircraft | null;
    crew:                      OwnerFlightCrewMember[];
    passengers:                OwnerFlightPassenger[];
}

export async function getOwnerFlightDetail(
    flightId: string,
    userId:   string,
): Promise<OwnerFlightDetail | null> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return null;

    const [flightRes, reservationsRes] = await Promise.all([
        supabase
            .from("flights")
            .select(`
                id, flight_code, flight_type, is_visible, flight_plan_url, rejected_reason,
                departure_fbo_name, arrival_fbo_name,
                departure_datetime, arrival_datetime, return_departure_datetime,
                total_seats, available_seats, price_per_seat, price_full_aircraft,
                departure_airport:airports!flights_departure_airport_id_fkey(iata_code, name, city),
                arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code, name, city),
                flight_status:flight_status!flights_status_id_fkey(code),
                aircraft:aircrafts!flights_aircraft_id_fkey(id, model, manufacturer, tail_number, seats, status),
                flight_crew!flight_crew_flight_id_fkey(
                    crew_members!flight_crew_crew_member_id_fkey(
                        id, first_name, last_name, license_number,
                        crew_role:crew_roles!crew_members_crew_role_id_fkey(code)
                    )
                )
            `)
            .eq("id", flightId)
            .eq("owner_id", owner.id)
            .single(),

        supabase
            .from("reservations")
            .select(`
                id,
                reservation_status:reservation_status!reservations_reservation_status_id_fkey(code),
                reservation_passengers(id, full_name, document_type)
            `)
            .eq("flight_id", flightId),
    ]);

    if (flightRes.error || !flightRes.data) return null;

    const row = flightRes.data as any;

    const crew: OwnerFlightCrewMember[] = ((row.flight_crew ?? []) as any[])
        .map((fc: any) => {
            const m = fc.crew_members;
            if (!m) return null;
            return {
                id:             m.id,
                first_name:     m.first_name,
                last_name:      m.last_name,
                license_number: m.license_number ?? null,
                role_code:      m.crew_role?.code ?? "FLIGHT_ATTENDANT",
            };
        })
        .filter(Boolean) as OwnerFlightCrewMember[];

    const passengers: OwnerFlightPassenger[] = ((reservationsRes.data ?? []) as any[])
        .filter((r: any) => r.reservation_status?.code === "CONFIRMED")
        .flatMap((r: any) =>
            ((r.reservation_passengers ?? []) as any[]).map((p: any) => ({
                id:            p.id,
                full_name:     p.full_name,
                document_type: p.document_type ?? null,
            })),
        );

    const ac = row.aircraft as any;

    return {
        id:                        row.id,
        flight_code:               row.flight_code ?? null,
        flight_type:               row.flight_type ?? "ONE_WAY",
        departure_airport:         row.departure_airport as any,
        arrival_airport:           row.arrival_airport  as any,
        departure_fbo_name:        row.departure_fbo_name ?? null,
        arrival_fbo_name:          row.arrival_fbo_name  ?? null,
        departure_datetime:        row.departure_datetime,
        arrival_datetime:          row.arrival_datetime,
        return_departure_datetime: row.return_departure_datetime ?? null,
        total_seats:               row.total_seats,
        available_seats:           row.available_seats,
        price_per_seat:            Number(row.price_per_seat),
        price_full_aircraft:       Number(row.price_full_aircraft),
        status_code:               row.flight_status?.code ?? "SCHEDULED",
        rejected_reason:           row.rejected_reason ?? null,
        is_visible:                row.is_visible ?? false,
        flight_plan_url:           row.flight_plan_url ?? null,
        aircraft:                  ac ? {
            id:           ac.id,
            model:        ac.model,
            manufacturer: ac.manufacturer ?? null,
            tail_number:  ac.tail_number,
            seats:        ac.seats,
            status:       ac.status ?? "ACTIVE",
        } : null,
        crew,
        passengers,
    };
}

// ─── updateFlightStatus ───────────────────────────────────────────────────────

export async function updateFlightStatus(
    flightId: string,
    ownerId:  string,
    code:     string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { data: statusRow } = await supabase
        .from("flight_status")
        .select("id")
        .eq("code", code)
        .single();

    if (!statusRow) return { error: `Estado desconocido: ${code}` };

    const { error } = await supabase
        .from("flights")
        .update({ status_id: statusRow.id })
        .eq("id", flightId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[updateFlightStatus] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── getOwnerFlightList ───────────────────────────────────────────────────────

export interface OwnerFlightListItem {
    id:                 string;
    flight_code:        string | null;
    flight_type:        string;
    departure_iata:     string;
    arrival_iata:       string;
    departure_datetime: string;
    aircraft_model:     string;
    status_code:        string;
    total_seats:        number;
    available_seats:    number;
}

export async function getOwnerFlightList(userId: string): Promise<OwnerFlightListItem[]> {
    const supabase = await createClient();

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (!owner) return [];

    const { data, error } = await supabase
        .from("flights")
        .select(`
            id, flight_code, flight_type,
            departure_datetime, total_seats, available_seats,
            departure_airport:airports!flights_departure_airport_id_fkey(iata_code),
            arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code),
            aircraft:aircrafts!flights_aircraft_id_fkey(manufacturer, model),
            flight_status:flight_status!flights_status_id_fkey(code)
        `)
        .eq("owner_id", owner.id)
        .order("departure_datetime", { ascending: false });

    if (error) {
        console.error("[getOwnerFlightList] error:", error.message);
        return [];
    }

    return ((data ?? []) as any[]).map((row) => {
        const ac = row.aircraft;
        return {
            id:                 row.id,
            flight_code:        row.flight_code ?? null,
            flight_type:        row.flight_type ?? "ONE_WAY",
            departure_iata:     row.departure_airport?.iata_code ?? "—",
            arrival_iata:       row.arrival_airport?.iata_code  ?? "—",
            departure_datetime: row.departure_datetime ?? "",
            aircraft_model:     ac ? (ac.manufacturer ? `${ac.manufacturer} ${ac.model}` : ac.model) : "—",
            status_code:        row.flight_status?.code ?? "SCHEDULED",
            total_seats:        row.total_seats  ?? 0,
            available_seats:    row.available_seats ?? 0,
        };
    });
}

// ─── createFlight ─────────────────────────────────────────────────────────────

export interface CreateFlightInput {
    flightType:              "ONE_WAY" | "ROUND_TRIP";
    departureAirportId:      string;
    arrivalAirportId:        string;
    departureFboName:        string;
    arrivalFboName:          string;
    departureDatetime:       string;
    arrivalDatetime:         string;
    returnDepartureDatetime: string | null;
    aircraftId:              string;
    totalSeats:              number;
    pricePerSeat:            number;
    priceFullAircraft:       number;
    flightPlanUrl:           string | null;
    isVisible:               boolean;
    crewMemberIds:           string[];
}

export async function checkAircraftAvailability(
    aircraftId: string,
    departureDatetime: string,
    arrivalDatetime: string,
): Promise<{ available: boolean }> {
    const supabase = await createClient();

    const { data: closedStatuses } = await supabase
        .from("flight_status")
        .select("id")
        .in("code", ["COMPLETED", "CANCELLED"]);

    const closedIds = (closedStatuses ?? []).map((r: any) => r.id);

    let query = supabase
        .from("flights")
        .select("id")
        .eq("aircraft_id", aircraftId)
        .lt("departure_datetime", arrivalDatetime)
        .gt("arrival_datetime",   departureDatetime)
        .limit(1);

    if (closedIds.length > 0) {
        query = query.not("status_id", "in", `(${closedIds.join(",")})`);
    }

    const { data } = await query;
    return { available: !data || data.length === 0 };
}

// ─── createFlight ─────────────────────────────────────────────────────────────

export async function createFlight(
    ownerId: string,
    input: CreateFlightInput,
): Promise<{ error: string | null; id: string | null }> {
    const supabase = await createClient();

    // Resolve PENDING_REVIEW status id
    const { data: statusRow } = await supabase
        .from("flight_status")
        .select("id")
        .eq("code", "PENDING_REVIEW")
        .single();

    if (!statusRow) {
        return { error: "No se pudo obtener el estado del vuelo", id: null };
    }

    // Validate aircraft has no overlapping flights
    const { data: closedStatuses } = await supabase
        .from("flight_status")
        .select("id")
        .in("code", ["COMPLETED", "CANCELLED"]);

    const closedIds = (closedStatuses ?? []).map((r: any) => r.id);

    let overlapQuery = supabase
        .from("flights")
        .select("id")
        .eq("aircraft_id", input.aircraftId)
        .lt("departure_datetime", input.arrivalDatetime)
        .gt("arrival_datetime",   input.departureDatetime)
        .limit(1);

    if (closedIds.length > 0) {
        overlapQuery = overlapQuery.not("status_id", "in", `(${closedIds.join(",")})`);
    }

    const { data: overlapping } = await overlapQuery;

    if (overlapping && overlapping.length > 0) {
        return { error: "La aeronave ya tiene un vuelo asignado en ese horario", id: null };
    }

    const { data: airports } = await supabase
        .from("airports")
        .select("id, iata_code")
        .in("id", [input.departureAirportId, input.arrivalAirportId]);

    const depIata = airports?.find((a) => a.id === input.departureAirportId)?.iata_code ?? "XXX";
    const arrIata = airports?.find((a) => a.id === input.arrivalAirportId)?.iata_code  ?? "XXX";
    const suffix  = Math.random().toString(36).slice(2, 6).toUpperCase();
    const flightCode = `MF-${depIata}${arrIata}-${suffix}`;

    const { data: flight, error: flightError } = await supabase
        .from("flights")
        .insert({
            owner_id:                  ownerId,
            aircraft_id:               input.aircraftId,
            flight_type:               input.flightType,
            flight_code:               flightCode,
            departure_airport_id:      input.departureAirportId,
            arrival_airport_id:        input.arrivalAirportId,
            departure_fbo_name:        input.departureFboName.trim() || null,
            arrival_fbo_name:          input.arrivalFboName.trim()   || null,
            departure_datetime:        input.departureDatetime,
            arrival_datetime:          input.arrivalDatetime,
            return_departure_datetime: input.returnDepartureDatetime,
            total_seats:               input.totalSeats,
            available_seats:           input.totalSeats,
            price_per_seat:            input.pricePerSeat,
            price_full_aircraft:       input.priceFullAircraft,
            currency:                  "MXN",
            status_id:                 statusRow.id,
            is_visible:                input.isVisible,
            flight_plan_url:           input.flightPlanUrl,
        })
        .select("id")
        .single();

    if (flightError) {
        console.error("[createFlight] error:", flightError.message);
        return { error: flightError.message, id: null };
    }

    if (input.crewMemberIds.length > 0) {
        // Validate all crew are active and approved before assigning
        const { data: validCrew } = await supabase
            .from("crew_members")
            .select("id")
            .in("id", input.crewMemberIds)
            .eq("status", "ACTIVE")
            .eq("is_approved", true);

        const validIds = (validCrew ?? []).map((c: any) => c.id);

        if (validIds.length > 0) {
            const { error: crewError } = await supabase
                .from("flight_crew")
                .insert(validIds.map((crew_member_id: string) => ({
                    flight_id: flight.id,
                    crew_member_id,
                })));

            if (crewError) {
                console.error("[createFlight] crew error:", crewError.message);
            }
        }
    }

    return { error: null, id: flight.id };
}

// ─── updateFlight ─────────────────────────────────────────────────────────────

export interface UpdateFlightInput {
    flightType:              "ONE_WAY" | "ROUND_TRIP";
    departureAirportId:      string;
    arrivalAirportId:        string;
    departureFboName:        string;
    arrivalFboName:          string;
    departureDatetime:       string;
    arrivalDatetime:         string;
    returnDepartureDatetime: string | null;
    aircraftId:              string;
    totalSeats:              number;
    pricePerSeat:            number;
    priceFullAircraft:       number;
    flightPlanUrl:           string | null;
    isVisible:               boolean;
    crewMemberIds:           string[];
}

export async function updateFlight(
    flightId: string,
    ownerId:  string,
    input:    UpdateFlightInput,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { data: currentFlight } = await supabase
        .from("flights")
        .select("total_seats, available_seats, flight_status:flight_status!flights_status_id_fkey(code)")
        .eq("id", flightId)
        .eq("owner_id", ownerId)
        .single();

    if (!currentFlight) return { error: "Vuelo no encontrado." };

    const flightStatusCode = (currentFlight as any).flight_status?.code;
    if (flightStatusCode === "IN_FLIGHT") {
        return { error: "No se puede editar un vuelo que está en curso." };
    }
    if (flightStatusCode === "COMPLETED") {
        return { error: "No se puede editar un vuelo que ya fue completado." };
    }

    const soldSeats = (currentFlight as any).total_seats - (currentFlight as any).available_seats;
    const newAvailableSeats = input.totalSeats - soldSeats;

    if (newAvailableSeats < 0) {
        return { error: `No puedes reducir los asientos por debajo de los ${soldSeats} ya vendidos.` };
    }

    const { error: flightError } = await supabase
        .from("flights")
        .update({
            aircraft_id:               input.aircraftId,
            flight_type:               input.flightType,
            departure_airport_id:      input.departureAirportId,
            arrival_airport_id:        input.arrivalAirportId,
            departure_fbo_name:        input.departureFboName.trim() || null,
            arrival_fbo_name:          input.arrivalFboName.trim()   || null,
            departure_datetime:        input.departureDatetime,
            arrival_datetime:          input.arrivalDatetime,
            return_departure_datetime: input.returnDepartureDatetime,
            total_seats:               input.totalSeats,
            available_seats:           newAvailableSeats,
            price_per_seat:            input.pricePerSeat,
            price_full_aircraft:       input.priceFullAircraft,
            is_visible:                input.isVisible,
            flight_plan_url:           input.flightPlanUrl,
        })
        .eq("id", flightId)
        .eq("owner_id", ownerId);

    if (flightError) {
        console.error("[updateFlight] error:", flightError.message);
        return { error: flightError.message };
    }

    // Replace crew: delete all existing, insert new
    const { error: deleteError } = await supabase
        .from("flight_crew")
        .delete()
        .eq("flight_id", flightId);

    if (deleteError) {
        console.error("[updateFlight] crew delete error:", deleteError.message);
        return { error: deleteError.message };
    }

    if (input.crewMemberIds.length > 0) {
        const { data: validCrew } = await supabase
            .from("crew_members")
            .select("id")
            .in("id", input.crewMemberIds)
            .eq("status", "ACTIVE")
            .eq("is_approved", true);

        const validIds = (validCrew ?? []).map((c: any) => c.id);

        if (validIds.length > 0) {
            const { error: insertError } = await supabase
                .from("flight_crew")
                .insert(validIds.map((crew_member_id: string) => ({
                    flight_id: flightId,
                    crew_member_id,
                })));

            if (insertError) {
                console.error("[updateFlight] crew insert error:", insertError.message);
                return { error: insertError.message };
            }
        }
    }

    return { error: null };
}

// ─── deleteFlight ─────────────────────────────────────────────────────────────
// Allowed only if: flight is PENDING_REVIEW, or flight has no confirmed passengers.

export async function deleteFlight(
    flightId: string,
    ownerId:  string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { data: flight } = await supabase
        .from("flights")
        .select("flight_status:flight_status!flights_status_id_fkey(code)")
        .eq("id", flightId)
        .eq("owner_id", ownerId)
        .single();

    if (!flight) return { error: "Vuelo no encontrado." };

    const statusCode = (flight as any).flight_status?.code ?? "";

    if (statusCode !== "PENDING_REVIEW") {
        const { data: confirmedStatus } = await supabase
            .from("reservation_status")
            .select("id")
            .eq("code", "CONFIRMED")
            .single();

        if (confirmedStatus) {
            const { count } = await supabase
                .from("reservations")
                .select("id", { count: "exact", head: true })
                .eq("flight_id", flightId)
                .eq("status_id", confirmedStatus.id);

            if ((count ?? 0) > 0) {
                return { error: "No se puede eliminar: el vuelo tiene pasajeros con reservaciones confirmadas. Cancela el vuelo en su lugar." };
            }
        }
    }

    const { error } = await supabase
        .from("flights")
        .delete()
        .eq("id", flightId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[deleteFlight] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── cancelFlight ─────────────────────────────────────────────────────────────
// Allowed in any state except PENDING_REVIEW. Notifies confirmed passengers.

export async function cancelFlight(
    flightId: string,
    ownerId:  string,
): Promise<{ error: string | null; notifiedPassengers: number }> {
    const supabase = await createClient();

    const { data: flight } = await supabase
        .from("flights")
        .select("flight_status:flight_status!flights_status_id_fkey(code)")
        .eq("id", flightId)
        .eq("owner_id", ownerId)
        .single();

    if (!flight) return { error: "Vuelo no encontrado.", notifiedPassengers: 0 };

    const statusCode = (flight as any).flight_status?.code ?? "";
    if (statusCode === "PENDING_REVIEW") {
        return { error: "No se puede cancelar un vuelo que está en revisión.", notifiedPassengers: 0 };
    }

    const { data: cancelledFlightStatus } = await supabase
        .from("flight_status")
        .select("id")
        .eq("code", "CANCELLED")
        .single();

    if (!cancelledFlightStatus) return { error: "Estado de vuelo no encontrado.", notifiedPassengers: 0 };

    // Collect confirmed passengers for notifications
    const { data: confirmedResStatus } = await supabase
        .from("reservation_status")
        .select("id")
        .eq("code", "CONFIRMED")
        .single();

    const passengers: { name: string; email: string }[] = [];
    if (confirmedResStatus) {
        const { data: reservations } = await supabase
            .from("reservations")
            .select("id, contact_full_name, contact_email")
            .eq("flight_id", flightId)
            .eq("reservation_status_id", confirmedResStatus.id);

        for (const res of reservations ?? []) {
            const r = res as any;
            if (r.contact_email) passengers.push({ name: r.contact_full_name ?? "", email: r.contact_email });
        }
    }

    const { error: updateError } = await supabase
        .from("flights")
        .update({ status_id: cancelledFlightStatus.id })
        .eq("id", flightId)
        .eq("owner_id", ownerId);

    if (updateError) {
        console.error("[cancelFlight] error:", updateError.message);
        return { error: updateError.message, notifiedPassengers: 0 };
    }

    const resendKey = process.env.RESEND_API_KEY ?? "";
    const resend = new Resend(resendKey);
    let notified = 0;

    for (const p of passengers) {
        const { error: emailError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "noreply@amoxtli.tech",
            to:   p.email,
            subject: "Tu vuelo ha sido cancelado — Mobius Fly",
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#F6F6F4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F6F6F4;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520"
             style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#C4A77D;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;letter-spacing:-0.02em;">Mobius Fly</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="margin:0 0 16px;color:#39424E;font-size:16px;font-weight:600;">Hola${p.name ? `, ${p.name.split(" ")[0]}` : ""},</p>
            <p style="margin:0 0 16px;color:#39424E;font-size:14px;line-height:1.6;">
              Lamentamos informarte que tu vuelo ha sido <strong>cancelado</strong> por el propietario de la aeronave.
            </p>
            <p style="margin:0 0 24px;color:#39424E;font-size:14px;line-height:1.6;">
              El equipo de Mobius Fly se pondrá en contacto contigo a la brevedad para procesar tu reembolso o compensación correspondiente.
            </p>
            <p style="margin:0;color:#39424E;font-size:14px;">
              Si tienes dudas, escríbenos a
              <a href="mailto:contacto@mobiusfly.com" style="color:#C4A77D;">contacto@mobiusfly.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#F6F6F4;text-align:center;">
            <p style="margin:0;color:#39424E;font-size:12px;opacity:0.6;">© Mobius Fly — Vuelos privados</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });
        if (emailError) {
            console.error("[cancelFlight] email error:", emailError);
        } else {
            notified++;
        }
    }

    return { error: null, notifiedPassengers: notified };
}

// ─── toggleFlightVisibility ───────────────────────────────────────────────────

export async function toggleFlightVisibility(
    flightId: string,
    ownerId:  string,
    visible:  boolean,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("flights")
        .update({ is_visible: visible })
        .eq("id", flightId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("[toggleFlightVisibility] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}

// ─── getAirports ──────────────────────────────────────────────────────────────

export async function getAirports(): Promise<Airport[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("airports")
        .select("id, iata_code, name, city, state, country")
        .order("city", { ascending: true });

    if (error) {
        console.error("[getAirports] error:", error.message);
        return [];
    }

    return (data ?? []) as Airport[];
}

