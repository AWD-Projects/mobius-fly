// ─── Shared OTP email template ────────────────────────────────────────────────
// Used by signup, resend-otp and forgot-password — previously three
// near-identical inline HTML strings, now a single on-brand builder.

import {
    COLORS,
    FONT_FAMILY,
    renderEmailShell,
    renderEmailHeader,
    renderEmailFooter,
    renderLabel,
    renderOtpBox,
} from "@/lib/emails/brand-kit";

export interface OtpEmailOpts {
    heading:      string;
    description:  string;
    code:         string;
    ttlMinutes:   number;
    eyebrow?:     string;
}

export function buildOtpEmail(opts: OtpEmailOpts): string {
    const { heading, description, code, ttlMinutes, eyebrow = "Verificación" } = opts;

    const body = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:28px 24px;text-align:center">
${renderLabel(eyebrow)}
<h1 style="margin:6px 0 6px;font-size:20px;color:${COLORS.ink};font-family:${FONT_FAMILY}">${heading}</h1>
<div style="color:${COLORS.muted};font-size:13px;margin-bottom:20px">${description}</div>
${renderOtpBox(code)}
<div style="margin-top:16px;color:${COLORS.muted};font-size:12px;line-height:1.6">
Este código expira en ${ttlMinutes} minutos.<br>
Si no solicitaste esto, puedes ignorar este mensaje.
</div>
</td></tr>
</table>`;

    return renderEmailShell(
        "Mobius Fly — Código de verificación",
        renderEmailHeader() + body + renderEmailFooter(),
    );
}
