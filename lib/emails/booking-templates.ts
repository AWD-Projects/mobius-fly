// ─── Shared booking email templates ──────────────────────────────────────────
// Buyer confirmation, owner notification and internal notification emails,
// built on top of the shared Mobius Fly brand kit (lib/emails/brand-kit.ts).

import {
    COLORS,
    RADIUS,
    FONT_FAMILY,
    renderEmailShell,
    renderEmailHeader,
    renderEmailFooter,
    renderCard,
    renderSectionTitle,
    renderLabel,
    renderKvTable,
    renderBadge,
    renderButton,
} from "@/lib/emails/brand-kit";

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

    // ── Hero ───────────────────────────────────────────────────────────────────
    const hero = renderCard(`
${renderLabel("Reserva confirmada")}
<h1 style="margin:4px 0 8px;font-size:24px;line-height:1.15;color:${COLORS.ink};font-family:${FONT_FAMILY}">Tu vuelo está listo</h1>
<div style="color:${COLORS.muted};font-size:13px;line-height:1.5">Tu lugar ha sido reservado exitosamente. Aquí están los detalles más importantes de tu experiencia.</div>
<div style="margin-top:14px">${renderBadge("Pagado y confirmado", "success")}</div>
`);

    // ── Route box — the one place a gold accent earns its keep ──────────────────
    const routeBox = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.xl}px;margin:12px 0 14px">
<tr><td style="padding:20px">
<div style="font-size:28px;font-weight:700;letter-spacing:-0.03em;color:${COLORS.ink};margin-bottom:10px">${depIata} <span style="color:${COLORS.gold}">&nbsp;→&nbsp;</span> ${arrIata}</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="25%" style="vertical-align:top;padding-right:8px">
${renderLabel("Tipo de vuelo")}
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${COLORS.ink}">${flightType === "ROUND_TRIP" ? "Vuelo redondo" : flightType === "ONE_WAY" ? "Vuelo sencillo" : purchaseTypeLabel(purchaseType, seatsRequested)}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
${renderLabel("Salida")}
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${COLORS.ink}">${departureDate}${departureTime ? ` · ${departureTime}` : ""}</div>
</td>
<td width="25%" style="vertical-align:top;padding-right:8px">
${renderLabel("Llegada estimada")}
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${COLORS.ink}">${arrivalTime || "—"}</div>
</td>
<td width="25%" style="vertical-align:top">
${renderLabel("Código de reserva")}
<div style="font-size:12px;font-weight:700;margin-top:3px;color:${COLORS.ink}">${bookingReference}</div>
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
${renderCard(renderSectionTitle("Detalles de la reserva") + renderKvTable(bookingRows))}
</td>
<td width="50%" style="vertical-align:top;padding-left:7px">
${renderCard(renderSectionTitle("Información del vuelo") + renderKvTable(flightRows))}
</td>
</tr>
</table>`;

    // ── Passengers table ──────────────────────────────────────────────────────
    let passengersSection = "";
    if (passengers.length > 0) {
        const th = (t: string) =>
            `<th style="padding:9px 8px;color:${COLORS.muted};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${COLORS.border}">${t}</th>`;
        const tdB = (t: string) =>
            `<td style="padding:9px 8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.ink};font-size:11px">${t}</td>`;
        const tdM = (t: string) =>
            `<td style="padding:9px 8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:11px">${t}</td>`;

        const paxRows = passengers.map((p, i) => `
