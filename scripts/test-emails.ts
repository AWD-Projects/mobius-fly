// ─── Email template preview sender ───────────────────────────────────────────
// Sends all 3 email types + PDF manifest attachment to a test address.
// Usage:  npx tsx scripts/test-emails.ts

import * as fs   from "fs";
import * as path from "path";
import { Resend } from "resend";
import {
    buildBuyerConfirmationEmail,
    buildOwnerNotificationEmail,
    buildMobiusInternalEmail,
    type PassengerRow,
} from "../lib/emails/booking-templates";
import { generateManifestPDF, type ManifestPassenger } from "../lib/emails/manifest-pdf";
import { generateConfirmationPDF } from "../lib/emails/confirmation-pdf";

// ── Load .env ─────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, "../.env");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
}

const TO      = "alfaroga31@gmail.com";
const FROM    = process.env.RESEND_FROM_EMAIL ?? "noreply@mobiusfly.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Sample data ───────────────────────────────────────────────────────────────

const PASSENGERS: PassengerRow[] = [
    { full_name: "Eduardo Martínez López", date_of_birth: "2000-05-17", gender: "MALE",   is_minor: false, document_type: "Pasaporte" },
    { full_name: "Sofía Ramírez Torres",   date_of_birth: "1995-11-03", gender: "FEMALE", is_minor: false, document_type: "INE" },
    { full_name: "Lucas Martínez Gómez",   date_of_birth: "2015-08-22", gender: "MALE",   is_minor: true,  document_type: "Pasaporte" },
];

const MANIFEST_PASSENGERS: ManifestPassenger[] = PASSENGERS.map((p, i) => ({
    ...p,
    booking_reference: i === 0 ? "MBX-24A91" : "MBX-24A92",
}));

const MANIFEST_RESERVATIONS = [
    { booking_reference: "MBX-24A91", contact_full_name: "Eduardo Martínez López", contact_email: "eduardo@email.com", contact_phone: "+52 81 1234 5678" },
    { booking_reference: "MBX-24A92", contact_full_name: "Sofía Ramírez Torres",   contact_email: "sofia@email.com",   contact_phone: null },
];

const SHARED = {
    bookingReference:  "MBX-24A91",
    origin:            "Monterrey (MTY)",
    destination:       "Cancún (CUN)",
    originAirportName: "Aeropuerto Internacional de Monterrey",
    departureFboName:  "FBO Monterrey Norte",
    arrivalFboName:    "FBO Cancún Ejecutivo",
    departureDate:     "25/05/2026",
    departureTime:     "09:15",
    arrivalTime:       "11:40",
    flightCode:        "VLO-88421",
    aircraftType:      "Learjet 45",
    tailNumber:        "XA-GBT",
    flightType:        "ONE_WAY" as const,
    purchaseType:      "seats" as const,
    seatsRequested:    3,
    passengers:        PASSENGERS,
    contactFullName:   "Eduardo Martínez López",
    contactEmail:      "eduardo@email.com",
    contactPhone:      "+52 81 1234 5678",
    amountTotalPaid:   28500,
    amountOwnerNet:    27075,
    amountMobiusTotal: 1425,
    ownerFullName:     "Roberto García Vidal",
    ownerEmail:        "roberto@operador.mx",
};

// ── Send helper ───────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

async function send(
    label:       string,
    subject:     string,
    html:        string,
    attachments?: { filename: string; content: string | Buffer }[],
) {
    const payload: Parameters<typeof resend.emails.send>[0] = {
        from: FROM,
        to:   TO,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
    };
    const { data, error } = await resend.emails.send(payload);
    if (error) {
        console.error(`✗ ${label}:`, (error as any).message ?? error);
    } else {
        console.log(`✓ ${label} → ${TO}  (id: ${(data as any).id})`);
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\nSending email previews to ${TO}...\n`);

    // 1. Buyer confirmation + PDF
    console.log("  Generating confirmation PDF...");
    let confirmationPdf: Buffer | null = null;
    try {
        confirmationPdf = await generateConfirmationPDF({
            bookingReference: SHARED.bookingReference,
            contactFullName:  SHARED.contactFullName,
            contactEmail:     SHARED.contactEmail,
            contactPhone:     SHARED.contactPhone,
            origin:           SHARED.origin,
            destination:      SHARED.destination,
            departureDate:    SHARED.departureDate,
            departureTime:    SHARED.departureTime,
            arrivalTime:      SHARED.arrivalTime,
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
        console.log(`  Confirmation PDF generated (${(confirmationPdf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
        console.error("  Confirmation PDF generation failed:", (err as Error).message);
    }

    await send(
        "Buyer confirmation",
        `[PREVIEW] Reserva confirmada — MBX-24A91 | Mobius Fly`,
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
        confirmationPdf
            ? [{ filename: `confirmacion-${SHARED.bookingReference}.pdf`, content: confirmationPdf.toString("base64") }]
            : undefined,
    );

    // 2. Owner notification + PDF manifest attachment
    console.log("  Generating PDF manifest...");
    let pdfBuffer: Buffer | null = null;
    try {
        pdfBuffer = await generateManifestPDF({
            flightCode:       SHARED.flightCode,
            origin:           SHARED.origin,
            destination:      SHARED.destination,
            departureDate:    SHARED.departureDate,
            departureTime:    SHARED.departureTime,
            arrivalTime:      SHARED.arrivalTime,
            departureFboName: SHARED.departureFboName,
            arrivalFboName:   SHARED.arrivalFboName,
            aircraftType:     SHARED.aircraftType,
            tailNumber:       SHARED.tailNumber,
            passengers:       MANIFEST_PASSENGERS,
            reservations:     MANIFEST_RESERVATIONS,
            generatedAt:      new Date().toLocaleString("es-MX"),
        });
        console.log(`  PDF generated (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
        console.error("  PDF generation failed:", (err as Error).message);
    }

    await send(
        "Owner notification (with PDF)",
        `[PREVIEW] Nueva reserva MBX-24A91 en tu vuelo VLO-88421 | Mobius Fly`,
        buildOwnerNotificationEmail(SHARED),
        pdfBuffer
            ? [{ filename: `manifiesto-${SHARED.flightCode}.pdf`, content: pdfBuffer.toString("base64") }]
            : undefined,
    );

    // 3. Mobius internal
    await send(
        "Mobius internal",
        `[PREVIEW] [Reserva confirmada] MBX-24A91 — MTY → CUN`,
        buildMobiusInternalEmail(SHARED),
    );

    console.log("\nDone.\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
