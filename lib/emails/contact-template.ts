// ─── Contact form internal notification email ────────────────────────────────

import {
    COLORS,
    FONT_FAMILY,
    renderEmailShell,
    renderEmailHeader,
    renderEmailFooter,
    renderCard,
    renderSectionTitle,
    renderKvTable,
} from "@/lib/emails/brand-kit";

export interface ContactNotificationOpts {
    userType: string;
    name:     string;
    email:    string;
    phone?:   string | null;
    message?: string | null;
}

export function buildContactNotificationEmail(opts: ContactNotificationOpts): string {
    const { userType, name, email, phone, message } = opts;

    const rows: [string, string][] = [
        ["Tipo de usuario", userType === "reservar" ? "Reservar un vuelo" : "Administrar mis vuelos"],
        ["Nombre",          name],
        ["Correo",          `<a href="mailto:${email}" style="color:${COLORS.ink};text-decoration:none">${email}</a>`],
    ];
    if (phone) rows.push(["Teléfono", phone]);

    const messageBlock = message
        ? `<div style="margin-top:14px">
<div style="color:${COLORS.muted};font-size:10px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Mensaje</div>
<div style="color:${COLORS.ink};font-size:13px;line-height:1.6;white-space:pre-line">${message.trim()}</div>
</div>`
        : "";

    const body = renderCard(renderSectionTitle("Nuevo contacto recibido") + renderKvTable(rows) + messageBlock);

    return renderEmailShell(
        "Mobius Fly — Nuevo contacto",
        renderEmailHeader("Formulario de contacto") + body +
        `<div style="margin-top:14px;color:${COLORS.muted};font-size:11px;text-align:center;font-family:${FONT_FAMILY}">Este mensaje fue enviado desde el formulario de contacto de Mobius Fly</div>` +
        renderEmailFooter(),
    );
}