<tr style="background:${i % 2 === 0 ? COLORS.card : COLORS.background}">
${tdB(String(i + 1))}
${tdB(p.full_name || "—")}
${tdM(fmtDob(p.date_of_birth))}
${tdM(genderLabel(p.gender))}
${tdM(p.nationality || "—")}
${tdM(p.document_type || "—")}
${tdM(p.document_number || "—")}
</tr>`).join("");

        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.lg}px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${renderSectionTitle("Pasajeros")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLORS.border};border-radius:${RADIUS.sm}px;overflow:hidden;font-size:11px">
<tr style="background:${COLORS.background}">
${th("#")}${th("Nombre completo")}${th("Fecha nac.")}${th("Sexo")}${th("Nacionalidad")}${th("Documento")}${th("Nº doc.")}
</tr>
${paxRows}
</table>
</td></tr>
</table>`;
    }

    // ── "Qué sigue" steps — numbered in ink, not gold, to avoid repeating the accent ──
    const stepCircle = (n: string) =>
        `<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:${COLORS.ink};color:#fff;font-weight:700;font-size:11px;margin-bottom:6px">${n}</span>`;

    const steps = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.lg}px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${renderSectionTitle("Qué sigue")}
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="33%" style="vertical-align:top;padding-right:10px">
${stepCircle("1")}
<div style="font-weight:700;font-size:12px;color:${COLORS.ink};margin-bottom:4px">Validación final de pasajeros</div>
<div style="font-size:11px;color:${COLORS.muted};line-height:1.5">Si se requiere documentación adicional o validación complementaria, te contactaremos por correo o teléfono.</div>
</td>
<td width="33%" style="vertical-align:top;padding-right:10px">
${stepCircle("2")}
<div style="font-weight:700;font-size:12px;color:${COLORS.ink};margin-bottom:4px">Información previa al embarque</div>
<div style="font-size:11px;color:${COLORS.muted};line-height:1.5">Antes de tu salida recibirás el punto de encuentro, hora recomendada de llegada y cualquier instrucción operativa relevante.</div>
</td>
<td width="33%" style="vertical-align:top">
${stepCircle("3")}
<div style="font-weight:700;font-size:12px;color:${COLORS.ink};margin-bottom:4px">Experiencia Mobius Fly</div>
<div style="font-size:11px;color:${COLORS.muted};line-height:1.5">Nuestro equipo y el operador verificarán que todo esté listo para tu vuelo en condiciones de seguridad y cumplimiento.</div>
</td>
</tr>
</table>
</td></tr>
</table>`;

    // ── Legal note ────────────────────────────────────────────────────────────
    const note = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.sm}px;padding:14px 16px;color:${COLORS.muted};font-size:10.5px;line-height:1.6">
La reserva está sujeta a validación operativa final, disponibilidad efectiva de la aeronave, condiciones de seguridad y cumplimiento regulatorio. En caso de ajustes necesarios, Mobius Fly notificará oportunamente al titular de la reserva conforme a los términos aplicables.
</td></tr>
</table>`;

    // ── Action buttons — gold reserved for the single primary CTA ───────────────
    const actions = `
<table cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr>
<td style="padding-right:8px">${renderButton("Ver mi reserva", `${appUrl}/my-trips`, "primary")}</td>
<td>${renderButton("Contactar soporte", `${appUrl}/contact`, "secondary")}</td>
</tr>
</table>`;

    return renderEmailShell(
        "Mobius Fly — Reserva confirmada",
        renderEmailHeader("Confirmación de reserva") + hero + routeBox + twoCol + passengersSection + steps + note + actions + renderEmailFooter(),
    );
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

    const hero = renderCard(`
${renderLabel("Documento operativo")}
<h1 style="margin:4px 0 6px;font-size:19px;line-height:1.2;color:${COLORS.ink};font-family:${FONT_FAMILY}">Nueva reserva en tu vuelo ${flightCode}</h1>
<div style="color:${COLORS.muted};font-size:12px;line-height:1.5;margin-bottom:10px">${depIata} → ${arrIata} &nbsp;·&nbsp; ${departureDate}</div>
${renderBadge("Pago confirmado", "success")}
`);

    const twoCol = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 14px">
<tr>
<td width="60%" style="vertical-align:top;padding-right:7px">
${renderCard(renderSectionTitle("Detalle del vuelo") + renderKvTable(flightRows))}
</td>
<td width="40%" style="vertical-align:top;padding-left:7px">
${renderCard(`
${renderSectionTitle("Comprador")}
${renderKvTable(buyerRows)}
<div style="margin-top:16px;padding-top:14px;border-top:1px solid ${COLORS.border}">
${renderLabel("Tu pago estimado")}
<div style="font-size:22px;font-weight:700;color:${COLORS.ink}">${fmtMXN(amountOwnerNet)} <span style="font-size:11px;font-weight:400;color:${COLORS.muted}">MXN</span></div>
<div style="font-size:10px;color:${COLORS.muted};margin-top:4px">Neto tras comisión Mobius. Se transfiere según términos acordados.</div>
</div>
`)}
</td>
</tr>
</table>`;

    const manifestNote = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
<tr><td style="background:${COLORS.goldSoft};border:1px solid rgba(196,167,125,0.4);border-radius:${RADIUS.sm}px;padding:12px 16px;color:${COLORS.ink};font-size:11px;line-height:1.6">
<strong>Manifiesto de pasajeros adjunto.</strong> El manifiesto operativo completo con todos los pasajeros confirmados se incluye en PDF.
</td></tr>
</table>`;

    return renderEmailShell(
        "Mobius Fly — Nueva reserva",
        renderEmailHeader("Notificación de reserva") + hero + twoCol + manifestNote + renderEmailFooter(),
    );
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

    const hero = renderCard(`
${renderLabel("Notificación interna")}
<h1 style="margin:4px 0 6px;font-size:19px;color:${COLORS.ink};font-family:${FONT_FAMILY}">[Reserva confirmada] ${bookingReference}</h1>
<div style="color:${COLORS.muted};font-size:12px">${depIata} → ${arrIata} &nbsp;·&nbsp; ${departureDate}</div>
`);

    const infoGrid = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 14px">
