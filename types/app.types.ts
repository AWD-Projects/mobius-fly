// ─────────────────────────────────────────────
// MOBIUS FLY — App Types (Buyer scope)
// ─────────────────────────────────────────────

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;       // ISO 8601: "1990-05-15"
    gender: "MALE" | "FEMALE" | "OTHER";
    phone: string | null;
    country_code: string | null; // "+52"
    nationality: string;         // ISO 3166-1 alpha-2: "MX", "US", etc.
    role: "PASSENGER" | "OWNER";
    email_verified_at: string | null;
    status: "ACTIVE" | "SUSPENDED" | "PENDING";
    email: string;               // viene de auth.users, se adjunta en el hook
}

export type FlightStatusCode =
    | "PENDING_REVIEW"
    | "APPROVED"
    | "ON_TIME"
    | "DELAYED"
    | "IN_FLIGHT"
    | "CANCELLED"
    | "COMPLETED";

export type ReservationStatusCode =
    | "BLOCKED"
    | "EXPIRED"
    | "CONFIRMED"
    | "CANCELLED";

export type DocumentStatusCode = "PENDING" | "APPROVED" | "REJECTED";

export interface UserDocument {
    id: string;
    user_id: string;
    document_type: "INE" | "PASSPORT";
    document_url: string;
    document_status_id: string;          // FK → document_status.id (lookup table)
    document_status: DocumentStatusCode; // campo resuelto via join para la UI
    rejected_reason: string | null;
}

export interface OwnerProfile {
    id: string;
    user_id: string;
    fleet_name: string | null;
    status: "PENDING_ONBOARDING" | "ACTIVE" | "SUSPENDED";
}

export interface Airport {
    id: string;
    iata_code: string;
    name: string;
    city: string;
    state: string;
    country: string;
}

export interface AircraftPublic {
    id: string;
    manufacturer: string;
    model: string;
    year: number;
    seats: number;
    range_km?: number;
    photos: string[];
    tail_number: string;
}

export interface CrewMemberPublic {
    id: string;
    first_name: string;
    last_name: string;
    crew_role: "CAPTAIN" | "FIRST_OFFICER" | "CREW";
    license_number: string;
}

export interface FlightListItem {
    id: string;
    flight_code: string;
    flight_type: "ONE_WAY" | "ROUND_TRIP";
    departure_airport: Airport;
    arrival_airport: Airport;
    departure_fbo_name: string;
    arrival_fbo_name: string | null;
    departure_datetime: string;
    arrival_datetime: string;
    total_seats: number;
    available_seats: number;
    price_per_seat: number;
    price_full_aircraft: number;
    currency: "MXN";
    flight_status: FlightStatusCode;
    is_reservable: boolean;
    duration_minutes: number | null;
    aircraft_photo: string | null;
}

export interface FlightDetail extends FlightListItem {
    aircraft: AircraftPublic;
    crew: CrewMemberPublic[];
    flight_plan_url: string | null;
}

export interface ReservationPassenger {
    id: string;
    full_name: string;
    date_of_birth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    email: string;
    phone: string | null;
    document_type: "INE" | "PASSPORT";
    document_url: string;
    is_minor: boolean;
}

export interface ReservationPayment {
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    base_price: number;
    passenger_fee_amount: number;
    vat_amount_total: number;
    amount_total_paid: number;
    paid_at: string | null;
    currency: "MXN";
}

export interface ReservationListItem {
    id: string;
    booking_reference: string;
    flight: FlightListItem;
    seats_requested: number;
    reservation_status: ReservationStatusCode;
    confirmed_at: string | null;
    blocked_until: string | null;
    amount_total_paid: number | null;
    currency: "MXN";
}

export interface ReservationDetail extends ReservationListItem {
    flight: FlightDetail;
    passengers: ReservationPassenger[];
    contact_full_name: string;
    contact_email: string;
    contact_phone: string;
    payment: ReservationPayment | null;
}

export interface RoundTripPair {
    id: string;
    outbound: FlightListItem;
    inbound: FlightListItem;
    currency: "MXN";
}
