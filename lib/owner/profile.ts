// ─────────────────────────────────────────────
// MOBIUS FLY — Owner Profile Queries
// ─────────────────────────────────────────────

import { SupabaseClient } from "@supabase/supabase-js";
import {
    OwnerProfile,
    OwnerProfileDetail,
    UserProfile,
    UserDocument,
    FleetStats,
    CrewStats,
    FlightStats,
    EarningsStats,
} from "@/types/app.types";

/**
 * Get owner profile with all related data
 */
export async function getOwnerProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<OwnerProfileDetail | null> {
    try {
        // 1. Get owner basic info
        const { data: ownerData, error: ownerError } = await supabase
            .from("owners")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (ownerError || !ownerData) {
            console.error("Error fetching owner:", ownerError);
            return null;
        }

        // 2. Get user profile
        const { data: userData, error: userError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (userError || !userData) {
            console.error("Error fetching user profile:", userError);
            return null;
        }

        // Get user email from auth
        const { data: authData } = await supabase.auth.getUser();
        const userProfile: UserProfile = {
            ...userData,
            email: authData.user?.email || "",
        };

        // 3. Get user documents with status
        const { data: documentsData, error: documentsError } = await supabase
            .from("user_documents")
            .select(
                `
                *,
                document_status:document_status_id (
                    code,
                    name
                )
            `
            )
            .eq("user_id", userId);

        const userDocuments: UserDocument[] = documentsData
            ? documentsData.map((doc: any) => ({
                  id: doc.id,
                  user_id: doc.user_id,
                  document_type: doc.document_type,
                  document_url: doc.document_url,
                  document_status_id: doc.document_status_id,
                  document_status: doc.document_status?.code || "PENDING",
                  rejected_reason: doc.rejected_reason,
              }))
            : [];

        // 4. Get fleet stats
        const fleetStats = await getFleetStats(supabase, ownerData.id);

        // 5. Get crew stats
        const crewStats = await getCrewStats(supabase, ownerData.id);

        // 6. Get flight stats
        const flightStats = await getFlightStats(supabase, ownerData.id);

        // 7. Get earnings stats
        const earningsStats = await getEarningsStats(supabase, ownerData.id);

        const ownerProfile: OwnerProfile = {
            id: ownerData.id,
            user_id: ownerData.user_id,
            fleet_name: ownerData.fleet_name,
            status: ownerData.status,
            stripe_account_id: ownerData.stripe_account_id,
            stripe_onboarding_completed_at: ownerData.stripe_onboarding_completed_at,
            stripe_charges_enabled: ownerData.stripe_charges_enabled,
            stripe_payouts_enabled: ownerData.stripe_payouts_enabled,
            stripe_details_submitted: ownerData.stripe_details_submitted,
            created_at: ownerData.created_at,
            updated_at: ownerData.updated_at,
        };

        return {
            ...ownerProfile,
            user_profile: userProfile,
            user_documents: userDocuments,
            fleet_stats: fleetStats,
            crew_stats: crewStats,
            flight_stats: flightStats,
            earnings_stats: earningsStats,
        };
    } catch (error) {
        console.error("Error in getOwnerProfile:", error);
        return null;
    }
}

/**
 * Get fleet statistics
 */
export async function getFleetStats(
    supabase: SupabaseClient,
    ownerId: string
): Promise<FleetStats> {
    const { data: aircrafts } = await supabase
        .from("aircrafts")
        .select("manufacturer, seats")
        .eq("owner_id", ownerId);

    if (!aircrafts || aircrafts.length === 0) {
        return {
            total_aircrafts: 0,
            unique_manufacturers: 0,
            total_seats_capacity: 0,
        };
    }

    const uniqueManufacturers = new Set(
        aircrafts.map((a) => a.manufacturer).filter(Boolean)
    );

    return {
        total_aircrafts: aircrafts.length,
        unique_manufacturers: uniqueManufacturers.size,
        total_seats_capacity: aircrafts.reduce((sum, a) => sum + (a.seats || 0), 0),
    };
}

/**
 * Get crew statistics
 */
export async function getCrewStats(
    supabase: SupabaseClient,
    ownerId: string
): Promise<CrewStats> {
    const { data: crewMembers } = await supabase
        .from("crew_members")
        .select(
            `
            id,
            status,
            crew_role:crew_role_id (
                name
            )
        `
        )
        .eq("owner_id", ownerId);

    if (!crewMembers || crewMembers.length === 0) {
        return {
            total_crew: 0,
            active_crew: 0,
            crew_by_role: [],
        };
    }

    const activeCrew = crewMembers.filter((c: any) => c.status === "active");

    // Group by role
    const roleCount: Record<string, number> = {};
    crewMembers.forEach((c: any) => {
        const roleName = c.crew_role?.name || "Sin rol";
        roleCount[roleName] = (roleCount[roleName] || 0) + 1;
    });

    const crewByRole = Object.entries(roleCount).map(([role_name, count]) => ({
        role_name,
        count,
    }));

    return {
        total_crew: crewMembers.length,
        active_crew: activeCrew.length,
        crew_by_role: crewByRole,
    };
}

/**
 * Get flight statistics
 */
export async function getFlightStats(
    supabase: SupabaseClient,
    ownerId: string
): Promise<FlightStats> {
    const { data: flights } = await supabase
        .from("flights")
        .select(
            `
            id,
            total_seats,
            available_seats,
            status:status_id (
                code
            )
        `
        )
        .eq("owner_id", ownerId);

    if (!flights || flights.length === 0) {
        return {
            total_flights: 0,
            completed_flights: 0,
            upcoming_flights: 0,
            cancelled_flights: 0,
            total_seats_sold: 0,
        };
    }

    const completed = flights.filter(
        (f: any) => f.status?.code === "COMPLETED"
    ).length;
    const upcoming = flights.filter((f: any) =>
        ["PENDING_REVIEW", "APPROVED", "ON_TIME", "IN_FLIGHT"].includes(f.status?.code)
    ).length;
    const cancelled = flights.filter(
        (f: any) => f.status?.code === "CANCELLED"
    ).length;

    const totalSeatsSold = flights.reduce(
        (sum: number, f: any) =>
            sum + ((f.total_seats || 0) - (f.available_seats || 0)),
        0
    );

    return {
        total_flights: flights.length,
        completed_flights: completed,
        upcoming_flights: upcoming,
        cancelled_flights: cancelled,
        total_seats_sold: totalSeatsSold,
    };
}

/**
 * Get earnings statistics
 */
export async function getEarningsStats(
    supabase: SupabaseClient,
    ownerId: string
): Promise<EarningsStats> {
    // Get all payments for this owner's flights
    const { data: payments } = await supabase
        .from("payments")
        .select(
            `
            amount_owner_net,
            paid_at,
            status,
            flight:flight_id (
                owner_id
            )
        `
        )
        .eq("status", "succeeded");

    if (!payments || payments.length === 0) {
        return {
            total_earnings: 0,
            earnings_this_month: 0,
            total_transactions: 0,
            avg_earning_per_transaction: 0,
            currency: "MXN",
        };
    }

    // Filter payments for this owner
    const ownerPayments = payments.filter(
        (p: any) => p.flight?.owner_id === ownerId
    );

    if (ownerPayments.length === 0) {
        return {
            total_earnings: 0,
            earnings_this_month: 0,
            total_transactions: 0,
            avg_earning_per_transaction: 0,
            currency: "MXN",
        };
    }

    const totalEarnings = ownerPayments.reduce(
        (sum: number, p: any) => sum + (Number(p.amount_owner_net) || 0),
        0
    );

    // Get current month earnings
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const earningsThisMonth = ownerPayments
        .filter((p: any) => new Date(p.paid_at) >= firstDayOfMonth)
        .reduce((sum: number, p: any) => sum + (Number(p.amount_owner_net) || 0), 0);

    return {
        total_earnings: totalEarnings,
        earnings_this_month: earningsThisMonth,
        total_transactions: ownerPayments.length,
        avg_earning_per_transaction:
            ownerPayments.length > 0 ? totalEarnings / ownerPayments.length : 0,
        currency: "MXN",
    };
}

/**
 * Update owner fleet name
 */
export async function updateFleetName(
    supabase: SupabaseClient,
    ownerId: string,
    fleetName: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("owners")
        .update({ fleet_name: fleetName, updated_at: new Date().toISOString() })
        .eq("id", ownerId);

    if (error) {
        console.error("Error updating fleet name:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
