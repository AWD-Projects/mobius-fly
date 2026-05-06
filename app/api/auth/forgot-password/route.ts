/**
 * POST /api/auth/forgot-password
 *
 * Generates a 6-digit OTP, stores it in password_reset_otps, and sends
 * it to the user's email via Resend. Always returns 200 to avoid email
 * enumeration — the client shows the same "check your email" screen
 * regardless of whether the account exists.
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

    const { email } = body as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Correo requerido" }, { status: 400 });
    }

    const admin = createAdminClient();

    // ── Check if an auth user with this email exists ──────────────────────────
    const { data: userId } = await admin.rpc("get_user_id_by_email", { p_email: email });

    // Always respond 200 even if user doesn't exist (anti-enumeration)
    if (!userId) {
        return NextResponse.json({ ok: true }, { status: 200 });
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
            <p style="margin:0 0 4px;color:#39424E;font-size:16px;font-weight:600;">Recupera tu contraseña</p>
            <p style="margin:0 0 28px;color:#6B6B6B;font-size:14px;">Usa el siguiente código para restablecer tu contraseña</p>
            <p style="margin:0 0 28px;color:#39424E;font-size:52px;font-weight:700;letter-spacing:0.15em;line-height:1;">
              ${otp}
            </p>
            <p style="margin:0;color:#39424E;font-size:14px;opacity:0.7;line-height:1.6;">
              Este código expira en ${OTP_TTL_MINUTES} minutos.<br>
              Si no solicitaste esto, puedes ignorar este mensaje.
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
        console.error("[forgot-password] resend:", emailError);
        return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
