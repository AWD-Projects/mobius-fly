// ─── Shared booking email templates ──────────────────────────────────────────
// Design: confirmacion.html / manifiesto.html supplied by Mobius team.

// ─── Design tokens (from Mobius email design) ─────────────────────────────────
const BG      = "#f6f4f1";
const CARD    = "#ffffff";
const INK     = "#243a57";
const MUTED   = "#7c8796";
const LINE    = "#e8e2d8";
const ACCENT  = "#c8a46a";
const ASOFT   = "#efe6d7";
const SUCCESS = "#2f6b56";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PassengerRow {
    full_name:       string;
    date_of_birth:   string | null;
    gender:          string | null;
    is_minor:        boolean;
    document_type:   string;
    document_number?: string | null;
    nationality?:    string | null;
}

export interface BookingEmailOpts {
    bookingReference:   string;
    origin:             string;   // "Ciudad (IATA)"
    destination:        string;
    originAirportName:  string;
    departureFboName:   string;
    arrivalFboName:     string | null;
    departureDate:      string;
    departureTime:      string;
    arrivalTime?:       string;   // "HH:mm"
    flightCode:         string;
    aircraftType?:      string;   // "Learjet 45"
    tailNumber?:        string;   // "XA-GBT"
    flightType?:        "ONE_WAY" | "ROUND_TRIP";
    purchaseType:       "seats" | "full_aircraft";
    seatsRequested:     number;
    passengers:         PassengerRow[];
    contactFullName:    string;
    contactEmail:       string;
    contactPhone:       string | null;
    amountTotalPaid:    number;
    amountOwnerNet:     number;
    amountMobiusTotal:  number;
    ownerFullName?:     string;
    ownerEmail?:        string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMXN(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcAge(dob: string | null): string {
    if (!dob) return "—";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return String(age);
}

function genderLabel(g: string | null): string {
    if (g === "MALE")   return "Masculino";
    if (g === "FEMALE") return "Femenino";
    if (g === "OTHER")  return "Otro";
    return "—";
}

function fmtDob(dob: string | null): string {
    if (!dob) return "—";
    // "YYYY-MM-DD" → "DD/MM/YYYY"
    const [y, m, d] = dob.split("-");
    if (!y || !m || !d) return dob;
    return `${d}/${m}/${y}`;
}

function purchaseTypeLabel(type: "seats" | "full_aircraft", seats: number): string {
    if (type === "full_aircraft") return "Aeronave completa";
    return `${seats} ${seats === 1 ? "asiento" : "asientos"}`;
}

/** Extract IATA code from "Ciudad (IATA)" string */
function iata(s: string): string {
    return s.match(/\(([A-Z]{3})\)/)?.[1] ?? s;
}

// ─── Layout primitives ────────────────────────────────────────────────────────

function emailWrap(inner: string): string {
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

function brand(): string {
    return `<table cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr>
<td style="width:32px;height:32px;border:2px solid ${INK};border-radius:8px 16px 8px 16px;text-align:center;vertical-align:middle;font-weight:800;font-size:15px;color:${INK}">M</td>
<td style="padding-left:10px;font-weight:700;font-size:17px;color:${INK}">Mobius Fly</td>
</tr>
</table>`;
}

function card(inner: string, style = ""): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;${style}">
<tr><td style="padding:16px 18px">${inner}</td></tr>
</table>`;
}

function eyebrow(text: string): string {
    return `<div style="color:${ACCENT};text-transform:uppercase;font-weight:700;letter-spacing:0.08em;font-size:10px;margin-bottom:4px">${text}</div>`;
}

function statusBadge(text: string): string {
    return `<span style="display:inline-block;padding:7px 13px;border-radius:999px;color:${SUCCESS};background:rgba(47,107,86,0.10);border:1px solid rgba(47,107,86,0.20);font-weight:700;font-size:10px">${text}</span>`;
}

function kvTable(rows: [string, string][]): string {
    const trs = rows.map(([k, v]) => `
<tr>
<td style="color:${MUTED};font-size:12px;padding:7px 0;border-bottom:1px dashed #ece6dc;width:45%">${k}</td>
<td style="color:${INK};font-size:12px;font-weight:700;text-align:right;padding:7px 0;border-bottom:1px dashed #ece6dc">${v}</td>
</tr>`).join("");
    return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${trs}</table>`;
}

function sectionH2(text: string): string {
    return `<div style="font-size:15px;font-weight:700;color:${INK};margin:0 0 12px">${text}</div>`;
}

// ─── 1. Buyer confirmation email ──────────────────────────────────────────────

export function buildBuyerConfirmationEmail(opts: {
    contactName:      string;
    contactEmail:     string;
    contactPhone:     string | null;
    bookingReference: string;
    origin:           string;
    destination:      string;
    departureDate:    string;
    departureTime:    string;
    arrivalTime?:     string;
    flightCode:       string;
    departureFboName: string;
    aircraftType?:    string;
    tailNumber?:      string;
    flightType?:      "ONE_WAY" | "ROUND_TRIP";
    seatsRequested:   number;
    purchaseType:     "seats" | "full_aircraft";
    passengers:       PassengerRow[];
    amountTotalPaid:  number;
    appUrl?:          string;
}): string {
    const {
        contactName, contactEmail, contactPhone, bookingReference,
        origin, destination, departureDate, departureTime, arrivalTime,
        flightCode, aircraftType, tailNumber, flightType,
        seatsRequested, purchaseType,
        passengers, amountTotalPaid,
        appUrl = "https://mobiusfly.com",
    } = opts;

    const depIata = iata(origin);
    const arrIata = iata(destination);
    const issuedAt = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }) +
                     " · " + new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });

    // ── Hero section (2-col) ──────────────────────────────────────────────────
    const heroCard = `
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<!-- Hero card (62%) -->
<td width="62%" style="vertical-align:top;padding-right:12px">
${card(`
${eyebrow("Reserva confirmada")}
<h1 style="margin:4px 0 8px;font-size:26px;line-height:1.05;color:${INK}">Tu vuelo está listo</h1>
<div style="color:${MUTED};font-size:13px;line-height:1.5">Tu lugar ha sido reservado exitosamente. Aquí están los detalles más importantes de tu experiencia.</div>
<div style="margin-top:14px">${statusBadge("Pagado y confirmado")}</div>
`)}
</td>
<!-- Image card (38%) -->
<td width="38%" style="vertical-align:top">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#c8b28e 0%,#f0ece4 45%,#d7dfe8 100%);border:1px solid ${LINE};border-radius:16px;height:170px">
<tr><td style="padding:16px;vertical-align:bottom">
<span style="color:#fff;background:rgba(36,58,87,0.45);padding:7px 11px;border-radius:999px;font-size:10px">Private aviation experience</span>
</td></tr>
</table>
</td>
</tr>
</table>`;

    // ── Route box ─────────────────────────────────────────────────────────────
    const routeBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:18px;margin:12px 0 14px">
