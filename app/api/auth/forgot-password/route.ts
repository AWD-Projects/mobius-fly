/**
 * POST /api/auth/forgot-password
 *
 * Generates a 6-digit OTP, stores it in password_reset_otps, and sends
 * it to the user's email via Resend. Returns 404 if the email is not
 * registered in the platform.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP, hashOTP, OTP_TTL_MINUTES } from "@/lib/otp";
import { createAdminClient } from "@/lib/supabase/server";
import { buildOtpEmail } from "@/lib/emails/otp-templates";

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email } = body as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Correo requerido" }, { status: 400 });
    }

    const admin = createAdminClient();

    // ── Check if an auth user with this email exists ──────────────────────────
    const { data: userId } = await admin.rpc("get_user_id_by_email", { p_email: email });

    if (!userId) {
        return NextResponse.json(
            { error: "Este correo no está registrado en la plataforma." },
            { status: 404 },
        );
    }

    // ── Generate OTP and upsert into password_reset_otps ─────────────────────
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    const { error: upsertError } = await admin
        .from("password_reset_otps")
        .upsert(
            { email, otp_hash: hashOTP(otp), expires_at: expiresAt },
            { onConflict: "email" },
        );

    if (upsertError) {
        console.error("[forgot-password] upsert:", upsertError.message);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    // ── Send email via Resend ─────────────────────────────────────────────────
    if (process.env.NODE_ENV !== "production") {
        console.log(`[forgot-password] DEV OTP for ${email}: ${otp}`);
    }

    const resendKey = process.env.RESEND_API_KEY ?? "";
    if (!resendKey || resendKey.startsWith("your-")) {
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    const resend = new Resend(resendKey);

    const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@amoxtli.tech",
        to: email,
        subject: "Recupera tu contraseña — Mobius Fly",
        html: buildOtpEmail({
            eyebrow:     "Recuperación de contraseña",
            heading:     "Recupera tu contraseña",
            description: "Usa el siguiente código para restablecer tu contraseña",
            code:        otp,
            ttlMinutes:  OTP_TTL_MINUTES,
        }),
    });

    if (emailError) {
        console.error("[forgot-password] resend:", emailError);
        return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
