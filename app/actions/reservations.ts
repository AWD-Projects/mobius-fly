import { createClient } from "@/lib/supabase/server";
import type {
    ReservationListItem,
    ReservationDetail,
    FlightListItem,
    FlightDetail,
    ReservationPassenger,
} from "@/types/app.types";

// ─── Shared select fragments ──────────────────────────────────────────────────

const FLIGHT_LIST_FRAGMENT = `
    id, flight_code, flight_type,
    departure_fbo_name, arrival_fbo_name,
    departure_datetime, arrival_datetime, duration_minutes,
    total_seats, available_seats, price_per_seat, price_full_aircraft,
    departure_airport:airports!flights_departure_airport_id_fkey (id, iata_code, name, city, state, country),
    arrival_airport:airports!flights_arrival_airport_id_fkey (id, iata_code, name, city, state, country),
    flight_status:flight_status!flights_status_id_fkey (code),
    aircraft:aircrafts!flights_aircraft_id_fkey (photos)
`.trim();

const FLIGHT_DETAIL_FRAGMENT = `
    id, flight_code, flight_type, flight_plan_url, return_departure_datetime,
    departure_fbo_name, arrival_fbo_name,
    departure_datetime, arrival_datetime, duration_minutes,
    total_seats, available_seats, price_per_seat, price_full_aircraft,
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

function rowToFlightListItem(f: any): FlightListItem {
    const statusCode: string = f?.flight_status?.code ?? "ON_TIME";
    return {
        id:                  f.id,
        flight_code:         f.flight_code,
        flight_type:         f.flight_type as "ONE_WAY" | "ROUND_TRIP",
        departure_airport:   f.departure_airport,
        arrival_airport:     f.arrival_airport,
        departure_fbo_name:  f.departure_fbo_name ?? "",
        arrival_fbo_name:    f.arrival_fbo_name ?? null,
        departure_datetime:  f.departure_datetime,
        arrival_datetime:    f.arrival_datetime,
        total_seats:         f.total_seats,
        available_seats:     f.available_seats,
        price_per_seat:      Number(f.price_per_seat),
        price_full_aircraft: Number(f.price_full_aircraft),
        currency:            "MXN",
        flight_status:       statusCode as FlightListItem["flight_status"],
        is_reservable:       false,
        duration_minutes:    f.duration_minutes ?? null,
        aircraft_photo:      (f.aircraft?.photos as string[] | null)?.[0] ?? null,
    };
}

function rowToFlightDetail(f: any): FlightDetail {
    const base = rowToFlightListItem(f);
    const ac   = f.aircraft ?? {};
    const crew = ((f.flight_crew ?? []) as any[]).flatMap((fc: any) => {
        const m = fc?.crew_members;
        if (!m) return [];
        return [{
            id:             m.id,
            first_name:     m.first_name,
            last_name:      m.last_name,
            crew_role:      (m.crew_roles?.code ?? "FLIGHT_ATTENDANT") as ReservationPassenger["gender"],
            license_number: m.license_number ?? "",
        }];
    });
    return {
        ...base,
        aircraft_photo:           (ac.photos as string[] | null)?.[0] ?? null,
        flight_plan_url:          f.flight_plan_url ?? null,
        return_departure_datetime: f.return_departure_datetime ?? null,
        aircraft: {
            id:           ac.id ?? "",
            manufacturer: ac.manufacturer ?? "",
            model:        ac.model ?? "",
            year:         ac.year ?? 0,
            seats:        ac.seats ?? 0,
            range_km:     ac.range_km ?? undefined,
            photos:       (ac.photos as string[]) ?? [],
            tail_number:  ac.tail_number ?? "",
        },
        crew: crew as any,
    };
}

function rowToReservationListItem(row: any): ReservationListItem {
    const statusCode = row.reservation_status?.code ?? "BLOCKED";
    return {
        id:                  row.id,
        booking_reference:   row.booking_reference,
        flight:              rowToFlightListItem(row.flight),
        seats_requested:     row.seats_requested,
        purchase_type:       row.purchase_type,
        reservation_status:  statusCode as ReservationListItem["reservation_status"],
        confirmed_at:        row.confirmed_at ?? null,
        blocked_until:       row.blocked_until ?? null,
        amount_total_paid:   null,
        currency:            "MXN",
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getUserReservations(userId: string): Promise<{
    upcoming: ReservationListItem[];
    past:     ReservationListItem[];
}> {
    const supabase = await createClient();
    const now      = new Date().toISOString();

    const { data, error } = await supabase
        .from("reservations")
        .select(`
            id, booking_reference, seats_requested, purchase_type, confirmed_at, blocked_until,
            reservation_status:reservation_status!reservations_reservation_status_id_fkey (code),
            flight:flights!reservations_flight_id_fkey (${FLIGHT_LIST_FRAGMENT})
        `)
        .eq("user_id", userId)
        .order("confirmed_at", { ascending: false });

    if (error || !data) return { upcoming: [], past: [] };

    const items = (data as any[])
        .filter((r) => r.reservation_status?.code !== "EXPIRED")
        .map(rowToReservationListItem);

    const upcoming = items.filter(
        (r) => new Date(r.flight.departure_datetime) >= new Date(now),
    );
    const past = items.filter(
        (r) => new Date(r.flight.departure_datetime) < new Date(now),
    );

    return { upcoming, past };
}

export async function getReservationDetail(
    reservationId: string,
    userId: string,
): Promise<ReservationDetail | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("reservations")
        .select(`
            id, booking_reference, seats_requested, purchase_type, confirmed_at, blocked_until,
            contact_full_name, contact_email, contact_phone,
            reservation_status:reservation_status!reservations_reservation_status_id_fkey (code),
            passengers:reservation_passengers (
                id, full_name, date_of_birth, gender, email, phone, document_type, is_minor
            ),
            flight:flights!reservations_flight_id_fkey (${FLIGHT_DETAIL_FRAGMENT})
        `)
        .eq("id", reservationId)
        .eq("user_id", userId)
        .single();

    if (error || !data) return null;

    const row        = data as any;
    const statusCode = row.reservation_status?.code ?? "BLOCKED";

    const passengers: ReservationPassenger[] = ((row.passengers ?? []) as any[]).map((p) => ({
        id:            p.id,
        full_name:     p.full_name ?? "",
        date_of_birth: p.date_of_birth ?? "",
        gender:        p.gender ?? "OTHER",
        email:         p.email ?? "",
        phone:         p.phone ?? null,
        document_type: p.document_type ?? "PASSPORT",
        document_url:  "",
        is_minor:      p.is_minor ?? false,
    }));

    return {
        id:                  row.id,
        booking_reference:   row.booking_reference,
        flight:              rowToFlightDetail(row.flight),
        seats_requested:     row.seats_requested,
        purchase_type:       row.purchase_type,
        reservation_status:  statusCode as ReservationDetail["reservation_status"],
        confirmed_at:        row.confirmed_at ?? null,
        blocked_until:       row.blocked_until ?? null,
        amount_total_paid:   null,
        currency:            "MXN",
        contact_full_name:   row.contact_full_name ?? "",
        contact_email:       row.contact_email ?? "",
        contact_phone:       row.contact_phone ?? "",
        passengers,
        payment:             null,
    };
}
