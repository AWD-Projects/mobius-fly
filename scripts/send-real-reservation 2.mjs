// One-shot: sends buyer + owner + internal emails for MOB-926222 (real data)
import * as fs   from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

// ── Load .env ─────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, "../.env");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
}

// ── Import compiled libs via tsx/ts-node ─────────────────────────────────────
// We import from the TS source using tsx (invoked by npx tsx)
const { buildBuyerConfirmationEmail, buildOwnerNotificationEmail, buildMobiusInternalEmail } =
    await import("../lib/emails/booking-templates.ts");
const { generateManifestPDF }     = await import("../lib/emails/manifest-pdf.ts");
const { generateConfirmationPDF } = await import("../lib/emails/confirmation-pdf.ts");
const { Resend }                  = await import("resend");

// ── Real reservation data (MOB-926222) ────────────────────────────────────────
const depDt  = new Date("2026-04-27T09:00:00Z");
const arrDt  = new Date("2026-04-27T11:30:00Z");

const depDate = depDt.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const depTime = depDt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
const arrTime = arrDt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
const depDate2 = `${String(depDt.getDate()).padStart(2,"0")}/${String(depDt.getMonth()+1).padStart(2,"0")}/${depDt.getFullYear()}`;
const depTime2 = `${String(depDt.getHours()).padStart(2,"0")}:${String(depDt.getMinutes()).padStart(2,"0")}`;
const arrTime2 = `${String(arrDt.getHours()).padStart(2,"0")}:${String(arrDt.getMinutes()).padStart(2,"0")}`;

const PASSENGERS = [
    { full_name: "Arturo Alfaro Gonzalez", date_of_birth: "2002-05-31", gender: "MALE", is_minor: false, document_type: "INE" },
];

const SHARED = {
    bookingReference:  "MOB-926222",
    origin:            "Ciudad de Mexico (NLU)",
    destination:       "Cancún (CUN)",
    originAirportName: "Aeropuerto Internacional Felipe Ángeles",
    departureFboName:  "FBO Aviación Ejecutiva AIFA",
    arrivalFboName:    "Terminal VIP Cancún",
    departureDate:     depDate,
    departureTime:     depTime,
    arrivalTime:       arrTime,
    flightCode:        "ISK-001",
    aircraftType:      "Cessna Citation CJ4",
    tailNumber:        "XC-ISK",
    flightType:        "ONE_WAY",
    purchaseType:      "seats",
    seatsRequested:    1,
    passengers:        PASSENGERS,
    contactFullName:   "Arturo Alfaro Gonzalez",
    contactEmail:      "alfaroga31@gmail.com",
    contactPhone:      null,
    amountTotalPaid:   18500,
    amountOwnerNet:    17575,
    amountMobiusTotal: 925,
    ownerFullName:     "Carlos Mendoza (Propietario)",
    ownerEmail:        "alfaroga31@gmail.com",
};

const TO   = "alfaroga31@gmail.com";
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const resend = new Resend(process.env.RESEND_API_KEY);

async function send(label, subject, html, attachments) {
    const payload = { from: FROM, to: TO, subject, html };
    if (attachments?.length) payload.attachments = attachments;
    const { data, error } = await resend.emails.send(payload);
    if (error) console.error(`✗ ${label}:`, error?.message ?? error);
    else       console.log(`✓ ${label} → ${TO}  (id: ${data.id})`);
}

console.log(`\nEnviando correos de MOB-926222 a ${TO}...\n`);

// 1. Confirmation PDF + buyer email
console.log("  Generando PDF de confirmación...");
let confirmPdf = null;
try {
    confirmPdf = await generateConfirmationPDF({
        bookingReference: SHARED.bookingReference,
        contactFullName:  SHARED.contactFullName,
        contactEmail:     SHARED.contactEmail,
        contactPhone:     SHARED.contactPhone,
        origin:           SHARED.origin,
        destination:      SHARED.destination,
        departureDate:    depDate2,
        departureTime:    depTime2,
        arrivalTime:      arrTime2,
        departureFboName: SHARED.departureFboName,
        arrivalFboName:   SHARED.arrivalFboName,
        flightCode:       SHARED.flightCode,
        aircraftType:     SHARED.aircraftType,
        tailNumber:       SHARED.tailNumber,
        flightType:       SHARED.flightType,
        purchaseType:     SHARED.purchaseType,
        seatsRequested:   SHARED.seatsRequested,
        passengers:       SHARED.passengers,
        amountTotalPaid:  SHARED.amountTotalPaid,
        generatedAt:      new Date().toLocaleString("es-MX"),
    });
    console.log(`  PDF confirmación OK (${(confirmPdf.length/1024).toFixed(1)} KB)`);
} catch (e) { console.error("  PDF confirmación falló:", e.message); }

await send(
    "Buyer confirmation",
    `Reserva confirmada — MOB-926222 | Mobius Fly`,
    buildBuyerConfirmationEmail({
        contactName:      SHARED.contactFullName,
        contactEmail:     SHARED.contactEmail,
        contactPhone:     SHARED.contactPhone,
        bookingReference: SHARED.bookingReference,
        origin:           SHARED.origin,
        destination:      SHARED.destination,
        departureDate:    SHARED.departureDate,
        departureTime:    SHARED.departureTime,
        arrivalTime:      SHARED.arrivalTime,
        flightCode:       SHARED.flightCode,
        departureFboName: SHARED.departureFboName,
        aircraftType:     SHARED.aircraftType,
        tailNumber:       SHARED.tailNumber,
        flightType:       SHARED.flightType,
        seatsRequested:   SHARED.seatsRequested,
        purchaseType:     SHARED.purchaseType,
        passengers:       SHARED.passengers,
        amountTotalPaid:  SHARED.amountTotalPaid,
        appUrl:           APP_URL,
    }),
    confirmPdf ? [{ filename: `confirmacion-MOB-926222.pdf`, content: confirmPdf.toString("base64") }] : undefined,
);

// 2. Manifest PDF + owner email
console.log("  Generando PDF manifiesto...");
let manifestPdf = null;
try {
    manifestPdf = await generateManifestPDF({
        flightCode:       SHARED.flightCode,
        origin:           SHARED.origin,
        destination:      SHARED.destination,
        departureDate:    depDate2,
        departureTime:    depTime2,
        arrivalTime:      arrTime2,
        departureFboName: SHARED.departureFboName,
        arrivalFboName:   SHARED.arrivalFboName,
        aircraftType:     SHARED.aircraftType,
        tailNumber:       SHARED.tailNumber,
        passengers:       SHARED.passengers.map(p => ({ ...p, booking_reference: SHARED.bookingReference })),
        reservations:     [{ booking_reference: SHARED.bookingReference, contact_full_name: SHARED.contactFullName, contact_email: SHARED.contactEmail, contact_phone: SHARED.contactPhone }],
        generatedAt:      new Date().toLocaleString("es-MX"),
    });
    console.log(`  PDF manifiesto OK (${(manifestPdf.length/1024).toFixed(1)} KB)`);
} catch (e) { console.error("  PDF manifiesto falló:", e.message); }

await send(
    "Owner notification",
    `Nueva reserva MOB-926222 en tu vuelo ISK-001 | Mobius Fly`,
    buildOwnerNotificationEmail(SHARED),
    manifestPdf ? [{ filename: `manifiesto-ISK-001.pdf`, content: manifestPdf.toString("base64") }] : undefined,
);

// 3. Internal
await send(
    "Mobius internal",
    `[Reserva confirmada] MOB-926222 — NLU → CUN`,
    buildMobiusInternalEmail(SHARED),
);

console.log("\nListo.\n");