<tr><td style="padding:20px">
<div style="font-size:30px;font-weight:700;letter-spacing:-0.04em;color:${ACCENT};margin-bottom:10px">${depIata} &nbsp;→&nbsp; ${arrIata}</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Tipo de vuelo</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${flightType === "ROUND_TRIP" ? "Vuelo redondo" : flightType === "ONE_WAY" ? "Vuelo sencillo" : purchaseTypeLabel(purchaseType, seatsRequested)}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Salida</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${departureDate}${departureTime ? ` · ${departureTime}` : ""}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Llegada estimada</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${arrivalTime || "—"}</div>
</td>
<td width="25%" style="vertical-align:top">
<div style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:0.05em">Código de reserva</div>
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${INK}">${bookingReference}</div>
</td>
</tr>
</table>
</td></tr>
</table>`;

    // ── Two-col: booking details + flight info ────────────────────────────────
    const bookingRows: [string, string][] = [
        ["Titular",        contactName   || "—"],
        ["Correo",         contactEmail  || "—"],
        ["Teléfono",       contactPhone  || "—"],
        ["Pasajeros",      String(seatsRequested)],
        ["Método de pago", "Tarjeta de crédito / débito"],
        ["Monto pagado",   `$${fmtMXN(amountTotalPaid)} MXN`],
    ];

    const flightRows: [string, string][] = [
        ["Origen",        origin],
        ["Destino",       destination],
        ["Aeronave",      aircraftType || "—"],
        ["Matrícula",     tailNumber   || "—"],
        ["Código de vuelo", flightCode || "—"],
        ["Emisión",       issuedAt],
    ];

    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr>
<td width="50%" style="vertical-align:top;padding-right:7px">
${card(sectionH2("Detalles de la reserva") + kvTable(bookingRows))}
</td>
<td width="50%" style="vertical-align:top;padding-left:7px">
${card(sectionH2("Información del vuelo") + kvTable(flightRows))}
</td>
</tr>
</table>`;

    // ── Passengers table ──────────────────────────────────────────────────────
    let passengersSection = "";
    if (passengers.length > 0) {
        const th = (t: string) =>
            `<th style="padding:9px 8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}">${t}</th>`;
        const tdB = (t: string) =>
            `<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${t}</td>`;
        const tdM = (t: string) =>
            `<td style="padding:9px 8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${t}</td>`;

        const paxRows = passengers.map((p, i) => `
<tr style="background:${i % 2 === 0 ? CARD : BG}">
${tdB(String(i + 1))}
${tdB(p.full_name || "—")}
${tdM(fmtDob(p.date_of_birth))}
${tdM(genderLabel(p.gender))}
${tdM(p.nationality || "—")}
${tdM(p.document_type || "—")}
${tdM(p.document_number || "—")}
</tr>`).join("");

        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Pasajeros")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;overflow:hidden;font-size:11px">
<tr style="background:#fcfaf7">
${th("#")}${th("Nombre completo")}${th("Fecha nac.")}${th("Sexo")}${th("Nacionalidad")}${th("Documento")}${th("Nº doc.")}
</tr>
${paxRows}
</table>
</td></tr>
</table>`;
    }

    // ── "Qué sigue" steps ────────────────────────────────────────────────────
    const steps = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Qué sigue")}
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
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
</tr>
</table>
</td></tr>
</table>`;

    // ── Legal note ────────────────────────────────────────────────────────────
    const note = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:12px;padding:14px 16px;color:${MUTED};font-size:10.5px;line-height:1.6">
La reserva está sujeta a validación operativa final, disponibilidad efectiva de la aeronave, condiciones de seguridad y cumplimiento regulatorio. En caso de ajustes necesarios, Mobius Fly notificará oportunamente al titular de la reserva conforme a los términos aplicables.
</td></tr>
</table>`;

    // ── Action buttons ────────────────────────────────────────────────────────
    const actions = `
<table cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr>
<td><a href="${appUrl}/my-trips" style="display:inline-block;padding:10px 16px;border-radius:12px;background:${ACCENT};color:#fff;font-weight:700;font-size:11px;text-decoration:none;margin-right:8px">Ver mi reserva</a></td>
<td><a href="mailto:soporte@mobiusfly.com" style="display:inline-block;padding:10px 16px;border-radius:12px;border:1px solid ${LINE};color:${INK};font-weight:700;font-size:11px;text-decoration:none;background:${CARD}">Contactar soporte</a></td>
</tr>
</table>`;

    return emailWrap(brand() + heroCard + routeBox + twoCol + passengersSection + steps + note + actions);
}

// ─── 2. Owner notification email ──────────────────────────────────────────────
// Sent to the flight owner. The full manifest PDF is attached separately.

export function buildOwnerNotificationEmail(opts: BookingEmailOpts): string {
    const {
        bookingReference, origin, destination, departureDate, departureTime, arrivalTime,
        flightCode, aircraftType, tailNumber, purchaseType, seatsRequested,
        contactFullName, contactEmail, contactPhone,
        amountOwnerNet, departureFboName, arrivalFboName,
    } = opts;

    const depIata = iata(origin);
    const arrIata = iata(destination);

    const flightRows: [string, string][] = [
        ["Código de vuelo",    flightCode || "—"],
        ["Ruta",               `${depIata} → ${arrIata}`],
        ["Fecha de salida",    departureDate || "—"],
        ["Hora de salida",     departureTime || "—"],
        ["Llegada estimada",   arrivalTime   || "—"],
        ["Aeronave",           aircraftType  ? (tailNumber ? `${aircraftType} · ${tailNumber}` : aircraftType) : "—"],
        ["FBO de salida",      departureFboName || "—"],
        ["FBO de llegada",     arrivalFboName   || "—"],
        ["Tipo de venta",      purchaseTypeLabel(purchaseType, seatsRequested)],
        ["Código de reserva",  bookingReference],
    ];

    const buyerRows: [string, string][] = [
        ["Titular",    contactFullName || "—"],
        ["Correo",     contactEmail    || "—"],
        ["Teléfono",   contactPhone    || "—"],
    ];

    const heroCard = card(`
${eyebrow("Documento operativo")}
<h1 style="margin:4px 0 6px;font-size:20px;line-height:1.1;color:${INK}">Nueva reserva en tu vuelo ${flightCode}</h1>
<div style="color:${MUTED};font-size:12px;line-height:1.5;margin-bottom:10px">${depIata} → ${arrIata} &nbsp;·&nbsp; ${departureDate}</div>
${statusBadge("Pago confirmado")}
`);

    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 14px">
<tr>
<td width="60%" style="vertical-align:top;padding-right:7px">
${card(sectionH2("Detalle del vuelo") + kvTable(flightRows))}
</td>
<td width="40%" style="vertical-align:top;padding-left:7px">
${card(`
${sectionH2("Comprador")}
${kvTable(buyerRows)}
<div style="margin-top:16px;padding-top:14px;border-top:1px solid ${LINE}">
<div style="color:${MUTED};font-size:10px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Tu pago estimado</div>
<div style="font-size:24px;font-weight:700;color:${INK}">${fmtMXN(amountOwnerNet)} <span style="font-size:11px;font-weight:400;color:${MUTED}">MXN</span></div>
<div style="font-size:10px;color:${MUTED};margin-top:4px">Neto tras comisión Mobius. Se transfiere según términos acordados.</div>
</div>
`)}
</td>
</tr>
</table>`;

    const manifestNote = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${ASOFT};border:1px solid #ddd0bb;border-radius:12px;padding:12px 16px;color:${INK};font-size:11px;line-height:1.6">
<strong>Manifiesto de pasajeros adjunto.</strong> El manifiesto operativo completo con todos los pasajeros confirmados se incluye en PDF.
</td></tr>
</table>`;

    return emailWrap(brand() + heroCard + twoCol + manifestNote);
}

// ─── 3. Mobius internal notification email ────────────────────────────────────

export function buildMobiusInternalEmail(opts: BookingEmailOpts): string {
    const {
        bookingReference, origin, destination, departureDate, departureTime, arrivalTime,
        flightCode, aircraftType, tailNumber, purchaseType, seatsRequested, passengers,
        contactFullName, contactEmail, contactPhone,
        amountTotalPaid, amountOwnerNet, amountMobiusTotal,
        departureFboName, arrivalFboName,
        ownerFullName, ownerEmail,
    } = opts;

    const depIata = iata(origin);
    const arrIata = iata(destination);

    const reservationRows: [string, string][] = [
        ["Código de reserva",  bookingReference],
        ["Código de vuelo",    flightCode || "—"],
        ["Ruta",               `${depIata} → ${arrIata}`],
        ["Fecha de salida",    departureDate || "—"],
        ["Hora de salida",     departureTime || "—"],
        ["Llegada estimada",   arrivalTime   || "—"],
        ["Aeronave",           aircraftType  ? (tailNumber ? `${aircraftType} · ${tailNumber}` : aircraftType) : "—"],
        ["FBO salida",         departureFboName || "—"],
        ["FBO llegada",        arrivalFboName   || "—"],
        ["Tipo de compra",     purchaseTypeLabel(purchaseType, seatsRequested)],
        ["Pasajeros",          String(seatsRequested)],
    ];

    const buyerRows: [string, string][] = [
        ["Titular",    contactFullName || "—"],
        ["Correo",     contactEmail    || "—"],
        ["Teléfono",   contactPhone    || "—"],
    ];

    const ownerRows: [string, string][] = [
        ["Operador",           ownerFullName  || "—"],
        ["Email del operador", ownerEmail     || "—"],
        ["Pago al operador",   `$${fmtMXN(amountOwnerNet)} MXN`],
        ["Comisión Mobius",    `$${fmtMXN(amountMobiusTotal)} MXN`],
        ["Total cobrado",      `$${fmtMXN(amountTotalPaid)} MXN`],
    ];

    const heroCard = card(`
${eyebrow("Notificación interna")}
<h1 style="margin:4px 0 6px;font-size:20px;color:${INK}">[Reserva confirmada] ${bookingReference}</h1>
<div style="color:${MUTED};font-size:12px">${depIata} → ${arrIata} &nbsp;·&nbsp; ${departureDate}</div>
`);

    const infoGrid = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 14px">
<tr>
<td width="55%" style="vertical-align:top;padding-right:7px">
${card(sectionH2("Detalle de la reserva") + kvTable(reservationRows))}
</td>
<td width="45%" style="vertical-align:top;padding-left:7px">
${card(sectionH2("Comprador") + kvTable(buyerRows))}
<div style="height:10px"></div>
${card(sectionH2("Operador") + kvTable(ownerRows))}
</td>
</tr>
</table>`;

    let passengersSection = "";
    if (passengers.length > 0) {
        const paxRows = passengers.map((p, i) => `
<tr style="background:${i % 2 === 0 ? CARD : BG}">
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${i + 1}</td>
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${INK};font-size:11px">${p.full_name || "—"}</td>
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.is_minor ? "Menor" : "Adulto"}</td>
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${genderLabel(p.gender)}</td>
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${calcAge(p.date_of_birth)} años</td>
<td style="padding:8px;border-bottom:1px solid #f0ebe2;color:${MUTED};font-size:11px">${p.document_type || "—"}</td>
</tr>`).join("");

        const thStyle = `style="padding:8px;color:${MUTED};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${LINE}"`;
        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${sectionH2("Pasajeros confirmados")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;overflow:hidden">
<tr style="background:#fcfaf7">
<th ${thStyle}>#</th><th ${thStyle}>Nombre</th><th ${thStyle}>Tipo</th>
<th ${thStyle}>Género</th><th ${thStyle}>Edad</th><th ${thStyle}>Doc.</th>
</tr>
${paxRows}
</table>
</td></tr>
</table>`;
    }

    return emailWrap(brand() + heroCard + infoGrid + passengersSection);
}
