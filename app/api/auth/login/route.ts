/**
 * POST /api/auth/login
 *
 * Verifies credentials with Supabase Auth, fetches user_profiles,
 * and returns a UserProfile object for the client to store in localStorage.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
        return NextResponse.json(
            { error: "Correo y contraseña requeridos" },
            { status: 400 },
        );
    }

    // ── 1. Verify credentials ─────────────────────────────────────────────────
    // Use a session-less anon client — we only need to verify the password.
    const authClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: authData, error: authError } =
        await authClient.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
        return NextResponse.json(
            { error: "Correo o contraseña incorrectos" },
            { status: 401 },
        );
    }

    const userId = authData.user.id;

    // ── 2. Fetch user_profiles ────────────────────────────────────────────────
    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
        console.error("[login] user_profiles fetch:", profileError?.message);
        return NextResponse.json(
            { error: "No se pudo cargar el perfil de usuario" },
            { status: 500 },
        );
    }

    // ── 3. Return UserProfile ─────────────────────────────────────────────────
    return NextResponse.json({
        user: {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: authData.user.email,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            phone: profile.phone,
            country_code: profile.country_code,
            nationality: profile.nationality,
            role: profile.role,
            status: profile.status,
        },
    }, { status: 200 });
}
