/**
 * PATCH /api/owners/fleet-name
 *
 * Sets the fleet_name on the owners row for a given user_id.
 * Called during registration step 6 (FleetNameStep) before navigating to dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { userId, fleetName } = body as { userId?: string; fleetName?: string };

    if (!userId || !fleetName || !fleetName.trim()) {
        return NextResponse.json(
            { error: "userId y fleetName son requeridos" },
            { status: 400 },
        );
    }

    const admin = createAdminClient();

    const { error } = await admin
        .from("owners")
        .update({ fleet_name: fleetName.trim() })
        .eq("user_id", userId);

    if (error) {
        console.error("[fleet-name] update:", error.message);
        return NextResponse.json(
            { error: "No se pudo guardar el nombre de la flota" },
            { status: 500 },
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
