"use server";

import { createClient } from "@/lib/supabase/server";
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

const RESERVABLE_CODES = ["APPROVED", "ON_TIME", "DELAYED"] as const;

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
    const dateStart = `${date}T00:00:00+00:00`;
    const dateEnd = `${date}T23:59:59+00:00`;

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
            .gte("return_departure_datetime", `${returnDate}T00:00:00+00:00`)
            .lte("return_departure_datetime", `${returnDate}T23:59:59+00:00`);
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

