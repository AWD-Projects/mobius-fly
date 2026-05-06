/**
 * POST /api/auth/reset-password
 *
 * Verifies the OTP from password_reset_otps, updates the user's password
 * via the admin client, and deletes the OTP row.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email, token, password } = body as {
        email?: string;
        token?: string;
        password?: string;
    };

    if (!email || !token || token.length !== 6 || !password || password.length < 8) {
        return NextResponse.json(
            { error: "Datos incompletos o inválidos" },
            { status: 400 },
        );
    }

    const admin = createAdminClient();

    // ── Read the OTP row ──────────────────────────────────────────────────────
    const { data: otpRow, error: fetchError } = await admin
        .from("password_reset_otps")
        .select("otp_hash, expires_at")
        .eq("email", email)
        .single();

    if (fetchError || !otpRow) {
        return NextResponse.json(
            { error: "Solicitud expirada. Por favor, empieza de nuevo." },
            { status: 422 },
        );
    }

    // ── Check expiry ──────────────────────────────────────────────────────────
    if (Date.now() > new Date(otpRow.expires_at).getTime()) {
        await admin.from("password_reset_otps").delete().eq("email", email);
        return NextResponse.json(
            { error: "El código ha expirado. Solicita uno nuevo." },
            { status: 422 },
        );
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    if (!verifyOTP(token, otpRow.otp_hash)) {
        return NextResponse.json(
            { error: "Código incorrecto. Verifica e intenta de nuevo." },
            { status: 422 },
        );
    }

    // ── Get user ID by email ──────────────────────────────────────────────────
    const { data: userId } = await admin.rpc("get_user_id_by_email", { p_email: email });

    if (!userId) {
        return NextResponse.json(
            { error: "Usuario no encontrado" },
            { status: 404 },
        );
    }

    // ── Update password via admin client ──────────────────────────────────────
    const { error: updateError } = await admin.auth.admin.updateUserById(
        userId as string,
        { password },
    );

    if (updateError) {
        console.error("[reset-password] updateUserById:", updateError.message);
        return NextResponse.json(
            { error: "Error al actualizar la contraseña" },
            { status: 500 },
        );
    }

    // ── Delete the OTP row ────────────────────────────────────────────────────
    await admin.from("password_reset_otps").delete().eq("email", email);

    return NextResponse.json({ ok: true }, { status: 200 });
}
