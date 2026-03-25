import { createClient } from "@/lib/supabase/server";
import type { FlightListItem, FlightDetail, RoundTripPair, Airport, AircraftPublic, CrewMemberPublic, FlightStatusCode } from "@/types/app.types";

// ─── Params ───────────────────────────────────────────────────────────────────

export interface FlightSearchParams {
    origin?: string;
    destination?: string;
    date?: string;
    returnDate?: string;
    passengers?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapAirport(a: {
    id: string;
    iata_code: string;
    name: string;
    city: string;
    state: string | null;
    country: string;
}): Airport {
    return {
        id: a.id,
        iata_code: a.iata_code,
        name: a.name,
        city: a.city,
        state: a.state ?? "",
        country: a.country,
    };
}

function mapFlightRow(row: {
    id: string;
    flight_code: string | null;
    flight_type: string;
    departure_airport: { id: string; iata_code: string; name: string; city: string; state: string | null; country: string };
    arrival_airport: { id: string; iata_code: string; name: string; city: string; state: string | null; country: string };
    departure_fbo_name: string | null;
    arrival_fbo_name: string | null;
    departure_datetime: string;
    arrival_datetime: string;
    total_seats: number;
    available_seats: number;
    price_per_seat: number;
    price_full_aircraft: number;
    currency: string | null;
    flight_status: { code: string };
    duration_minutes: number | null;
    aircraft: { photos: string[] };
    flight_plan_url: string | null;
}): FlightListItem {
    return {
        id: row.id,
        flight_code: row.flight_code ?? "",
        flight_type: row.flight_type as "ONE_WAY" | "ROUND_TRIP",
        departure_airport: mapAirport(row.departure_airport),
        arrival_airport: mapAirport(row.arrival_airport),
        departure_fbo_name: row.departure_fbo_name ?? "",
        arrival_fbo_name: row.arrival_fbo_name,
        departure_datetime: row.departure_datetime,
        arrival_datetime: row.arrival_datetime,
        total_seats: row.total_seats,
        available_seats: row.available_seats,
        price_per_seat: Number(row.price_per_seat),
        price_full_aircraft: Number(row.price_full_aircraft),
        currency: "MXN",
        flight_status: row.flight_status.code as FlightStatusCode,
        is_reservable: row.available_seats > 0,
        duration_minutes: row.duration_minutes,
        aircraft_photo: row.aircraft.photos?.[0] ?? null,
    };
}

const FLIGHT_LIST_SELECT = `
    id, flight_code, flight_type,
    departure_fbo_name, arrival_fbo_name,
    departure_datetime, arrival_datetime,
    total_seats, available_seats,
    price_per_seat, price_full_aircraft,
    currency, duration_minutes, flight_plan_url,
    return_departure_datetime,
    departure_airport:airports!departure_airport_id (id, iata_code, name, city, state, country),
    arrival_airport:airports!arrival_airport_id (id, iata_code, name, city, state, country),
    flight_status:flight_status!status_id (code),
    aircraft:aircrafts!aircraft_id (photos)
` as const;

// ─── getAirports ──────────────────────────────────────────────────────────────

export async function getAirports(): Promise<{ code: string; name: string; city: string }[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("airports")
        .select("iata_code, name, city")
        .order("city");

    if (error || !data) return [];
    return data.map((a) => ({ code: a.iata_code, name: a.name, city: a.city }));
}

// ─── resolveAirportIds — lookup IATA → UUID ───────────────────────────────────

async function resolveAirportIds(
    supabase: Awaited<ReturnType<typeof createClient>>,
    origin?: string,
    destination?: string,
): Promise<{ depId: string | null; arrId: string | null }> {
    const codes = [origin, destination].filter(Boolean) as string[];
    if (codes.length === 0) return { depId: null, arrId: null };

    const { data } = await supabase
        .from("airports")
        .select("id, iata_code")
        .in("iata_code", codes);

    const map = new Map((data ?? []).map((a) => [a.iata_code, a.id]));
    return {
        depId: origin ? (map.get(origin) ?? null) : null,
        arrId: destination ? (map.get(destination) ?? null) : null,
    };
}

// ─── getFlights ───────────────────────────────────────────────────────────────

export async function getFlights(params: FlightSearchParams): Promise<FlightListItem[]> {
    const supabase = await createClient();
    const { origin, destination, date, passengers = 1 } = params;

    const { depId, arrId } = await resolveAirportIds(supabase, origin, destination);

    let query = supabase
        .from("flights")
        .select(FLIGHT_LIST_SELECT)
        .eq("flight_type", "ONE_WAY")
        .eq("is_visible", true)
        .gte("available_seats", passengers);

    if (depId) query = query.eq("departure_airport_id", depId);
    if (arrId) query = query.eq("arrival_airport_id", arrId);
    if (date) {
        const dayStart = `${date}T00:00:00Z`;
        const dayEnd = `${date}T23:59:59Z`;
        query = query.gte("departure_datetime", dayStart).lte("departure_datetime", dayEnd);
    }

    const { data, error } = await query.order("price_per_seat");
    if (error || !data) return [];

    return (data as Parameters<typeof mapFlightRow>[0][]).map(mapFlightRow);
}

// ─── getRoundTripFlights ──────────────────────────────────────────────────────

export async function getRoundTripFlights(params: FlightSearchParams): Promise<RoundTripPair[]> {
    const supabase = await createClient();
    const { origin, destination, date, returnDate, passengers = 1 } = params;

    const { depId, arrId } = await resolveAirportIds(supabase, origin, destination);

    let query = supabase
        .from("flights")
        .select(FLIGHT_LIST_SELECT)
        .eq("flight_type", "ROUND_TRIP")
        .eq("is_visible", true)
        .gte("available_seats", passengers);

    if (depId) query = query.eq("departure_airport_id", depId);
    if (arrId) query = query.eq("arrival_airport_id", arrId);
    if (date) {
        const dayStart = `${date}T00:00:00Z`;
        const dayEnd = `${date}T23:59:59Z`;
        query = query.gte("departure_datetime", dayStart).lte("departure_datetime", dayEnd);
    }

    const { data, error } = await query.order("price_per_seat");
    if (error || !data) return [];

    type RawRow = Parameters<typeof mapFlightRow>[0] & { return_departure_datetime: string | null };

    return (data as RawRow[]).map((row): RoundTripPair => {
        const outbound = mapFlightRow(row);
        const inbound: FlightListItem = {
            ...outbound,
            id: `${row.id}-inbound`,
            flight_code: row.flight_code ? `${row.flight_code}-R` : "",
            departure_airport: mapAirport(row.arrival_airport),
            arrival_airport: mapAirport(row.departure_airport),
            departure_fbo_name: row.arrival_fbo_name ?? "",
            arrival_fbo_name: row.departure_fbo_name,
            departure_datetime: row.return_departure_datetime ?? row.arrival_datetime,
            arrival_datetime: row.return_departure_datetime ?? row.arrival_datetime,
        };

        if (returnDate && row.return_departure_datetime) {
            const retDay = row.return_departure_datetime.slice(0, 10);
            if (retDay !== returnDate) {
                return { id: row.id, outbound, inbound, currency: "MXN", _skip: true } as RoundTripPair & { _skip: boolean };
            }
        }

        return { id: row.id, outbound, inbound, currency: "MXN" };
    }).filter((pair) => !(pair as RoundTripPair & { _skip?: boolean })._skip);
}

// ─── getFlightDetail ──────────────────────────────────────────────────────────

export async function getFlightDetail(id: string): Promise<FlightDetail | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("flights")
        .select(`
            id, flight_code, flight_type,
            departure_fbo_name, arrival_fbo_name,
            departure_datetime, arrival_datetime,
            total_seats, available_seats,
            price_per_seat, price_full_aircraft,
            currency, duration_minutes, flight_plan_url,
            departure_airport:airports!departure_airport_id (id, iata_code, name, city, state, country),
            arrival_airport:airports!arrival_airport_id (id, iata_code, name, city, state, country),
            flight_status:flight_status!status_id (code),
            aircraft:aircrafts!aircraft_id (id, manufacturer, model, year, seats, range_km, tail_number, photos),
            flight_crew (
                crew_members (
                    id, first_name, last_name, license_number,
                    crew_roles (code)
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error || !data) return null;

    type RawDetail = typeof data & {
        departure_airport: { id: string; iata_code: string; name: string; city: string; state: string | null; country: string };
        arrival_airport: { id: string; iata_code: string; name: string; city: string; state: string | null; country: string };
        flight_status: { code: string };
        aircraft: { id: string; manufacturer: string | null; model: string; year: number | null; seats: number; range_km: number | null; tail_number: string; photos: string[] };
        flight_crew: Array<{ crew_members: { id: string; first_name: string; last_name: string; license_number: string | null; crew_roles: { code: string } | null } | null }>;
    };

    const raw = data as RawDetail;

    const aircraft: AircraftPublic = {
        id: raw.aircraft.id,
        manufacturer: raw.aircraft.manufacturer ?? "",
        model: raw.aircraft.model,
        year: raw.aircraft.year ?? 0,
        seats: raw.aircraft.seats,
        range_km: raw.aircraft.range_km ?? undefined,
        photos: raw.aircraft.photos ?? [],
        tail_number: raw.aircraft.tail_number,
    };

    const crew: CrewMemberPublic[] = raw.flight_crew
        .map((fc) => fc.crew_members)
        .filter((cm): cm is NonNullable<typeof cm> => cm !== null)
        .map((cm) => ({
            id: cm.id,
            first_name: cm.first_name,
            last_name: cm.last_name,
            license_number: cm.license_number ?? "",
            crew_role: (cm.crew_roles?.code ?? "CREW") as CrewMemberPublic["crew_role"],
        }));

    const base = mapFlightRow({
        ...raw,
        flight_status: raw.flight_status,
        aircraft: raw.aircraft,
    });

    return { ...base, aircraft, crew, flight_plan_url: raw.flight_plan_url };
}
