// ─── Buyer booking confirmation PDF generator ─────────────────────────────────
// Design reference: confirmacion.html / confirmacion_reserva_mobius.pdf
// Pure Node.js (pdfkit) — no React dependency, works in Next.js route handlers.

import PDFDocument from "pdfkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmationPassenger {
    full_name:     string;
    date_of_birth: string | null;
    gender:        string | null;
    is_minor:      boolean;
    document_type: string;
}

export interface ConfirmationData {
    bookingReference: string;
    contactFullName:  string;
    contactEmail:     string;
    contactPhone:     string | null;
    origin:           string;   // "Ciudad (IATA)"
    destination:      string;
    departureDate:    string;
    departureTime:    string;
    arrivalTime?:     string;
    departureFboName: string;
    arrivalFboName:   string | null;
    flightCode:       string;
    aircraftType?:    string;
    tailNumber?:      string;
    flightType?:      "ONE_WAY" | "ROUND_TRIP";
    purchaseType:     "seats" | "full_aircraft";
    seatsRequested:   number;
    passengers:       ConfirmationPassenger[];
    amountTotalPaid:  number;
    generatedAt:      string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG          = "#f6f4f1";
const CARD        = "#FFFFFF";
const INK         = "#243a57";
const MUTED       = "#7c8796";
const LINE        = "#e8e2d8";
const ACCENT      = "#c8a46a";
const ASOFT       = "#efe6d7";
const SUCCESS_BG  = "#e8f2ee";
const SUCCESS_TXT = "#2f6b56";

// ─── Layout constants ─────────────────────────────────────────────────────────

const ML = 38;
const MR = 557;
const CW = MR - ML;
const MT = 38;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMXN(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function genderLabel(g: string | null): string {
    if (g === "MALE")   return "Masculino";
    if (g === "FEMALE") return "Femenino";
    if (g === "OTHER")  return "Otro";
    return "—";
}

function iata(s: string): string {
    return s.match(/\(([A-Z]{3})\)/)?.[1] ?? s;
}

function purchaseTypeLabel(type: "seats" | "full_aircraft", seats: number): string {
    if (type === "full_aircraft") return "Aeronave completa";
    return `${seats} asiento${seats !== 1 ? "s" : ""}`;
}

// Draws "MTY [→] CUN" with a path-drawn arrow (Helvetica can't render U+2192)
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

function fillRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, color: string) {
    doc.save().rect(x, y, w, h).fill(color).restore();
}

function fillRoundRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, r: number, color: string) {
    doc.save().roundedRect(x, y, w, h, r).fill(color).restore();
}

function strokeRoundRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, r: number, color: string, lw = 0.5) {
    doc.save().roundedRect(x, y, w, h, r).lineWidth(lw).strokeColor(color).stroke().restore();
}

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

function cardHeader(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, title: string) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK)
       .text(title, x, y + (h - 10) / 2 + 1, { width: w, lineBreak: false });
}

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
            width: col.w - 8, height: h, lineBreak: false, ellipsis: true,
        });
    });
}

// ─── Main builder ─────────────────────────────────────────────────────────────

