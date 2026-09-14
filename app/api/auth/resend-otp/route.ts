/**
 * POST /api/auth/resend-otp
 *
 * Generates a fresh 6-digit OTP, updates the signup_otps row,
 * and re-sends the code to the original email.
 *
 * The request only needs { email } — all other pending data is read
 * from the existing signup_otps row.
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

    const { email } = body as { email: string };

    if (!email) {
        return NextResponse.json({ error: "Correo requerido" }, { status: 400 });
    }

    const admin = createAdminClient();

    // ── Verify a pending signup row exists for this email ─────────────────────
    const { data: existing, error: fetchError } = await admin
        .from("signup_otps")
        .select("id")
        .eq("email", email)
        .single();

    if (fetchError || !existing) {
        return NextResponse.json(
            { error: "Sesión de registro expirada. Por favor, empieza de nuevo." },
            { status: 422 },
        );
    }

    // ── Generate a new OTP and refresh expiry ─────────────────────────────────
    const newOtp = generateOTP();
    const newExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    const { error: updateError } = await admin
        .from("signup_otps")
        .update({ otp_hash: hashOTP(newOtp), expires_at: newExpiresAt })
        .eq("email", email);

    if (updateError) {
        console.error("[resend-otp] signup_otps update:", updateError.message);
        return NextResponse.json(
            { error: "Error al reenviar el código" },
            { status: 500 },
        );
    }

    // ── Send the new OTP via Resend ───────────────────────────────────────────
    if (process.env.NODE_ENV !== "production") {
        console.log(`[resend-otp] DEV OTP for ${email}: ${newOtp}`);
    }

    const resendKey = process.env.RESEND_API_KEY ?? "";
    if (process.env.NODE_ENV !== "production" && (!resendKey || resendKey.startsWith("your-"))) {
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    const resend = new Resend(resendKey);

    const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@amoxtli.tech",
        to: email,
        subject: "Tu nuevo código de verificación — Mobius Fly",
        html: buildOtpEmail({
            eyebrow:     "Verificación de cuenta",
            heading:     "Confirma tu correo",
            description: "Tu nuevo código de verificación es",
            code:        newOtp,
            ttlMinutes:  OTP_TTL_MINUTES,
        }),
    });

    if (emailError) {
        console.error("[resend-otp] resend email:", emailError);
        return NextResponse.json(
            { error: "Error al reenviar el código" },
            { status: 500 },
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
