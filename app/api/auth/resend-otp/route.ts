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
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#F6F6F4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F6F6F4;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520"
             style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#C4A77D;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;letter-spacing:-0.02em;">
              Mobius Fly
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:#39424E;font-size:16px;">Tu nuevo código de verificación es</p>
            <p style="margin:0 0 24px;color:#39424E;font-size:48px;font-weight:700;letter-spacing:0.15em;">
              ${newOtp}
            </p>
            <p style="margin:0;color:#39424E;font-size:14px;opacity:0.7;">
              Este código expira en ${OTP_TTL_MINUTES} minutos.<br>
              Si no solicitaste este código, ignora este mensaje.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#F6F6F4;text-align:center;">
            <p style="margin:0;color:#39424E;font-size:12px;opacity:0.6;">
              © Mobius Fly — Vuelos privados
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
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
