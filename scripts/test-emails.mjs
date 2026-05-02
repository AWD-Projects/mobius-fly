// ─── Email template preview sender ───────────────────────────────────────────
// Sends all three email types to a test address so the design can be reviewed.
// Usage:  node scripts/test-emails.mjs

import { Resend } from "resend";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, "..");

// ── Load .env manually (no dotenv dep needed) ─────────────────────────────────
const envPath = resolve(ROOT, ".env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
}

const TO   = "alfaroga31@gmail.com";
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com";

// ── Import compiled templates via tsx / ts-node path alias workaround ─────────
// We transpile on-the-fly using the project's TypeScript via tsx
import { createRequire as cr } from "module";

// Use tsx to import the TS modules
const { register } = await import("node:module");

// Inline the template logic here to avoid needing tsx at runtime
// We re-implement the helpers and call the same functions

// ─── Paste the built templates inline ─────────────────────────────────────────
// (compiled from booking-templates.ts + manifest-pdf.ts)

const BG     = "#f6f4f1";
const CARD   = "#ffffff";
const INK    = "#243a57";
const MUTED  = "#7c8796";
const LINE   = "#e8e2d8";
const ACCENT = "#c8a46a";
const ASOFT  = "#efe6d7";
const SUCCESS = "#2f6b56";