<tr>
<td width="55%" style="vertical-align:top;padding-right:7px">
${renderCard(renderSectionTitle("Detalle de la reserva") + renderKvTable(reservationRows))}
</td>
<td width="45%" style="vertical-align:top;padding-left:7px">
${renderCard(renderSectionTitle("Comprador") + renderKvTable(buyerRows))}
<div style="height:10px"></div>
${renderCard(renderSectionTitle("Operador") + renderKvTable(ownerRows))}
</td>
</tr>
</table>`;

    let passengersSection = "";
    if (passengers.length > 0) {
        const paxRows = passengers.map((p, i) => `
<tr style="background:${i % 2 === 0 ? COLORS.card : COLORS.background}">
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.ink};font-size:11px">${i + 1}</td>
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.ink};font-size:11px">${p.full_name || "—"}</td>
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:11px">${p.is_minor ? "Menor" : "Adulto"}</td>
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:11px">${genderLabel(p.gender)}</td>
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:11px">${calcAge(p.date_of_birth)} años</td>
<td style="padding:8px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:11px">${p.document_type || "—"}</td>
</tr>`).join("");

        const thStyle = `style="padding:8px;color:${COLORS.muted};text-align:left;text-transform:uppercase;letter-spacing:0.04em;font-size:9px;border-bottom:1px solid ${COLORS.border}"`;
        passengersSection = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:${RADIUS.lg}px;margin-bottom:14px">
<tr><td style="padding:16px 18px">
${renderSectionTitle("Pasajeros confirmados")}
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLORS.border};border-radius:${RADIUS.sm}px;overflow:hidden">
<tr style="background:${COLORS.background}">
<th ${thStyle}>#</th><th ${thStyle}>Nombre</th><th ${thStyle}>Tipo</th>
<th ${thStyle}>Género</th><th ${thStyle}>Edad</th><th ${thStyle}>Doc.</th>
</tr>
${paxRows}
</table>
</td></tr>
</table>`;
    }

    return renderEmailShell(
        `Mobius Fly — ${bookingReference}`,
        renderEmailHeader("Notificación interna") + hero + infoGrid + passengersSection + renderEmailFooter(),
    );
}

// ─── 4. Flight cancellation email ─────────────────────────────────────────────
// Sent to each confirmed passenger when the owner cancels the flight.

export function buildFlightCancellationEmail(opts: {
    passengerName:    string;
    bookingReference?: string | null;
    flightCode?:      string | null;
    origin?:          string; // "Ciudad (IATA)"
    destination?:     string;
    departureDate?:   string;
    departureTime?:   string;
    appUrl?:          string;
}): string {
    const { passengerName, bookingReference, flightCode, origin, destination, departureDate, departureTime, appUrl = "https://mobiusfly.com" } = opts;

    const firstName = passengerName?.split(" ")[0] || "";
    const hasRoute = origin && destination;

    const routeRows: [string, string][] = [
        ...(flightCode ? [["Código de vuelo", flightCode] as [string, string]] : []),
        ...(bookingReference ? [["Código de reserva", bookingReference] as [string, string]] : []),
        ...(departureDate ? [["Fecha de salida", `${departureDate}${departureTime ? ` · ${departureTime}` : ""}`] as [string, string]] : []),
    ];

    const hero = `<div style="margin-bottom:16px">${renderCard(`
${renderLabel("Vuelo cancelado")}
<h1 style="margin:4px 0 10px;font-size:22px;line-height:1.2;color:${COLORS.ink};font-family:${FONT_FAMILY}">Hola${firstName ? `, ${firstName}` : ""}, tu vuelo ha sido cancelado</h1>
<div style="color:${COLORS.muted};font-size:13px;line-height:1.6">Lamentamos informarte que tu vuelo${hasRoute ? ` <strong style="color:${COLORS.ink}">${iata(origin!)} → ${iata(destination!)}</strong>` : ""} fue cancelado por el operador de la aeronave. Nuestro equipo se pondrá en contacto contigo a la brevedad para procesar tu reembolso o compensación correspondiente.</div>
<div style="margin-top:14px">${renderBadge("Cancelado", "error")}</div>
`)}</div>`;

    const details = routeRows.length > 0
        ? `<div style="margin-bottom:16px">${renderCard(renderSectionTitle("Detalles del vuelo") + renderKvTable(routeRows))}</div>`
        : "";

    const actions = `
<table cellpadding="0" cellspacing="0" style="margin-bottom:16px">
<tr><td>${renderButton("Contactar soporte", `${appUrl}/contact`, "primary")}</td></tr>
</table>`;

    return renderEmailShell(
        "Mobius Fly — Vuelo cancelado",
        renderEmailHeader("Cancelación de vuelo") + hero + details + actions + renderEmailFooter(),
    );
}
