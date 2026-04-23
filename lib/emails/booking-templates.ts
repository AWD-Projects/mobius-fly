// ─── Shared booking email templates ──────────────────────────────────────────
// Used by confirm.ts and confirmIntent.ts after a payment is confirmed.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PassengerRow {
    full_name:     string;
    date_of_birth: string | null;
    gender:        string | null;
    is_minor:      boolean;
    document_type: string;
}

export interface BookingEmailOpts {
    bookingReference:   string;
    origin:             string;
    destination:        string;
    originAirportName:  string;
    departureFboName:   string;
    arrivalFboName:     string | null;
    departureDate:      string;
    departureTime:      string;
    flightCode:         string;
    purchaseType:       "seats" | "full_aircraft";
    seatsRequested:     number;
    passengers:         PassengerRow[];
    contactFullName:    string;
    contactEmail:       string;
    contactPhone:       string | null;
    amountTotalPaid:    number;
    amountOwnerNet:     number;
    amountMobiusTotal:  number;
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
    return `${age} años`;
}

function genderLabel(g: string | null): string {
    if (g === "MALE")   return "Masculino";
    if (g === "FEMALE") return "Femenino";
    if (g === "OTHER")  return "Otro";
    return "—";
}

function purchaseTypeLabel(type: "seats" | "full_aircraft", seats: number): string {
    if (type === "full_aircraft") return "Aeronave completa";
    return `${seats} asiento${seats !== 1 ? "s" : ""}`;
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function emailOpen(): string {
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F6F4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F6F4;padding:40px 0">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden">
        <tr>
          <td style="background:#39424E;padding:32px 40px">
            <p style="margin:0;color:#C4A77D;font-size:22px;font-weight:bold;letter-spacing:1px">MOBIUS FLY</p>
          </td>
        </tr>
        <tr><td style="padding:40px">`;
}

function emailClose(): string {
    return `
        </td></tr>
        <tr>
          <td style="background:#39424E;padding:24px 40px;text-align:center">
            <p style="margin:0;color:#aaa;font-size:12px">© ${new Date().getFullYear()} Mobius Fly. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function sectionTable(title: string, rows: [label: string, value: string][]): string {
    const rowsHtml = rows
        .map(([label, value]) => `
            <tr>
              <td style="color:#666;font-size:14px;padding:5px 0;vertical-align:top">${label}</td>
              <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right;padding:5px 0 5px 16px">${value}</td>
            </tr>`)
        .join("");
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-bottom:24px">
      <tr style="background:#f9f9f9">
        <td colspan="2" style="padding:12px 20px;color:#666;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">${title}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:16px 20px;border-top:1px solid #e5e5e5">
          <table width="100%">${rowsHtml}
          </table>
        </td>
      </tr>
    </table>`;
}

function passengerManifestTable(passengers: PassengerRow[]): string {
    if (!passengers.length) return "";
    const headerCells = ["Nombre completo", "Tipo", "Género", "Edad", "Doc."]
        .map(h => `<th style="padding:9px 14px;color:#666;font-size:12px;font-weight:bold;text-align:left;border-top:1px solid #e5e5e5;white-space:nowrap">${h}</th>`)
        .join("");
    const rows = passengers
        .map((p, i) => {
            const bg = i % 2 === 0 ? "#ffffff" : "#f9f9f9";
            return `
        <tr style="background:${bg}">
          <td style="padding:9px 14px;border-top:1px solid #e5e5e5;color:#39424E;font-size:13px">${p.full_name}</td>
          <td style="padding:9px 14px;border-top:1px solid #e5e5e5;color:#666;font-size:13px;white-space:nowrap">${p.is_minor ? "Menor" : "Adulto"}</td>
          <td style="padding:9px 14px;border-top:1px solid #e5e5e5;color:#666;font-size:13px;white-space:nowrap">${genderLabel(p.gender)}</td>
          <td style="padding:9px 14px;border-top:1px solid #e5e5e5;color:#666;font-size:13px;white-space:nowrap">${calcAge(p.date_of_birth)}</td>
          <td style="padding:9px 14px;border-top:1px solid #e5e5e5;color:#666;font-size:13px;white-space:nowrap">${p.document_type}</td>
        </tr>`;
        })
        .join("");
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-bottom:24px">
      <tr style="background:#f9f9f9">
        <td colspan="5" style="padding:12px 16px;color:#666;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Manifiesto de pasajeros</td>
      </tr>
      <tr style="background:#f0f0f0">
        ${headerCells}
      </tr>
      ${rows}
    </table>`;
}

// ─── 1. Buyer confirmation email ──────────────────────────────────────────────
// Sent to the person who made the purchase.

export function buildBuyerConfirmationEmail(opts: {
    contactName:      string;
    bookingReference: string;
    origin:           string;
    destination:      string;
    departureDate:    string;
    departureTime:    string;
    flightCode:       string;
    departureFboName: string;
    seatsRequested:   number;
    purchaseType:     "seats" | "full_aircraft";
}): string {
    const {
        contactName, bookingReference, origin, destination,
        departureDate, departureTime, flightCode, departureFboName,
        seatsRequested, purchaseType,
    } = opts;

    const flightRows: [string, string][] = [
        ["Código de vuelo", flightCode],
        ["Ruta",            `${origin} → ${destination}`],
        ["Salida",          `${departureDate}${departureTime ? `, ${departureTime}` : ""}`],
        ["FBO de salida",   departureFboName || "—"],
        ["Tipo de compra",  purchaseTypeLabel(purchaseType, seatsRequested)],
    ];

    return `${emailOpen()}
    <p style="color:#39424E;font-size:16px;margin:0 0 16px">Hola, <strong>${contactName}</strong></p>
    <p style="color:#39424E;font-size:16px;margin:0 0 32px">
      Tu reserva ha sido confirmada. ¡Te esperamos a bordo!
    </p>
    <div style="background:#F6F6F4;border-radius:8px;padding:20px 24px;margin-bottom:32px;text-align:center">
      <p style="margin:0 0 4px;color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase">Referencia de reserva</p>
      <p style="margin:0;color:#39424E;font-size:28px;font-weight:bold;letter-spacing:3px">${bookingReference}</p>
    </div>
    ${sectionTable("Detalle del vuelo", flightRows)}
    <p style="color:#666;font-size:13px;margin:0 0 8px;line-height:1.6">
      <strong style="color:#39424E">Recuerda:</strong> Presenta una identificación oficial vigente al momento de abordar.
      Llega con al menos 30 minutos de anticipación al FBO indicado.
    </p>
    <p style="color:#666;font-size:13px;margin:0;line-height:1.6">
      Para cualquier duda escríbenos a <a href="mailto:contacto@mobiusfly.com" style="color:#C4A77D">contacto@mobiusfly.com</a>
    </p>
${emailClose()}`;
}

// ─── 2. Owner notification email ──────────────────────────────────────────────
// Sent to the flight owner when a new reservation is confirmed on their flight.

export function buildOwnerNotificationEmail(opts: BookingEmailOpts): string {
    const {
        bookingReference, origin, destination, departureDate, departureTime,
        flightCode, purchaseType, seatsRequested, passengers,
        contactFullName, contactEmail, contactPhone,
        amountOwnerNet, departureFboName,
    } = opts;

    const flightRows: [string, string][] = [
        ["Referencia",      bookingReference],
        ["Código de vuelo", flightCode],
        ["Ruta",            `${origin} → ${destination}`],
        ["Salida",          `${departureDate}${departureTime ? `, ${departureTime}` : ""}`],
        ["FBO de salida",   departureFboName || "—"],
        ["Tipo de compra",  purchaseTypeLabel(purchaseType, seatsRequested)],
    ];

    const contactRows: [string, string][] = [
        ["Nombre",  contactFullName],
        ["Correo",  `<a href="mailto:${encodeURIComponent(contactEmail)}" style="color:#C4A77D">${contactEmail}</a>`],
    ];
    if (contactPhone) contactRows.push(["Teléfono", contactPhone]);

    return `${emailOpen()}
    <p style="color:#39424E;font-size:18px;font-weight:bold;margin:0 0 8px">Nueva reserva confirmada en tu vuelo</p>
    <p style="color:#666;font-size:14px;margin:0 0 32px;line-height:1.6">
      Se ha realizado y confirmado un pago para tu vuelo <strong>${flightCode}</strong>.
      A continuación encontrarás el detalle de la reserva y el manifiesto de pasajeros.
    </p>

    ${sectionTable("Detalle del vuelo", flightRows)}
    ${passengerManifestTable(passengers)}
    ${sectionTable("Contacto del comprador", contactRows)}

    <div style="background:#F6F6F4;border-radius:8px;padding:20px 24px;margin-bottom:24px">
      <p style="margin:0 0 6px;color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase">Tu pago estimado</p>
      <p style="margin:0;color:#39424E;font-size:28px;font-weight:bold">
        $${fmtMXN(amountOwnerNet)}
        <span style="font-size:14px;font-weight:normal;color:#666">MXN</span>
      </p>
      <p style="margin:8px 0 0;color:#666;font-size:12px;line-height:1.5">
        Monto neto después de la comisión de Mobius Fly (5%). El pago será transferido según los términos acordados.
      </p>
    </div>

    <p style="color:#666;font-size:13px;margin:0;line-height:1.6">
      Para cualquier duda o aclaración contáctanos en
      <a href="mailto:operaciones@mobiusfly.com" style="color:#C4A77D">operaciones@mobiusfly.com</a>
    </p>
${emailClose()}`;
}

// ─── 3. Mobius internal notification email ────────────────────────────────────
// Sent to the Mobius ops team for every confirmed reservation.

export function buildMobiusInternalEmail(opts: BookingEmailOpts): string {
    const {
        bookingReference, origin, destination, departureDate, departureTime,
        flightCode, purchaseType, seatsRequested, passengers,
        contactFullName, contactEmail, contactPhone,
        amountTotalPaid, amountOwnerNet, amountMobiusTotal,
        departureFboName, arrivalFboName,
    } = opts;

    const flightRows: [string, string][] = [
        ["Referencia",      bookingReference],
        ["Código de vuelo", flightCode],
        ["Ruta",            `${origin} → ${destination}`],
        ["Salida",          `${departureDate}${departureTime ? `, ${departureTime}` : ""}`],
        ["FBO salida",      departureFboName || "—"],
        ["FBO llegada",     arrivalFboName || "—"],
        ["Tipo de compra",  purchaseTypeLabel(purchaseType, seatsRequested)],
    ];

    const contactRows: [string, string][] = [
        ["Nombre",  contactFullName],
        ["Correo",  contactEmail],
    ];
    if (contactPhone) contactRows.push(["Teléfono", contactPhone]);

    const paymentRows: [string, string][] = [
        ["Total cobrado al pasajero", `$${fmtMXN(amountTotalPaid)} MXN`],
        ["Pago neto al operador",     `$${fmtMXN(amountOwnerNet)} MXN`],
        ["Comisión Mobius Fly",       `$${fmtMXN(amountMobiusTotal)} MXN`],
    ];

    return `${emailOpen()}
    <p style="color:#39424E;font-size:18px;font-weight:bold;margin:0 0 6px">
      [Reserva confirmada] ${bookingReference}
    </p>
    <p style="color:#666;font-size:14px;margin:0 0 32px">
      Notificación interna — nueva reserva procesada exitosamente.
    </p>

    ${sectionTable("Detalles del vuelo", flightRows)}
    ${passengerManifestTable(passengers)}
    ${sectionTable("Contacto del comprador", contactRows)}

    <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #C4A77D;border-radius:8px;overflow:hidden;margin-bottom:24px">
      <tr style="background:#39424E">
        <td colspan="2" style="padding:12px 20px;color:#C4A77D;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Desglose de pago</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:16px 20px;border-top:1px solid #e5e5e5">
          <table width="100%">
            <tr>
              <td style="color:#666;font-size:14px;padding:5px 0">Total cobrado al pasajero</td>
              <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right">$${fmtMXN(amountTotalPaid)} MXN</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:14px;padding:5px 0">Pago neto al operador</td>
              <td style="color:#39424E;font-size:14px;font-weight:bold;text-align:right">$${fmtMXN(amountOwnerNet)} MXN</td>
            </tr>
            <tr style="border-top:2px solid #e5e5e5">
              <td style="color:#C4A77D;font-size:15px;padding:8px 0 5px;font-weight:bold">Ganancia Mobius Fly</td>
              <td style="color:#C4A77D;font-size:15px;font-weight:bold;text-align:right;padding:8px 0 5px">$${fmtMXN(amountMobiusTotal)} MXN</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
${emailClose()}`;
}
