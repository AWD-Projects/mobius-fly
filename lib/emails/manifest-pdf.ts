// ─── Passenger manifest PDF generator (pdfkit) ───────────────────────────────
// Pure Node.js — no React dependency, works in Next.js route handlers.

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

export interface ManifestData {
    flightCode:       string;
    origin:           string;
    destination:      string;
    departureDate:    string;
    departureTime:    string;
    departureFboName: string;
    arrivalFboName:   string | null;
    passengers:       ManifestPassenger[];
    generatedAt:      string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const GOLD  = "#C4A77D";
const DARK  = "#39424E";
const MUTED = "#8A9099";
const CREAM = "#F3F3F1";
const WHITE = "#FFFFFF";

const L = 36;                        // left margin
const R = 559;                       // right edge  (595 - 36)
const W = R - L;                     // content width = 523

// Table column layout  (x positions + widths, must total W)
const COL = {
    num:  { x: L,       w: 18  },
    name: { x: L + 18,  w: 135 },
    type: { x: L + 153, w: 45  },
    gen:  { x: L + 198, w: 52  },
    age:  { x: L + 250, w: 33  },
    doc:  { x: L + 283, w: 47  },
    ref:  { x: L + 330, w: 193 },
};

const ROW_H    = 18;
const HEAD_H   = 22;
const FONT_SM  = 7.5;
const FONT_MD  = 9;
const FONT_LG  = 14;
const FONT_XL  = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// Draw a filled rectangle, then reset fill to DARK
function fillRect(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, h: number, color: string) {
    doc.save().rect(x, y, w, h).fill(color).restore();
}

// Draw a single table row (header or data)
function tableRow(
    doc:    InstanceType<typeof PDFDocument>,
    y:      number,
    cells:  string[],
    bg:     string,
    color:  string,
    bold:   boolean,
    h:      number,
) {
    const cols = Object.values(COL);
    fillRect(doc, L, y, W, h, bg);
    doc.font(bold ? "Helvetica-Bold" : "Helvetica")
       .fontSize(FONT_SM)
       .fillColor(color);

    cells.forEach((text, i) => {
        const col = cols[i];
        if (!col) return;
        const pad = 4;
        doc.text(text ?? "—", col.x + pad, y + (h - FONT_SM) / 2 + 1, {
            width:     col.w - pad * 2,
            height:    h,
            lineBreak: false,
            ellipsis:  true,
        });
    });
}

// ─── Main builder ─────────────────────────────────────────────────────────────

function buildManifest(doc: InstanceType<typeof PDFDocument>, data: ManifestData) {
    let y = 36;

    // ── Header ────────────────────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(FONT_XL).fillColor(GOLD)
       .text("MOBIUS FLY", L, y, { continued: false });

    doc.font("Helvetica-Bold").fontSize(FONT_LG).fillColor(DARK)
       .text("Manifiesto de Pasajeros", L, y + 2, {
           align: "right", width: W,
       });

    // Confidential label below title
    doc.font("Helvetica").fontSize(FONT_SM).fillColor(MUTED)
       .text("USO INTERNO — CONFIDENCIAL", L, y + FONT_LG + 4, {
           align: "right", width: W,
       });

    y += 40;

    // Gold divider
    doc.save().moveTo(L, y).lineTo(R, y).lineWidth(2).strokeColor(GOLD).stroke().restore();
    y += 14;

    // ── Flight info box ───────────────────────────────────────────────────────
    const INFO_ROWS = 2 + (data.arrivalFboName ? 1 : 0);
    const INFO_H    = INFO_ROWS * 20 + 16;
    fillRect(doc, L, y, W, INFO_H, CREAM);

    const infoItems = [
        ["Código de vuelo:", data.flightCode],
        ["Ruta:",            `${data.origin} → ${data.destination}`],
        ["Salida:",          `${data.departureDate}, ${data.departureTime}`],
        ["FBO origen:",      data.departureFboName || "—"],
        ...(data.arrivalFboName ? [["FBO destino:", data.arrivalFboName]] : []),
    ];

    const halfLen = Math.ceil(infoItems.length / 2);
    infoItems.forEach(([label, value], i) => {
        const col  = i < halfLen ? 0 : 1;
        const row  = i < halfLen ? i : i - halfLen;
        const ix   = L + col * (W / 2) + 8;
        const iy   = y + 8 + row * 20;

        doc.font("Helvetica").fontSize(FONT_SM).fillColor(MUTED)
           .text(label, ix, iy, { width: 68, lineBreak: false });

        doc.font("Helvetica-Bold").fontSize(FONT_SM).fillColor(DARK)
           .text(value ?? "—", ix + 70, iy, {
               width: W / 2 - 86, lineBreak: false, ellipsis: true,
           });
    });

    y += INFO_H + 12;

    // ── Passenger count badge ─────────────────────────────────────────────────
    const badgeText = `${data.passengers.length} pasajero${data.passengers.length !== 1 ? "s" : ""} confirmado${data.passengers.length !== 1 ? "s" : ""}`;
    const BADGE_H   = 18;
    const BADGE_W   = doc.font("Helvetica-Bold").fontSize(FONT_SM).widthOfString(badgeText) + 16;
    fillRect(doc, L, y, BADGE_W, BADGE_H, DARK);
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(FONT_SM)
       .text(badgeText, L + 8, y + (BADGE_H - FONT_SM) / 2 + 1, {
           width: BADGE_W - 16, lineBreak: false,
       });
    y += BADGE_H + 10;

    // ── Table header ──────────────────────────────────────────────────────────
    tableRow(doc, y,
        ["#", "Nombre completo", "Tipo", "Género", "Edad", "Doc.", "Referencia"],
        DARK, WHITE, true, HEAD_H,
    );
    y += HEAD_H + 2;

    // ── Passenger rows ────────────────────────────────────────────────────────
    data.passengers.forEach((p, i) => {
        // New page if not enough space (leave 50pt for footer)
        if (y + ROW_H > doc.page.height - 50) {
            doc.addPage();
            y = 36;
            // Repeat table header on new page
            tableRow(doc, y,
                ["#", "Nombre completo", "Tipo", "Género", "Edad", "Doc.", "Referencia"],
                DARK, WHITE, true, HEAD_H,
            );
            y += HEAD_H + 2;
        }

        const bg = i % 2 === 0 ? WHITE : CREAM;
        tableRow(doc, y,
            [
                String(i + 1),
                p.full_name  || "—",
                p.is_minor   ? "Menor" : "Adulto",
                genderLabel(p.gender),
                calcAge(p.date_of_birth),
                p.document_type || "—",
                p.booking_reference,
            ],
            bg, DARK, false, ROW_H,
        );
        y += ROW_H;
    });

    // Bottom border of last row
    doc.save().moveTo(L, y).lineTo(R, y).lineWidth(0.5).strokeColor("#D8DCE0").stroke().restore();

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 32;
    doc.save().moveTo(L, footerY - 8).lineTo(R, footerY - 8)
       .lineWidth(0.5).strokeColor("#D8DCE0").stroke().restore();

    doc.font("Helvetica").fontSize(FONT_SM).fillColor(MUTED)
       .text(`Generado el ${data.generatedAt}`, L, footerY, {
           width: W / 2, lineBreak: false,
       });

    doc.font("Helvetica").fontSize(FONT_SM).fillColor(MUTED)
       .text(`© ${new Date().getFullYear()} Mobius Fly — Todos los derechos reservados`, L, footerY, {
           width: W, align: "right", lineBreak: false,
       });
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