function buildConfirmation(doc: InstanceType<typeof PDFDocument>, data: ConfirmationData) {
    let y = MT;

    const depIata = iata(data.origin);
    const arrIata = iata(data.destination);

    // ── 1. Brand bar ──────────────────────────────────────────────────────────
    strokeRoundRect(doc, ML, y, 26, 26, 5, INK, 1.5);
    doc.font("Helvetica-Bold").fontSize(14).fillColor(INK)
       .text("M", ML, y + 5, { width: 26, align: "center", lineBreak: false });

    doc.font("Helvetica-Bold").fontSize(14).fillColor(INK)
       .text("Mobius Fly", ML + 32, y + 5, { lineBreak: false });

    doc.font("Helvetica").fontSize(7.5).fillColor(MUTED)
       .text("CONFIRMACIÓN DE RESERVA", ML, y + 5, { width: CW, align: "right", lineBreak: false });

    y += 38;

    doc.save().moveTo(ML, y).lineTo(MR, y).lineWidth(1.5).strokeColor(ACCENT).stroke().restore();
    y += 12;

    // ── 2. Hero card ──────────────────────────────────────────────────────────
    const HERO_H = 96;
    fillRoundRect(doc, ML, y, CW, HERO_H, 10, CARD);
    strokeRoundRect(doc, ML, y, CW, HERO_H, 10, LINE);

    // Eyebrow
    doc.font("Helvetica-Bold").fontSize(7).fillColor(ACCENT)
       .text("RESERVA CONFIRMADA", ML + 12, y + 12, { lineBreak: false });

    // Title
    doc.font("Helvetica-Bold").fontSize(18).fillColor(INK)
       .text("Tu vuelo está listo", ML + 12, y + 22, { lineBreak: false });

    // Subtitle
    doc.font("Helvetica").fontSize(8).fillColor(MUTED)
       .text("Tu lugar ha sido reservado exitosamente. Aquí están los detalles más importantes de tu experiencia.", ML + 12, y + 42, {
           width: CW * 0.6, lineBreak: true,
       });

    // "Pagado y confirmado" badge
    const BADGE_TXT = "Pagado y confirmado";
    const bw = doc.font("Helvetica-Bold").fontSize(7.5).widthOfString(BADGE_TXT) + 20;
    const bx = MR - bw - 2;
    fillRoundRect(doc, bx, y + 12, bw, 18, 9, SUCCESS_BG);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(SUCCESS_TXT)
       .text(BADGE_TXT, bx, y + 17, { width: bw, align: "center", lineBreak: false });

    // Booking reference
    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text("REFERENCIA", bx, y + 38, { width: bw, align: "center", lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(11).fillColor(INK)
       .text(data.bookingReference, bx, y + 48, { width: bw, align: "center", lineBreak: false });

    y += HERO_H + 10;

    // ── 3. Route box ──────────────────────────────────────────────────────────
    const ROUTE_H = 78;
    fillRoundRect(doc, ML, y, CW, ROUTE_H, 10, CARD);
    strokeRoundRect(doc, ML, y, CW, ROUTE_H, 10, LINE);

    // IATA route
    drawRouteArrow(doc, ML + 12, y + 10, depIata, arrIata, 22, ACCENT);

    // 4 meta columns
    const mw = (CW - 24) / 4;
    const metaY = y + 44;
    const tripTypeLabel = data.flightType === "ROUND_TRIP" ? "Vuelo redondo"
                        : data.flightType === "ONE_WAY"    ? "Vuelo sencillo"
                        : purchaseTypeLabel(data.purchaseType, data.seatsRequested);
    metaCell(doc, ML + 12,              metaY, mw - 4, "Tipo de vuelo", tripTypeLabel);
    metaCell(doc, ML + 12 + mw,         metaY, mw - 4, "Salida",           `${data.departureDate}${data.departureTime ? ` · ${data.departureTime}` : ""}`);
    metaCell(doc, ML + 12 + mw * 2,     metaY, mw - 4, "Llegada estimada", data.arrivalTime || "—");
    metaCell(doc, ML + 12 + mw * 3,     metaY, mw - 4, "Código de reserva", data.bookingReference);

    y += ROUTE_H + 12;

    // ── 4. Two-col: booking details + flight info ─────────────────────────────
    const COL_W    = (CW - 10) / 2;
    const CARD_PAD = 10;
    const KV_ROW_H = 16;
    const HDR_H    = 22;

    const bookingRows: [string, string][] = [
        ["Titular",        data.contactFullName || "—"],
        ["Correo",         data.contactEmail    || "—"],
        ["Teléfono",       data.contactPhone    || "—"],
        ["Pasajeros",      String(data.seatsRequested)],
        ["Método de pago", "Tarjeta de crédito / débito"],
        ["Monto pagado",   `$${fmtMXN(data.amountTotalPaid)} MXN`],
    ];

    const flightRows: [string, string][] = [
        ["Origen",          data.origin],
        ["Destino",         data.destination],
        ["Aeronave",        data.aircraftType || "—"],
        ["Matrícula",       data.tailNumber   || "—"],
        ["Código de vuelo", data.flightCode   || "—"],
        ["Emisión",         data.generatedAt],
    ];

    const leftCardH  = HDR_H + CARD_PAD + bookingRows.length * KV_ROW_H + CARD_PAD;
    const rightCardH = HDR_H + CARD_PAD + flightRows.length * KV_ROW_H + CARD_PAD;
    const twoColH    = Math.max(leftCardH, rightCardH);

    // Left card
    fillRoundRect(doc, ML, y, COL_W, twoColH, 8, CARD);
    strokeRoundRect(doc, ML, y, COL_W, twoColH, 8, LINE);
    cardHeader(doc, ML + CARD_PAD, y, COL_W - CARD_PAD * 2, HDR_H, "Detalles de la reserva");
    doc.save().moveTo(ML, y + HDR_H).lineTo(ML + COL_W, y + HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();
    bookingRows.forEach(([k, v], i) => {
        kvRow(doc, ML + CARD_PAD, y + HDR_H + CARD_PAD + i * KV_ROW_H,
              COL_W - CARD_PAD * 2, k, v, i === bookingRows.length - 1);
    });

    // Right card
    const RX = ML + COL_W + 10;
    fillRoundRect(doc, RX, y, COL_W, twoColH, 8, CARD);
    strokeRoundRect(doc, RX, y, COL_W, twoColH, 8, LINE);
    cardHeader(doc, RX + CARD_PAD, y, COL_W - CARD_PAD * 2, HDR_H, "Información del vuelo");
    doc.save().moveTo(RX, y + HDR_H).lineTo(RX + COL_W, y + HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();
    flightRows.forEach(([k, v], i) => {
        kvRow(doc, RX + CARD_PAD, y + HDR_H + CARD_PAD + i * KV_ROW_H,
              COL_W - CARD_PAD * 2, k, v, i === flightRows.length - 1);
    });

    y += twoColH + 12;

    // ── 5. Passengers table ───────────────────────────────────────────────────
    if (data.passengers.length > 0) {
        const PAX_COLS = [
            { x: ML,       w: 20  },  // #
            { x: ML + 20,  w: 230 },  // Nombre
            { x: ML + 250, w: 100 },  // Fecha nac.
            { x: ML + 350, w: 90  },  // Sexo
            { x: ML + 440, w: 79  },  // Tipo
        ];
        const PAX_HDR_H = 20;
        const PAX_ROW_H = 16;
        const paxSectionH = HDR_H + PAX_HDR_H + data.passengers.length * PAX_ROW_H + 4;

        if (y + paxSectionH > doc.page.height - 80) {
            doc.addPage();
            y = MT;
        }

        fillRoundRect(doc, ML, y, CW, paxSectionH, 8, CARD);
        strokeRoundRect(doc, ML, y, CW, paxSectionH, 8, LINE);
        cardHeader(doc, ML + CARD_PAD, y, CW - CARD_PAD * 2, HDR_H, "Pasajeros");
        doc.save().moveTo(ML, y + HDR_H).lineTo(MR, y + HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();

        tableRow(doc, y + HDR_H,
            ["#", "Nombre completo", "Fecha nac.", "Sexo", "Tipo"],
            PAX_COLS, "#fcfaf7", MUTED, true, PAX_HDR_H);

        data.passengers.forEach((p, i) => {
            const bg = i % 2 === 0 ? CARD : BG;
            tableRow(doc, y + HDR_H + PAX_HDR_H + i * PAX_ROW_H,
                [
                    String(i + 1),
                    p.full_name     || "—",
                    p.date_of_birth || "—",
                    genderLabel(p.gender),
                    p.is_minor ? "Menor" : "Adulto",
                ],
                PAX_COLS, bg, INK, false, PAX_ROW_H);
        });

        y += paxSectionH + 12;
    }

    // ── 6. Steps (Qué sigue) ──────────────────────────────────────────────────
    const steps = [
        { num: "1", title: "Validación final de pasajeros",    body: "Si se requiere documentación adicional o validación complementaria, te contactaremos por correo o teléfono." },
        { num: "2", title: "Información previa al embarque",   body: "Antes de tu salida recibirás el punto de encuentro, hora recomendada de llegada y cualquier instrucción operativa relevante." },
        { num: "3", title: "Experiencia Mobius Fly",           body: "Nuestro equipo y el operador verificarán que todo esté listo para tu vuelo en condiciones de seguridad y cumplimiento." },
    ];
    const STEPS_H = 80;

    if (y + STEPS_H > doc.page.height - 80) { doc.addPage(); y = MT; }

    fillRoundRect(doc, ML, y, CW, STEPS_H, 8, CARD);
    strokeRoundRect(doc, ML, y, CW, STEPS_H, 8, LINE);
    cardHeader(doc, ML + CARD_PAD, y, CW - CARD_PAD * 2, HDR_H, "Qué sigue");
    doc.save().moveTo(ML, y + HDR_H).lineTo(MR, y + HDR_H).lineWidth(0.4).strokeColor(LINE).stroke().restore();

    const stepW = (CW - 30) / 3;
    steps.forEach((s, i) => {
        const sx = ML + CARD_PAD + i * (stepW + 5);
        const sy = y + HDR_H + 8;

        // Circle badge
        fillRoundRect(doc, sx, sy, 18, 18, 9, ASOFT);
        doc.font("Helvetica-Bold").fontSize(8).fillColor(ACCENT)
           .text(s.num, sx, sy + 4, { width: 18, align: "center", lineBreak: false });

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK)
           .text(s.title, sx + 22, sy + 2, { width: stepW - 24, lineBreak: false });
        doc.font("Helvetica").fontSize(6.5).fillColor(MUTED)
           .text(s.body, sx + 22, sy + 13, { width: stepW - 24, lineBreak: true });
    });

    y += STEPS_H + 10;

    // ── 7. Legal note ─────────────────────────────────────────────────────────
    const NOTE_H = 38;
    if (y + NOTE_H > doc.page.height - 60) { doc.addPage(); y = MT; }

    fillRoundRect(doc, ML, y, CW, NOTE_H, 8, CARD);
    strokeRoundRect(doc, ML, y, CW, NOTE_H, 8, LINE);
    doc.font("Helvetica").fontSize(6.5).fillColor(MUTED)
       .text(
           "La reserva está sujeta a validación operativa final, disponibilidad efectiva de la aeronave, condiciones de seguridad y cumplimiento regulatorio. En caso de ajustes necesarios, Mobius Fly notificará oportunamente al titular de la reserva conforme a los términos aplicables.",
           ML + CARD_PAD, y + 8,
           { width: CW - CARD_PAD * 2, lineBreak: true },
       );

    y += NOTE_H + 10;

    // ── 8. FBO info strip ─────────────────────────────────────────────────────
    if (data.departureFboName) {
        const FBO_H = 34;
        if (y + FBO_H <= doc.page.height - 60) {
            fillRoundRect(doc, ML, y, CW, FBO_H, 8, ASOFT);
            strokeRoundRect(doc, ML, y, CW, FBO_H, 8, "#ddd0bb");
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK)
               .text("FBO de salida:", ML + CARD_PAD, y + 8, { lineBreak: false });
            doc.font("Helvetica").fontSize(7.5).fillColor(INK)
               .text(`  ${data.departureFboName}`, ML + CARD_PAD + 70, y + 8, { lineBreak: false });

            if (data.arrivalFboName) {
                doc.font("Helvetica-Bold").fontSize(7.5).fillColor(INK)
                   .text("FBO de llegada:", ML + CARD_PAD, y + 20, { lineBreak: false });
                doc.font("Helvetica").fontSize(7.5).fillColor(INK)
                   .text(`  ${data.arrivalFboName}`, ML + CARD_PAD + 70, y + 20, { lineBreak: false });
            }
            y += FBO_H + 10;
        }
    }

    // ── 9. Footer ─────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 28;
    doc.save().moveTo(ML, footerY - 8).lineTo(MR, footerY - 8)
       .lineWidth(0.4).strokeColor(LINE).stroke().restore();

    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text(`Generado el ${data.generatedAt}`, ML, footerY, { width: CW / 2, lineBreak: false });

    doc.font("Helvetica").fontSize(7).fillColor(MUTED)
       .text("Mobius Fly · Vuelos verificados · Pagos seguros · Sin membresías  |  soporte@mobiusfly.com",
            ML, footerY, { width: CW, align: "right", lineBreak: false });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateConfirmationPDF(data: ConfirmationData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size:   "A4",
                margin: 0,
                info: {
                    Title:   `Confirmación ${data.bookingReference}`,
                    Author:  "Mobius Fly",
                    Subject: "Confirmación de Reserva",
                },
            });

            const chunks: Buffer[] = [];
            doc.on("data",  (chunk: Buffer) => chunks.push(chunk));
            doc.on("end",   () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            buildConfirmation(doc, data);
            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
