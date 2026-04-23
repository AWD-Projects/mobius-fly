// ─── Passenger manifest PDF generator ────────────────────────────────────────
// Design: manifiesto.html supplied by Mobius team.
// Pure Node.js (pdfkit) — no React dependency, works in Next.js route handlers.

import PDFDocument from "pdfkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ManifestPassenger {
    full_name:         string;
    date_of_birth:     string | null;
    gender:            string | null;
    is_minor:          boolean;
    document_type:     string;
    booking_reference: string;
}

export interface ManifestReservation {
    booking_reference:  string;
    contact_full_name:  string;
    contact_email:      string;
    contact_phone:      string | null;
}

export interface ManifestData {
    flightCode:       string;
    origin:           string;   // "Ciudad (IATA)"
    destination:      string;
    departureDate:    string;
    departureTime:    string;
    arrivalTime?:     string;   // "HH:mm"
    departureFboName: string;
    arrivalFboName:   string | null;
    aircraftType?:    string;   // "Learjet 45"
    tailNumber?:      string;   // "XA-GBT"
    passengers:       ManifestPassenger[];
    reservations?:    ManifestReservation[];
    generatedAt:      string;
}

// ─── Design tokens (from manifiesto.html) ────────────────────────────────────

const BG     = "#f6f4f1";
const CARD   = "#FFFFFF";
const INK    = "#243a57";
const MUTED  = "#7c8796";
const LINE   = "#e8e2d8";
const ACCENT = "#c8a46a";
// const ASOFT  = "#efe6d7";  // reserved for future use
const SUCCESS_BG   = "#e8f2ee";
const SUCCESS_TEXT = "#2f6b56";

// ─── Layout constants ─────────────────────────────────────────────────────────

const ML = 38;                    // left margin
const MR = 557;                   // right edge  (595 - 38)
const CW = MR - ML;               // content width = 519
const MT = 38;                    // top margin start

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Draws "MTY [→] CUN" with a real path-drawn arrow (Helvetica can't render U+2192)
function drawRouteArrow(
    doc: InstanceType<typeof PDFDocument>,
    x: number, y: number,
    from: string, to: string,
    fontSize: number,
    color: string,
) {
    doc.font("Helvetica-Bold").fontSize(fontSize);
    const fromW = doc.widthOfString(from);
    doc.fillColor(color).text(from, x, y, { lineBreak: false });

    const pad = fontSize * 0.5;
    const ax1 = x + fromW + pad;
    const ax2 = ax1 + fontSize * 1.8;
    const ay  = y + fontSize * 0.52;
    const hl  = fontSize * 0.36;
    const hh  = fontSize * 0.22;
    const lw  = Math.max(1, fontSize * 0.07);

    doc.save()
       .strokeColor(color).lineWidth(lw)
       .moveTo(ax1, ay).lineTo(ax2 - hl, ay).stroke()
       .fillColor(color)
       .moveTo(ax2, ay).lineTo(ax2 - hl, ay - hh).lineTo(ax2 - hl, ay + hh).fill()
       .restore();

    doc.font("Helvetica-Bold").fontSize(fontSize).fillColor(color)
       .text(to, ax2 + pad, y, { lineBreak: false });
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
    if (g === "MALE")   return "Masc.";
    if (g === "FEMALE") return "Fem.";
    if (g === "OTHER")  return "Otro";
    return "—";
}

/** Extract IATA code from "Ciudad (IATA)" format */
function iata(s: string): string {
    return s.match(/\(([A-Z]{3})\)/)?.[1] ?? s;
}

// Draw a filled rect and restore fill color
function fillRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, color: string) {
    doc.save().rect(x, y, w, h).fill(color).restore();
}

// Draw a rounded rect filled
function fillRoundRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, r: number, color: string) {
    doc.save().roundedRect(x, y, w, h, r).fill(color).restore();
}

// Draw bordered rounded rect (no fill)
function strokeRoundRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, r: number, color: string, lw = 0.5) {
    doc.save().roundedRect(x, y, w, h, r).lineWidth(lw).strokeColor(color).stroke().restore();
}

