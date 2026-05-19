"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardUpcomingFlight {
    id:          string;
    route:       string;
    date:        string;
    aircraft:    string;
    flightType:  string;
    statusCode:  string;
    capacity:    string;
    hasCrew:     boolean;
}

export interface OwnerDashboardData {
    kpis: {
        activeFlights:   number;
        activeAircraft:  number;
        activeCrew:      number;
        pendingDocs:     number;
        monthlyRevenue:  number;
    };
    upcomingFlights: DashboardUpcomingFlight[];
    attention: {
        pendingDocs:           number;
        maintenanceAircraft:   number;
        flightsWithoutCrew:    number;
    };
}

// ─── getOwnerDashboard ────────────────────────────────────────────────────────

export async function getOwnerDashboard(userId: string): Promise<OwnerDashboardData | null> {
    const supabase = await createClient();

    // Step 1: owner + flight status IDs (parallel)
    const [ownerRes, statusRes] = await Promise.all([
        supabase.from("owners").select("id").eq("user_id", userId).single(),
        supabase.from("flight_status").select("id, code"),
    ]);

    if (!ownerRes.data) return null;
    const owner = ownerRes.data;
    const statuses = (statusRes.data ?? []) as { id: string; code: string }[];

    const statusId = (code: string) => statuses.find((s) => s.code === code)?.id;
    const activeStatusIds  = ["SCHEDULED", "DELAYED", "IN_FLIGHT", "ON_TIME"]
        .map(statusId).filter(Boolean) as string[];
    const finishedStatusIds = ["COMPLETED", "CANCELLED"]
        .map(statusId).filter(Boolean) as string[];

    const now        = new Date().toISOString();
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // Step 2: all bulk data in parallel
    const [
        activeFlightsRes,
        aircraftListRes,
        crewCountRes,
        docStatusRes,
        upcomingRes,
        monthFlightsRes,
    ] = await Promise.all([
        supabase
            .from("flights")
            .select("id", { count: "exact", head: true })
            .eq("owner_id", owner.id)
            .in("status_id", activeStatusIds),

        supabase
            .from("aircrafts")
            .select("id, status")
            .eq("owner_id", owner.id),

        supabase
            .from("crew_members")
            .select("id", { count: "exact", head: true })
            .eq("owner_id", owner.id)
            .eq("status", "ACTIVE")
            .eq("is_approved", true),

        supabase
            .from("document_status")
            .select("id, code"),

        supabase
            .from("flights")
            .select(`
                id, flight_type, departure_datetime,
                total_seats, available_seats,
                departure_airport:airports!flights_departure_airport_id_fkey(iata_code, city),
                arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code, city),
                aircraft:aircrafts!flights_aircraft_id_fkey(manufacturer, model),
                flight_status:flight_status!flights_status_id_fkey(code),
                flight_crew!flight_crew_flight_id_fkey(crew_member_id)
            `)
            .eq("owner_id", owner.id)
            .gte("departure_datetime", now)
            .not("status_id", "in", `(${finishedStatusIds.join(",")})`)
            .order("departure_datetime", { ascending: true })
            .limit(5),

        supabase
            .from("flights")
            .select("total_seats, available_seats, price_per_seat")
            .eq("owner_id", owner.id)
            .gte("departure_datetime", monthStart),
    ]);

    // Step 3: pending docs + unapproved aircraft (needs aircraft IDs from step 2)
    const aircraftList       = (aircraftListRes.data ?? []) as { id: string; status: string }[];
    const aircraftIds        = aircraftList.map((a) => a.id);
    const docStatuses        = (docStatusRes.data ?? []) as { id: string; code: string }[];
    const pendingDocStatusId = docStatuses.find((s) => s.code === "PENDING_REVIEW")?.id;
    const approvedDocStatusId = docStatuses.find((s) => s.code === "APPROVED")?.id;

    let pendingDocsCount = 0;
    let unapprovedAircraftIds: string[] = [];

    if (aircraftIds.length > 0) {
        const queries: PromiseLike<any>[] = [];

        if (pendingDocStatusId) {
            queries.push(
                supabase
                    .from("aircraft_documents")
                    .select("id", { count: "exact", head: true })
                    .in("aircraft_id", aircraftIds)
                    .eq("document_status_id", pendingDocStatusId)
                    .then(({ count }) => { pendingDocsCount = count ?? 0; }),
            );
        }

        if (approvedDocStatusId) {
            queries.push(
                supabase
                    .from("aircraft_documents")
                    .select("aircraft_id")
                    .in("aircraft_id", aircraftIds)
                    .neq("document_status_id", approvedDocStatusId)
                    .then(({ data }) => {
                        unapprovedAircraftIds = [...new Set((data ?? []).map((d: any) => d.aircraft_id))];
                    }),
            );
        }

        await Promise.all(queries);
    }

    // Derived stats
    const activeAircraftCount = aircraftList.filter(
        (a) => a.status === "ACTIVE" && !unapprovedAircraftIds.includes(a.id),
    ).length;
    const maintenanceAircraftCount = aircraftList.filter((a) => a.status === "MAINTENANCE").length;

    const monthFlights    = (monthFlightsRes.data ?? []) as any[];
    const monthlyRevenue  = monthFlights.reduce((sum, f) => {
        const sold = (f.total_seats ?? 0) - (f.available_seats ?? 0);
        return sum + sold * Number(f.price_per_seat ?? 0);
    }, 0);

    const upcomingFlights: DashboardUpcomingFlight[] = ((upcomingRes.data ?? []) as any[]).map((row) => {
        const dep = row.departure_airport;
        const arr = row.arrival_airport;
        return {
            id:         row.id,
            route:      `${dep?.city ?? dep?.iata_code ?? "—"} → ${arr?.city ?? arr?.iata_code ?? "—"}`,
            date:       new Date(row.departure_datetime).toLocaleDateString("es-MX", {
                            timeZone: "America/Mexico_City",
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                        }),
            aircraft:   row.aircraft
                            ? (row.aircraft.manufacturer
                                ? `${row.aircraft.manufacturer} ${row.aircraft.model}`
                                : row.aircraft.model)
                            : "—",
            flightType: row.flight_type ?? "ONE_WAY",
            statusCode: row.flight_status?.code ?? "SCHEDULED",
            capacity:   `${(row.total_seats ?? 0) - (row.available_seats ?? 0)}/${row.total_seats ?? 0}`,
            hasCrew:    ((row.flight_crew ?? []) as unknown[]).length > 0,
        };
    });

    const flightsWithoutCrew = upcomingFlights.filter((f) => !f.hasCrew).length;

    return {
        kpis: {
            activeFlights:  activeFlightsRes.count ?? 0,
            activeAircraft: activeAircraftCount,
            activeCrew:     crewCountRes.count ?? 0,
            pendingDocs:    pendingDocsCount,
            monthlyRevenue,
        },
        upcomingFlights,
        attention: {
            pendingDocs:         pendingDocsCount,
            maintenanceAircraft: maintenanceAircraftCount,
            flightsWithoutCrew,
        },
    };
}
