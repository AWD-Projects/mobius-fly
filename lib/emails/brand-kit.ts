// ─── Shared email brand kit ───────────────────────────────────────────────────
// Single source of truth for colors, typography, logo and layout primitives
// used by every transactional email (booking confirmations, OTP codes,
// contact notifications). Mirrors the design tokens in styles/globals.css so
// emails stay visually consistent with the product.

import { fontFamily } from "@/lib/utils";

// ─── Design tokens (1:1 with styles/globals.css) ──────────────────────────────

export const COLORS = {
    background: "#F6F6F4",
    card:       "#FFFFFF",
    ink:        "#39424E", // --color-secondary / --color-text
    muted:      "#6B6B6B",
    border:     "#E0E0DE",
    gold:       "#C4A77D", // --color-primary — reserved for a single accent per email
    goldSoft:   "#F1E8D9", // light tint of gold, for subtle backgrounds only
    success:    "#4CAF50",
    successBg:  "#E9F6EA",
    warning:    "#D8A32A",
    warningBg:  "#FBF1DE",
    error:      "#D25C5C",
    errorBg:    "#FBEAEA",
} as const;

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20 } as const;

export const FONT_FAMILY = fontFamily;

export function getAppUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? "https://mobiusfly.com";
}

// Hosted on Supabase Storage (public "email-assets" bucket) instead of the app's
// own domain: email clients fetch images from their own servers, not the
// recipient's browser, so the URL must be stable and publicly reachable
// regardless of NEXT_PUBLIC_APP_URL / local dev / preview deployments.
export function logoUrl(): string {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/email-assets/brand/mobius-logo-email.png`;
}

let logoBufferPromise: Promise<Buffer> | null = null;

/**
 * Fetches the brand logo PNG bytes for embedding in server-generated PDFs
 * (pdfkit). Deliberately fetched over HTTP from Supabase Storage rather than
 * read from the local filesystem: files under `public/` are served as static
 * assets on Vercel and are not reliably present inside the serverless
 * function's filesystem at runtime, so `fs.readFileSync` would work locally
 * but fail in production. Cached in-memory per warm process.
 */
export function fetchLogoBuffer(): Promise<Buffer> {
    if (!logoBufferPromise) {
        logoBufferPromise = fetch(logoUrl())
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch logo: ${res.status}`);
                return res.arrayBuffer();
            })
            .then((buf) => Buffer.from(buf))
            .catch((err) => {
                logoBufferPromise = null; // allow retry on next call
                throw err;
            });
    }
    return logoBufferPromise;
}

// ─── HTML shell ────────────────────────────────────────────────────────────────

/**
 * Wraps `inner` HTML in the full <html> document, sets color-scheme so dark-mode
 * email clients don't invert the brand palette, and applies the official font.
 */
export function renderEmailShell(title: string, inner: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.background};font-family:${FONT_FAMILY};color:${COLORS.ink}">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.background};padding:28px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px">
<tr><td style="padding:0 20px">

${inner}

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Header / footer ───────────────────────────────────────────────────────────

/** Logo + wordmark, matching the image+text pattern used in the app navbar. */
export function renderEmailHeader(eyebrowLabel?: string): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px">
<tr>
<td style="vertical-align:middle">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:28px"><img src="${logoUrl()}" width="28" height="30" alt="Mobius Fly" style="display:block"></td>
<td style="padding-left:10px;font-weight:700;font-size:16px;color:${COLORS.ink};font-family:${FONT_FAMILY}">Mobius Fly</td>
</tr></table>
</td>
${eyebrowLabel ? `<td style="vertical-align:middle;text-align:right;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.08em;font-size:10px;font-weight:600">${eyebrowLabel}</td>` : ""}
</tr>
</table>`;
}

export function renderEmailFooter(): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
<tr><td style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.md}px;padding:12px 14px;color:${COLORS.muted};font-size:11px;text-align:center">
Mobius Fly &nbsp;·&nbsp; Vuelos verificados &nbsp;·&nbsp; Pagos seguros &nbsp;·&nbsp; Sin membresías
&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="mailto:contacto@mobiusfly.com" style="color:${COLORS.ink};text-decoration:none">contacto@mobiusfly.com</a>
</td></tr>
</table>`;
}

// ─── Building blocks ────────────────────────────────────────────────────────────

export function renderCard(inner: string, extraStyle = ""): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.lg}px;${extraStyle}">
<tr><td style="padding:16px 18px">${inner}</td></tr>
</table>`;
}

export function renderSectionTitle(text: string): string {
    return `<div style="font-size:15px;font-weight:700;color:${COLORS.ink};margin:0 0 12px;font-family:${FONT_FAMILY}">${text}</div>`;
}

export function renderLabel(text: string): string {
    return `<div style="color:${COLORS.muted};text-transform:uppercase;font-weight:600;letter-spacing:0.06em;font-size:10px;margin-bottom:4px">${text}</div>`;
}

export function renderKvTable(rows: [string, string][]): string {
    const trs = rows.map(([k, v]) => `
<tr>
<td style="color:${COLORS.muted};font-size:12px;padding:7px 0;border-bottom:1px dashed ${COLORS.border};width:45%">${k}</td>
<td style="color:${COLORS.ink};font-size:12px;font-weight:700;text-align:right;padding:7px 0;border-bottom:1px dashed ${COLORS.border}">${v}</td>
</tr>`).join("");
    return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${trs}</table>`;
}

type BadgeTone = "success" | "warning" | "error" | "neutral";

const BADGE_TONES: Record<BadgeTone, { fg: string; bg: string; border: string }> = {
    success: { fg: COLORS.success, bg: COLORS.successBg, border: "rgba(76,175,80,0.25)" },
    warning: { fg: "#8a6a17",      bg: COLORS.warningBg, border: "rgba(216,163,42,0.3)" },
    error:   { fg: COLORS.error,   bg: COLORS.errorBg,   border: "rgba(210,92,92,0.25)" },
    neutral: { fg: COLORS.ink,     bg: COLORS.background, border: COLORS.border },
};

export function renderBadge(text: string, tone: BadgeTone = "success"): string {
    const t = BADGE_TONES[tone];
    return `<span style="display:inline-block;padding:7px 13px;border-radius:${RADIUS.xl}px;color:${t.fg};background:${t.bg};border:1px solid ${t.border};font-weight:700;font-size:10px">${text}</span>`;
}

type ButtonVariant = "primary" | "secondary";

/** Primary = solid gold CTA (matches the app's Button `primary` variant). Use at most once per email. */
export function renderButton(label: string, href: string, variant: ButtonVariant = "primary"): string {
    const style = variant === "primary"
        ? `background:${COLORS.gold};color:#fff;`
        : `background:${COLORS.card};color:${COLORS.ink};border:1px solid ${COLORS.border};`;
    return `<a href="${href}" style="display:inline-block;padding:11px 18px;border-radius:${RADIUS.sm}px;${style}font-weight:700;font-size:12px;text-decoration:none;font-family:${FONT_FAMILY}">${label}</a>`;
}

/** Large OTP code display — the single tasteful use of gold as a thin accent border. */
export function renderOtpBox(code: string): string {
    const spaced = code.split("").join("&#8202;");
    return `<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="background:${COLORS.goldSoft};border:1px solid rgba(196,167,125,0.45);border-radius:${RADIUS.lg}px;padding:20px">
<div style="font-size:40px;font-weight:700;letter-spacing:0.2em;color:${COLORS.ink};font-family:${FONT_FAMILY}">${spaced}</div>
</td></tr>
</table>`;
}