// Label + value pair (small-label / small-value style)
function metaCell(
    doc: InstanceType<typeof PDFDocument>,
    x: number, y: number, w: number,
    label: string, value: string,
) {
    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text(label.toUpperCase(), x, y, { width: w, lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(9).fillColor(INK)
       .text(value, x, y + 10, { width: w, lineBreak: false, ellipsis: true });
}

// Key-value row inside a card section
function kvRow(
    doc: InstanceType<typeof PDFDocument>,
    x: number, y: number, w: number,
    key: string, value: string,
    isLast = false,
) {
    const KW = Math.round(w * 0.46);
    doc.font("Helvetica").fontSize(7.5).fillColor(MUTED)
       .text(key, x, y + 2, { width: KW, lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK)
       .text(value, x + KW, y + 2, { width: w - KW, lineBreak: false, ellipsis: true });
    if (!isLast) {
        doc.save()
           .moveTo(x, y + 14).lineTo(x + w, y + 14)
           .lineWidth(0.4).dash(2, { space: 2 }).strokeColor(LINE).stroke()
           .restore();
    }
}

// Section header inside a card
function cardHeader(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, title: string) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK)
       .text(title, x, y + (h - 10) / 2 + 1, { width: w, lineBreak: false });
}

// Full table row (header or data)
function tableRow(
    doc:   InstanceType<typeof PDFDocument>,
    y:     number,
    cells: string[],
    cols:  { x: number; w: number }[],
    bg:    string,
    fg:    string,
    bold:  boolean,
    h:     number,
) {
    fillRect(doc, ML, y, CW, h, bg);
    doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(7.5).fillColor(fg);
    cells.forEach((text, i) => {
        const col = cols[i];
        if (!col) return;
        doc.text(text ?? "—", col.x + 4, y + (h - 7.5) / 2 + 1, {
            width:     col.w - 8,
            height:    h,
            lineBreak: false,
            ellipsis:  true,
        });
    });
}

// ─── Main builder ─────────────────────────────────────────────────────────────

function buildManifest(doc: InstanceType<typeof PDFDocument>, data: ManifestData) {
    let y = MT;

    const depIata = iata(data.origin);
    const arrIata = iata(data.destination);

    // Unique booking references for "Reservas asociadas" section
    const refs = [...new Set(data.passengers.map(p => p.booking_reference).filter(Boolean))];
    const issuedDate = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });

    // ── 1. Brand bar ──────────────────────────────────────────────────────────
    // "M" logotype box
    strokeRoundRect(doc, ML, y, 26, 26, 5, INK, 1.5);
    doc.font("Helvetica-Bold").fontSize(14).fillColor(INK)
       .text("M", ML, y + 5, { width: 26, align: "center", lineBreak: false });

    doc.font("Helvetica-Bold").fontSize(14).fillColor(INK)
       .text("Mobius Fly", ML + 32, y + 5, { lineBreak: false });

    // "Documento operativo de vuelo" on right
    doc.font("Helvetica").fontSize(7.5).fillColor(MUTED)
       .text("DOCUMENTO OPERATIVO DE VUELO", ML, y + 5, { width: CW, align: "right", lineBreak: false });

    y += 38;

    // Gold divider
    doc.save().moveTo(ML, y).lineTo(MR, y).lineWidth(1.5).strokeColor(ACCENT).stroke().restore();
    y += 12;

    // ── 2. Hero card ──────────────────────────────────────────────────────────
    const HERO_H = 132;
    fillRoundRect(doc, ML, y, CW, HERO_H, 10, CARD);
    strokeRoundRect(doc, ML, y, CW, HERO_H, 10, LINE);

    // Eyebrow
    doc.font("Helvetica-Bold").fontSize(7).fillColor(ACCENT)
       .text("MANIFIESTO DE PASAJEROS", ML + 12, y + 12, { lineBreak: false });

    // Title
    doc.font("Helvetica-Bold").fontSize(18).fillColor(INK)
       .text("Manifiesto de Pasajeros", ML + 12, y + 22, { lineBreak: false });

    // Subtitle
    doc.font("Helvetica").fontSize(8).fillColor(MUTED)
       .text("Documento generado para control operativo, validación previa al embarque y respaldo documental del vuelo.", ML + 12, y + 46, {
           width: CW * 0.55, lineBreak: true,
       });

    // "Validado por operador" badge (top-right)
    const BADGE_TXT = "Validado por operador";
    const bw = 110;
    const bx = MR - bw - 2;
    fillRoundRect(doc, bx, y + 12, bw, 18, 9, SUCCESS_BG);
    doc.font("Helvetica-Bold").fontSize(7).fillColor(SUCCESS_TEXT)
       .text(BADGE_TXT, bx, y + 17, { width: bw, align: "center", lineBreak: false });

    // Large route display — positioned after subtitle, well above meta row
    drawRouteArrow(doc, ML + 12, y + 70, depIata, arrIata, 22, ACCENT);

    // Meta row: Reserva | ID vuelo | Fecha | Estatus
    const metaY = y + 104;
    const mw = CW / 4;
    metaCell(doc, ML + 12,          metaY, mw - 4, "Reserva",         refs[0] ?? "—");
    metaCell(doc, ML + 12 + mw,     metaY, mw - 4, "Código de vuelo", data.flightCode || "—");
    metaCell(doc, ML + 12 + mw * 2, metaY, mw - 4, "Fecha de emisión", issuedDate);
    metaCell(doc, ML + 12 + mw * 3, metaY, mw - 4, "Estatus",          "Confirmado");

    y += HERO_H + 12;

    // ── 3. Two-col info cards ─────────────────────────────────────────────────
    const COL_W = (CW - 10) / 2;
    const LEFT_X  = ML;
    const RIGHT_X = ML + COL_W + 10;

    // Flight info rows
    const flightRows: [string, string][] = [
        ["Fecha de salida",           data.departureDate],
        ["Hora estimada de salida",   data.departureTime || "—"],
        ["Hora estimada de llegada",  data.arrivalTime   || "—"],
        ["Salida desde",              data.departureFboName || "—"],
        ["Llegada a",                 data.arrivalFboName || "—"],
        ["Aeronave",                  data.aircraftType
            ? (data.tailNumber ? `${data.aircraftType} · ${data.tailNumber}` : data.aircraftType)
            : "—"],
    ];

    // Operational info rows
    const opRows: [string, string][] = [
        ["Menores de edad",     data.passengers.some(p => p.is_minor) ? "Sí" : "No"],
        ["Total de pasajeros",  String(data.passengers.length)],
        ["Titulares de reserva", String(refs.length)],
    ];

    const CARD_PAD   = 10;
    const KV_ROW_H   = 16;
    const CARD_HDR_H = 22;
    const flightCardH = CARD_HDR_H + CARD_PAD + flightRows.length * KV_ROW_H + CARD_PAD;
    const opCardH     = CARD_HDR_H + CARD_PAD + opRows.length   * KV_ROW_H + CARD_PAD;
    const cardH = Math.max(flightCardH, opCardH);

    // Left card
    fillRoundRect(doc, LEFT_X, y, COL_W, cardH, 8, CARD);
    strokeRoundRect(doc, LEFT_X, y, COL_W, cardH, 8, LINE);
    cardHeader(doc, LEFT_X + CARD_PAD, y, COL_W - CARD_PAD * 2, CARD_HDR_H, "Información del vuelo");
    doc.save().moveTo(LEFT_X, y + CARD_HDR_H).lineTo(LEFT_X + COL_W, y + CARD_HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();
    flightRows.forEach(([k, v], i) => {
        kvRow(doc, LEFT_X + CARD_PAD, y + CARD_HDR_H + CARD_PAD + i * KV_ROW_H,
              COL_W - CARD_PAD * 2, k, v, i === flightRows.length - 1);
    });

    // Right card
    fillRoundRect(doc, RIGHT_X, y, COL_W, cardH, 8, CARD);
    strokeRoundRect(doc, RIGHT_X, y, COL_W, cardH, 8, LINE);
    cardHeader(doc, RIGHT_X + CARD_PAD, y, COL_W - CARD_PAD * 2, CARD_HDR_H, "Información operativa");
    doc.save().moveTo(RIGHT_X, y + CARD_HDR_H).lineTo(RIGHT_X + COL_W, y + CARD_HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();
    opRows.forEach(([k, v], i) => {
        kvRow(doc, RIGHT_X + CARD_PAD, y + CARD_HDR_H + CARD_PAD + i * KV_ROW_H,
              COL_W - CARD_PAD * 2, k, v, i === opRows.length - 1);
    });

    y += cardH + 14;

    // ── 4. Reservas asociadas / titulares ─────────────────────────────────────
    const reservationRows = data.reservations && data.reservations.length > 0
        ? data.reservations
        : refs.map(ref => ({ booking_reference: ref, contact_full_name: "—", contact_email: "—", contact_phone: null }));

    if (reservationRows.length > 0) {
        const HOLDER_COLS = [
            { x: ML,       w: 18  },   // #
            { x: ML + 18,  w: 120 },   // Nombre
            { x: ML + 138, w: 140 },   // Correo
            { x: ML + 278, w: 80  },   // Teléfono
            { x: ML + 358, w: 95  },   // Código de reserva
            { x: ML + 453, w: 66  },   // Rol
        ];
        const HDR_H = 20;
        const ROW_H = 16;

        const sectionH = CARD_HDR_H + HDR_H + reservationRows.length * ROW_H + 4;
        fillRoundRect(doc, ML, y, CW, sectionH, 8, CARD);
        strokeRoundRect(doc, ML, y, CW, sectionH, 8, LINE);
        cardHeader(doc, ML + CARD_PAD, y, CW - CARD_PAD * 2, CARD_HDR_H, "Titulares de reserva");
        doc.save().moveTo(ML, y + CARD_HDR_H).lineTo(MR, y + CARD_HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();

        tableRow(doc, y + CARD_HDR_H,
            ["#", "Nombre completo", "Correo", "Teléfono", "Código de reserva", "Rol"],
            HOLDER_COLS, "#fcfaf7", MUTED, true, HDR_H);

        reservationRows.forEach((res, i) => {
            const bg = i % 2 === 0 ? CARD : BG;
            tableRow(doc, y + CARD_HDR_H + HDR_H + i * ROW_H,
                [String(i + 1), res.contact_full_name, res.contact_email, res.contact_phone ?? "—", res.booking_reference, "Titular"],
                HOLDER_COLS, bg, INK, false, ROW_H);
        });

        y += sectionH + 14;
    }

    // ── 5. Pasajeros registrados ──────────────────────────────────────────────
    const PAX_COLS = [
        { x: ML,       w: 20  },  // #
        { x: ML + 20,  w: 260 },  // Nombre
        { x: ML + 280, w: 120 },  // Fecha nac.
        { x: ML + 400, w: 119 },  // Sexo
    ];
    const PAX_HDR_H = 20;
    const PAX_ROW_H = 16;
    const PAX_SECTION_H = CARD_HDR_H + PAX_HDR_H + data.passengers.length * PAX_ROW_H + 4;

    // Page break if needed
    if (y + PAX_SECTION_H > doc.page.height - 60) {
        doc.addPage();
        y = MT;
    }

    fillRoundRect(doc, ML, y, CW, PAX_SECTION_H, 8, CARD);
    strokeRoundRect(doc, ML, y, CW, PAX_SECTION_H, 8, LINE);

    // Passenger count badge
    const paxLabel = `${data.passengers.length} pasajero${data.passengers.length !== 1 ? "s" : ""} confirmado${data.passengers.length !== 1 ? "s" : ""}`;
    const badgeW = doc.font("Helvetica-Bold").fontSize(7.5).widthOfString(paxLabel) + 16;
    fillRoundRect(doc, ML + CARD_PAD, y + (CARD_HDR_H - 18) / 2, badgeW, 18, 9, INK);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(CARD)
       .text(paxLabel, ML + CARD_PAD + 8, y + (CARD_HDR_H - 18) / 2 + 5, { width: badgeW - 16, lineBreak: false });

    cardHeader(doc, ML + CARD_PAD + badgeW + 8, y, CW, CARD_HDR_H, "Pasajeros confirmados");
    doc.save().moveTo(ML, y + CARD_HDR_H).lineTo(MR, y + CARD_HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();

    tableRow(doc, y + CARD_HDR_H,
        ["#", "Nombre completo", "Fecha nac.", "Sexo"],
        PAX_COLS, "#fcfaf7", MUTED, true, PAX_HDR_H);

    data.passengers.forEach((p, i) => {
        // New page if not enough room
        if (y + CARD_HDR_H + PAX_HDR_H + (i + 1) * PAX_ROW_H > doc.page.height - 60) {
            doc.addPage();
            y = MT - CARD_HDR_H - PAX_HDR_H - i * PAX_ROW_H;
            tableRow(doc, y + CARD_HDR_H + PAX_HDR_H + i * PAX_ROW_H,
                ["#", "Nombre completo", "Fecha nac.", "Sexo"],
                PAX_COLS, "#fcfaf7", MUTED, true, PAX_HDR_H);
        }

        const bg = i % 2 === 0 ? CARD : BG;
        tableRow(doc, y + CARD_HDR_H + PAX_HDR_H + i * PAX_ROW_H,
            [
                String(i + 1),
                p.full_name     || "—",
                p.date_of_birth || "—",
                genderLabel(p.gender),
            ],
            PAX_COLS, bg, INK, false, PAX_ROW_H);
    });

    y += PAX_SECTION_H + 14;

    // ── 6. Bottom row: legal note + operator validation ───────────────────────
    const LEGAL_W  = Math.round(CW * 0.62);
    const VAL_W    = CW - LEGAL_W - 10;
    const BOTTOM_H = 80;

    // Legal note
    fillRoundRect(doc, ML, y, LEGAL_W, BOTTOM_H, 8, CARD);
    strokeRoundRect(doc, ML, y, LEGAL_W, BOTTOM_H, 8, LINE);
    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text(
           "La información contenida en este manifiesto corresponde a los pasajeros registrados para las reservas señaladas. El operador podrá requerir documentación adicional y restringir el abordaje en caso de inconsistencias, razones regulatorias, operativas o de seguridad.",
           ML + CARD_PAD, y + CARD_PAD,
           { width: LEGAL_W - CARD_PAD * 2, lineBreak: true },
       );

    // Operator validation card
    const VAL_X = ML + LEGAL_W + 10;
    fillRoundRect(doc, VAL_X, y, VAL_W, BOTTOM_H, 8, CARD);
    strokeRoundRect(doc, VAL_X, y, VAL_W, BOTTOM_H, 8, LINE);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(INK)
       .text("Validación del operador", VAL_X + CARD_PAD, y + CARD_PAD, { lineBreak: false });

    const valRows: [string, string][] = [
        ["Responsable", "________________"],
        ["Firma",       "________________"],
        ["Fecha / hora","________________"],
    ];
    valRows.forEach(([k, v], i) => {
        kvRow(doc, VAL_X + CARD_PAD, y + 22 + i * KV_ROW_H,
              VAL_W - CARD_PAD * 2, k, v, i === valRows.length - 1);
    });

    // ── 7. Footer ─────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 28;
    doc.save().moveTo(ML, footerY - 8).lineTo(MR, footerY - 8)
       .lineWidth(0.4).strokeColor(LINE).stroke().restore();

    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text(`Generado el ${data.generatedAt}`, ML, footerY, { width: CW / 2, lineBreak: false });

    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text("Mobius Fly · Documento operativo de vuelo  |  soporte@mobiusfly.com · Generado digitalmente",
            ML, footerY, { width: CW, align: "right", lineBreak: false });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateManifestPDF(data: ManifestData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size:   "A4",
                margin: 0,
                info: {
                    Title:   `Manifiesto ${data.flightCode}`,
                    Author:  "Mobius Fly",
                    Subject: "Manifiesto de Pasajeros",
                },
            });

            const chunks: Buffer[] = [];
            doc.on("data",  (chunk: Buffer) => chunks.push(chunk));
            doc.on("end",   () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            buildManifest(doc, data);
            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
