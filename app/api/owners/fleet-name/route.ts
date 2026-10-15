/**
 * PATCH /api/owners/fleet-name
 *
 * Sets the fleet_name on the CALLER's owners row.
 * Called at the end of registration (FleetNameStep), after the session exists.
 *
 * The user is taken from the session cookie, never from the request body, and
 * the update goes through the session client so RLS (owners_update) applies too.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { fleetName } = (body ?? {}) as { fleetName?: unknown };

    if (typeof fleetName !== "string" || !fleetName.trim()) {
        return NextResponse.json({ error: "fleetName es requerido" }, { status: 400 });
    }
    if (fleetName.trim().length > 80) {
        return NextResponse.json({ error: "El nombre es demasiado largo" }, { status: 422 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { error } = await supabase
        .from("owners")
        .update({ fleet_name: fleetName.trim() })
        .eq("user_id", user.id);

    if (error) {
        console.error("[fleet-name] update:", error.message);
        return NextResponse.json(
            { error: "No se pudo guardar el nombre de la flota" },
            { status: 500 },
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