function fmtMXN(n) {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function calcAge(dob) {
    if (!dob) return "—";
    const birth = new Date(dob), today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return String(age);
}
function genderLabel(g) {
    if (g === "MALE")   return "Masculino";
    if (g === "FEMALE") return "Femenino";
    if (g === "OTHER")  return "Otro";
    return "—";
}
function purchaseTypeLabel(type, seats) {
    if (type === "full_aircraft") return "Aeronave completa";
    return `${seats} ${seats === 1 ? "asiento" : "asientos"}`;
}
function iata(s) {
    return s.match(/\(([A-Z]{3})\)/)?.[1] ?? s;
}
function emailWrap(inner) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mobius Fly</title>
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Arial,Helvetica,sans-serif;color:${INK}">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:28px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${BG};border:1px solid #eee8de;border-radius:20px">
<tr><td style="padding:20px">
${inner}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
<tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:12px;padding:12px 14px;color:${MUTED};font-size:11px">
Mobius Fly &nbsp;·&nbsp; Vuelos verificados &nbsp;·&nbsp; Pagos seguros &nbsp;·&nbsp; Sin membresías
&nbsp;&nbsp;|&nbsp;&nbsp;
soporte@mobiusfly.com &nbsp;·&nbsp; Documento generado digitalmente
</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
function brand() {
    return `<table cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr>
<td style="width:32px;height:32px;border:2px solid ${INK};border-radius:8px 16px 8px 16px;text-align:center;vertical-align:middle;font-weight:800;font-size:15px;color:${INK}">M</td>
<td style="padding-left:10px;font-weight:700;font-size:17px;color:${INK}">Mobius Fly</td>
</tr>
</table>`;
}
function card(inner, style = "") {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;${style}">
<tr><td style="padding:16px 18px">${inner}</td></tr>
</table>`;
}
function eyebrow(text) {
    return `<div style="color:${ACCENT};text-transform:uppercase;font-weight:700;letter-spacing:0.08em;font-size:10px;margin-bottom:4px">${text}</div>`;
}
function statusBadge(text) {
    return `<span style="display:inline-block;padding:7px 13px;border-radius:999px;color:${SUCCESS};background:rgba(47,107,86,0.10);border:1px solid rgba(47,107,86,0.20);font-weight:700;font-size:10px">${text}</span>`;
}
function kvTable(rows) {
    const trs = rows.map(([k, v]) => `
<tr>
<td style="color:${MUTED};font-size:12px;padding:7px 0;border-bottom:1px dashed #ece6dc;width:45%">${k}</td>
<td style="color:${INK};font-size:12px;font-weight:700;text-align:right;padding:7px 0;border-bottom:1px dashed #ece6dc">${v}</td>
</tr>`).join("");
    return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${trs}</table>`;
}
function sectionH2(text) {
    return `<div style="font-size:15px;font-weight:700;color:${INK};margin:0 0 12px">${text}</div>`;
}

function buildBuyerConfirmationEmail(opts) {
    const { contactName, contactEmail, contactPhone, bookingReference, origin, destination,
            departureDate, departureTime, flightCode, departureFboName, seatsRequested,
            purchaseType, passengers, amountTotalPaid } = opts;
    const depIata = iata(origin), arrIata = iata(destination);
    const issuedAt = new Date().toLocaleDateString("es-MX", { day:"2-digit",month:"2-digit",year:"numeric" }) +
                     " · " + new Date().toLocaleTimeString("es-MX", { hour:"2-digit",minute:"2-digit",hour12:false });

    const heroCard = `
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="62%" style="vertical-align:top;padding-right:12px">
${card(`
${eyebrow("Reserva confirmada")}
<h1 style="margin:4px 0 8px;font-size:26px;line-height:1.05;color:${INK}">Tu vuelo está listo</h1>
<div style="color:${MUTED};font-size:13px;line-height:1.5">Tu lugar ha sido reservado exitosamente. Aquí están los detalles más importantes de tu experiencia.</div>
<div style="margin-top:14px">${statusBadge("Pagado y confirmado")}</div>
`)}
</td>
<td width="38%" style="vertical-align:top">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#c8b28e 0%,#f0ece4 45%,#d7dfe8 100%);border:1px solid ${LINE};border-radius:16px;height:170px">
<tr><td style="padding:16px;vertical-align:bottom">
<span style="color:#fff;background:rgba(36,58,87,0.45);padding:7px 11px;border-radius:999px;font-size:10px">Private aviation experience</span>
</td></tr>
</table>
</td>
</tr>
</table>`;

    const routeBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:18px;margin:12px 0 14px">
<tr><td style="padding:20px">
<div style="font-size:30px;font-weight:700;letter-spacing:-0.04em;color:${ACCENT};margin-bottom:10px">${depIata} &nbsp;→&nbsp; ${arrIata}</div>
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Tipo de viaje</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${purchaseTypeLabel(purchaseType, seatsRequested)}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Salida</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${departureDate}${departureTime ? ` · ${departureTime}` : ""}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">FBO de salida</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${departureFboName || "—"}</div>
</td>
<td width="25%" style="vertical-align:top">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Código de reserva</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${bookingReference}</div>
</td>
</tr></table>
</td></tr>
</table>`;

    const bookingRows = [
        ["Titular",        contactName   || "—"],
        ["Correo",         contactEmail  || "—"],
        ["Teléfono",       contactPhone  || "—"],
        ["Pasajeros",      String(seatsRequested)],
        ["Método de pago", "Tarjeta de crédito / débito"],
        ["Monto pagado",   `$${fmtMXN(amountTotalPaid)} MXN`],
    ];
    const flightRows = [
        ["Origen",          origin],
        ["Destino",         destination],
        ["Código de vuelo", flightCode  || "—"],
        ["FBO de salida",   departureFboName || "—"],
        ["Emisión",         issuedAt],
    ];
    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
<td width="50%" style="vertical-align:top;padding-right:7px">${card(sectionH2("Detalles de la reserva") + kvTable(bookingRows))}</td>
<td width="50%" style="vertical-align:top;padding-left:7px">${card(sectionH2("Información del vuelo") + kvTable(flightRows))}</td>
</tr></table>`;

    let passengersSection = "";
    if (passengers.length > 0) {
        const paxRows = passengers.map((p, i) => `
<tr style="background:${i%2===0?CARD:BG}">
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${i+1}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${p.full_name||"—"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.is_minor?"Menor":"Adulto"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${genderLabel(p.gender)}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${calcAge(p.date_of_birth)} años</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.document_type||"—"}</td>
</tr>`).join("");
        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Pasajeros")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;overflow:hidden">
<tr style="background:#fcfaf7">
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">#</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Nombre</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Tipo</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Género</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Edad</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Doc.</th>
</tr>${paxRows}
</table>
</td></tr>
</table>`;
    }

    const steps = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Qué sigue")}
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="33%" style="vertical-align:top;padding-right:10px">
<span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${ASOFT};color:${ACCENT};font-weight:700;font-size:11px;margin-bottom:6px">1</span>
<div style="font-weight:700;font-size:12px;color:${INK};margin-bottom:4px">Validación final de pasajeros</div>
<div style="font-size:11px;color:${MUTED};line-height:1.5">Si se requiere documentación adicional o validación complementaria, te contactaremos por correo o teléfono.</div>
</td>
<td width="33%" style="vertical-align:top;padding-right:10px">
<span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${ASOFT};color:${ACCENT};font-weight:700;font-size:11px;margin-bottom:6px">2</span>
<div style="font-weight:700;font-size:12px;color:${INK};margin-bottom:4px">Información previa al embarque</div>
<div style="font-size:11px;color:${MUTED};line-height:1.5">Antes de tu salida recibirás el punto de encuentro, hora recomendada de llegada y cualquier instrucción operativa relevante.</div>
</td>
<td width="33%" style="vertical-align:top">
<span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${ASOFT};color:${ACCENT};font-weight:700;font-size:11px;margin-bottom:6px">3</span>
<div style="font-weight:700;font-size:12px;color:${INK};margin-bottom:4px">Experiencia Mobius Fly</div>
<div style="font-size:11px;color:${MUTED};line-height:1.5">Nuestro equipo y el operador verificarán que todo esté listo para tu vuelo en condiciones de seguridad y cumplimiento.</div>
</td>
</tr></table>
</td></tr>
</table>`;

    const note = `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:12px;padding:14px 16px;color:${MUTED};font-size:10.5px;line-height:1.6">
La reserva está sujeta a validación operativa final, disponibilidad efectiva de la aeronave, condiciones de seguridad y cumplimiento regulatorio. En caso de ajustes necesarios, Mobius Fly notificará oportunamente al titular de la reserva conforme a los términos aplicables.
</td></tr></table>`;

    const actions = `<table cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
<td><a href="https://mobiusfly.com/my-trips" style="display:inline-block;padding:10px 16px;border-radius:12px;background:${ACCENT};color:#fff;font-weight:700;font-size:11px;text-decoration:none;margin-right:8px">Ver mi reserva</a></td>
<td><a href="mailto:soporte@mobiusfly.com" style="display:inline-block;padding:10px 16px;border-radius:12px;border:1px solid ${LINE};color:${INK};font-weight:700;font-size:11px;text-decoration:none;background:${CARD}">Contactar soporte</a></td>
</tr></table>`;

    return emailWrap(brand() + heroCard + routeBox + twoCol + passengersSection + steps + note + actions);
}

function buildOwnerNotificationEmail(opts) {
    const { bookingReference, origin, destination, departureDate, departureTime,
            flightCode, purchaseType, seatsRequested, passengers,
            contactFullName, contactEmail, contactPhone, amountOwnerNet,
            departureFboName, arrivalFboName } = opts;
    const depIata = iata(origin), arrIata = iata(destination);

    const routeBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:18px;margin:12px 0 14px">
<tr><td style="padding:20px">
<div style="font-size:28px;font-weight:700;letter-spacing:-0.04em;color:${ACCENT};margin-bottom:10px">${depIata} &nbsp;→&nbsp; ${arrIata}</div>
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Tipo de venta</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${purchaseTypeLabel(purchaseType, seatsRequested)}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Salida</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${departureDate}${departureTime?` · ${departureTime}`:""}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">FBO salida</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${departureFboName||"—"}</div>
</td>
<td width="25%" style="vertical-align:top">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Código de reserva</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${bookingReference}</div>
</td>
</tr></table>
</td></tr>
</table>`;

    const flightRows = [
        ["Código de vuelo",    flightCode||"—"],
        ["Ruta",               `${origin} → ${destination}`],
        ["Salida",             `${departureDate}${departureTime?` · ${departureTime}`:""}`],
        ["FBO salida",         departureFboName||"—"],
        ["FBO llegada",        arrivalFboName||"—"],
        ["Pasajeros vendidos", String(seatsRequested)],
    ];
    const buyerRows = [
        ["Titular",  contactFullName||"—"],
        ["Correo",   contactEmail||"—"],
        ["Teléfono", contactPhone||"—"],
    ];
    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
<td width="50%" style="vertical-align:top;padding-right:7px">${card(sectionH2("Detalle del vuelo")+kvTable(flightRows))}</td>
<td width="50%" style="vertical-align:top;padding-left:7px">${card(sectionH2("Contacto del comprador")+kvTable(buyerRows))}</td>
</tr></table>`;

    let passengersSection = "";
    if (passengers.length > 0) {
        const paxRows = passengers.map((p, i) => `
<tr style="background:${i%2===0?CARD:BG}">
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${i+1}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${p.full_name||"—"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.is_minor?"Menor":"Adulto"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${genderLabel(p.gender)}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${calcAge(p.date_of_birth)} años</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.document_type||"—"}</td>
</tr>`).join("");
        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Pasajeros de esta reserva")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;overflow:hidden">
<tr style="background:#fcfaf7">
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">#</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Nombre</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Tipo</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Género</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Edad</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">Doc.</th>
</tr>${paxRows}
</table>
</td></tr>
</table>`;
    }

    const payoutBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Tu pago estimado")}
<div style="font-size:28px;font-weight:700;color:${INK}">${fmtMXN(amountOwnerNet)} <span style="font-size:13px;font-weight:400;color:${MUTED}">MXN</span></div>
<div style="font-size:11px;color:${MUTED};margin-top:8px;line-height:1.5">Monto neto después de la comisión de Mobius Fly. El pago será transferido según los términos acordados.</div>
</td></tr>
</table>`;

    const manifestNote = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${ASOFT};border:1px solid #ddd0bb;border-radius:12px;padding:14px 16px;color:${INK};font-size:11px;line-height:1.6">
<strong>Manifiesto de pasajeros adjunto.</strong> Se adjunta el manifiesto operativo completo del vuelo en formato PDF para tu revisión y respaldo documental.
</td></tr>
</table>`;

    const heroCard = card(`
${eyebrow("Documento operativo")}
<h1 style="margin:4px 0 8px;font-size:22px;line-height:1.05;color:${INK}">Nueva reserva confirmada en tu vuelo</h1>
<div style="color:${MUTED};font-size:13px;line-height:1.5">Se ha realizado y confirmado un pago para el vuelo <strong>${flightCode}</strong>. Revisa los detalles y el manifiesto adjunto.</div>
<div style="margin-top:14px">${statusBadge("Pago confirmado")}</div>
`);

    return emailWrap(brand() + heroCard + routeBox + twoCol + passengersSection + payoutBox + manifestNote);
}

function buildMobiusInternalEmail(opts) {
    const { bookingReference, origin, destination, departureDate, departureTime,
            flightCode, purchaseType, seatsRequested, passengers,
            contactFullName, contactEmail, contactPhone,
            amountTotalPaid, amountOwnerNet, amountMobiusTotal,
            departureFboName, arrivalFboName } = opts;
    const depIata = iata(origin), arrIata = iata(destination);

    const flightRows = [
        ["Referencia",      bookingReference],
        ["Código de vuelo", flightCode||"—"],
        ["Ruta",            `${origin} → ${destination}`],
        ["Salida",          `${departureDate}${departureTime?` · ${departureTime}`:""}`],
        ["FBO salida",      departureFboName||"—"],
        ["FBO llegada",     arrivalFboName||"—"],
        ["Tipo de compra",  purchaseTypeLabel(purchaseType, seatsRequested)],
    ];
    const contactRows = [
        ["Nombre",   contactFullName||"—"],
        ["Correo",   contactEmail||"—"],
        ["Teléfono", contactPhone||"—"],
    ];
    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
<td width="50%" style="vertical-align:top;padding-right:7px">${card(sectionH2("Detalle del vuelo")+kvTable(flightRows))}</td>
<td width="50%" style="vertical-align:top;padding-left:7px">${card(sectionH2("Comprador")+kvTable(contactRows))}</td>
</tr></table>`;

    let passengersSection = "";
    if (passengers.length > 0) {
        const paxRows = passengers.map((p, i) => `
<tr style="background:${i%2===0?CARD:BG}">
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${i+1}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${p.full_name||"—"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.is_minor?"Menor":"Adulto"}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${genderLabel(p.gender)}</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${calcAge(p.date_of_birth)} años</td>
<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.document_type||"—"}</td>
</tr>`).join("");
        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Pasajeros")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;overflow:hidden">
<tr style="background:#fcfaf7">
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">#</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">Nombre</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">Tipo</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">Género</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">Edad</th>
<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;font-size:9px;border-bottom:1px solid ${LINE}">Doc.</th>
</tr>${paxRows}
</table>
</td></tr>
</table>`;
    }

    const paymentBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${INK};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
<div style="font-size:13px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">Desglose de pago</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="color:rgba(255,255,255,0.65);font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1)">Total cobrado al pasajero</td>
<td style="color:#fff;font-size:12px;font-weight:700;text-align:right;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1)">$${fmtMXN(amountTotalPaid)} MXN</td>
</tr>
<tr>
<td style="color:rgba(255,255,255,0.65);font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1)">Pago neto al operador</td>
<td style="color:#fff;font-size:12px;font-weight:700;text-align:right;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1)">$${fmtMXN(amountOwnerNet)} MXN</td>
</tr>
<tr>
<td style="color:${ACCENT};font-size:13px;font-weight:700;padding:8px 0 4px">Ganancia Mobius Fly</td>
<td style="color:${ACCENT};font-size:13px;font-weight:700;text-align:right;padding:8px 0 4px">$${fmtMXN(amountMobiusTotal)} MXN</td>
</tr>
</table>
</td></tr>
</table>`;

    const heroCard = card(`
${eyebrow("Notificación interna")}
<h1 style="margin:4px 0 8px;font-size:20px;color:${INK}">[Reserva confirmada] ${bookingReference}</h1>
<div style="color:${MUTED};font-size:13px">${depIata} → ${arrIata} · ${departureDate}</div>
`);

    return emailWrap(brand() + heroCard + twoCol + passengersSection + paymentBox);
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_PASSENGERS = [
    { full_name: "Eduardo Martínez López", date_of_birth: "2000-05-17", gender: "MALE",   is_minor: false, document_type: "Pasaporte" },
    { full_name: "Sofía Ramírez Torres",   date_of_birth: "1995-11-03", gender: "FEMALE", is_minor: false, document_type: "INE" },
    { full_name: "Lucas Martínez Gómez",   date_of_birth: "2015-08-22", gender: "MALE",   is_minor: true,  document_type: "Pasaporte" },
];

const SHARED_OPTS = {
    bookingReference:  "MBX-24A91",
    origin:            "Monterrey (MTY)",
    destination:       "Cancún (CUN)",
    originAirportName: "Aeropuerto Internacional de Monterrey",
    departureFboName:  "FBO Monterrey Norte",
    arrivalFboName:    "FBO Cancún Ejecutivo",
    departureDate:     "25/05/2026",
    departureTime:     "09:15",
    flightCode:        "VLO-88421",
    purchaseType:      "seats",
    seatsRequested:    3,
    passengers:        SAMPLE_PASSENGERS,
    contactFullName:   "Eduardo Martínez López",
    contactEmail:      "eduardo@email.com",
    contactPhone:      "+52 81 1234 5678",
    amountTotalPaid:   28500,
    amountOwnerNet:    27075,
    amountMobiusTotal: 1425,
};

// ─── Send ─────────────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

async function send(label, subject, html) {
    const { data, error } = await resend.emails.send({ from: FROM, to: TO, subject, html });
    if (error) {
        console.error(`✗ ${label}:`, error.message ?? error);
    } else {
        console.log(`✓ ${label} → ${TO}  (id: ${data.id})`);
    }
}

console.log(`\nSending email previews to ${TO}...\n`);

await send(
    "Buyer confirmation",
    `[PREVIEW] Reserva confirmada — MBX-24A91 | Mobius Fly`,
    buildBuyerConfirmationEmail({
        contactName:      SHARED_OPTS.contactFullName,
        contactEmail:     SHARED_OPTS.contactEmail,
        contactPhone:     SHARED_OPTS.contactPhone,
        bookingReference: SHARED_OPTS.bookingReference,
        origin:           SHARED_OPTS.origin,
        destination:      SHARED_OPTS.destination,
        departureDate:    SHARED_OPTS.departureDate,
        departureTime:    SHARED_OPTS.departureTime,
        flightCode:       SHARED_OPTS.flightCode,
        departureFboName: SHARED_OPTS.departureFboName,
        seatsRequested:   SHARED_OPTS.seatsRequested,
        purchaseType:     SHARED_OPTS.purchaseType,
        passengers:       SHARED_OPTS.passengers,
        amountTotalPaid:  SHARED_OPTS.amountTotalPaid,
    }),
);

await send(
    "Owner notification",
    `[PREVIEW] Nueva reserva MBX-24A91 en tu vuelo VLO-88421 | Mobius Fly`,
    buildOwnerNotificationEmail(SHARED_OPTS),
);

await send(
    "Mobius internal",
    `[PREVIEW] [Reserva confirmada] MBX-24A91 — MTY → CUN`,
    buildMobiusInternalEmail(SHARED_OPTS),
);

console.log("\nDone.\n");
