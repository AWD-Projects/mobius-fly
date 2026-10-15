/**
 * POST /api/auth/reset-password
 *
 * Verifies the OTP from password_reset_otps, updates the user's password
 * via the admin client, and deletes the OTP row.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyOTP, normalizeEmail, MAX_OTP_ATTEMPTS } from "@/lib/otp";
import { allowed, clientIp, tooManyRequests } from "@/lib/rate-limit-db";

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email: rawEmail, token, password } = (body ?? {}) as {
        email?: unknown;
        token?: unknown;
        password?: unknown;
    };

    if (
        typeof rawEmail !== "string" || !rawEmail ||
        typeof token !== "string" || token.length !== 6 ||
        typeof password !== "string" || password.length < 8
    ) {
        return NextResponse.json(
            { error: "Datos incompletos o inválidos" },
            { status: 400 },
        );
    }

    const email = normalizeEmail(rawEmail);

    if (!(await allowed(`reset-password:ip:${clientIp(request)}`, 30, 900))) {
        return tooManyRequests();
    }

    const admin = createAdminClient();

    // ── Consume one attempt atomically and read the OTP row ───────────────────
    const { data: taken, error: fetchError } = await admin.rpc("take_reset_otp_attempt", {
        p_email: email,
        p_max:   MAX_OTP_ATTEMPTS,
    });
    const otpRow = Array.isArray(taken) ? taken[0] : null;

    if (fetchError) {
        console.error("[reset-password] take_reset_otp_attempt:", fetchError.message);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    if (!otpRow) {
        return NextResponse.json(
            { error: "Solicitud expirada o sin intentos. Solicita un nuevo código." },
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
    if (!verifyOTP(token, otpRow.otp_hash, email)) {
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
