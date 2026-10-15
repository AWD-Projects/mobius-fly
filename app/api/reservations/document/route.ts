/**
 * POST /api/reservations/document
 *
 * Uploads ONE passenger identity document (multipart/form-data, field "file")
 * to the private `passenger-documents` bucket and returns its storage path.
 *
 * Guests can buy without an account, so a session is optional:
 *   - signed in  -> `<userId>/<uuid>.<ext>`
 *   - guest      -> `pending/<uuid>.<ext>`
 *
 * The file type is decided by its real bytes (magic numbers), never by the
 * client-sent MIME type or file name.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { allowed, clientIp, tooManyRequests } from "@/lib/rate-limit-db";

const MAX_BYTES = 10 * 1024 * 1024;

function detectType(buf: Buffer): { mime: string; ext: string } | null {
    if (buf.length >= 4 && buf.subarray(0, 4).toString("latin1") === "%PDF") {
        return { mime: "application/pdf", ext: "pdf" };
    }
    if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return { mime: "image/jpeg", ext: "jpg" };
    }
    if (
        buf.length >= 8 &&
        buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        return { mime: "image/png", ext: "png" };
    }
    return null;
}

export async function POST(req: NextRequest) {
    if (!(await allowed(`pax-doc:ip:${clientIp(req)}`, 30, 900))) {
        return tooManyRequests();
    }

    const declared = Number(req.headers.get("content-length") ?? "0");
    if (declared > MAX_BYTES + 1024 * 1024) {
        return NextResponse.json({ error: "El archivo excede 10 MB." }, { status: 413 });
    }

    let form: FormData;
    try {
        form = await req.formData();
    } catch {
        return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Archivo requerido." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
        return NextResponse.json({ error: "El archivo debe pesar entre 1 byte y 10 MB." }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectType(buffer);
    if (!type) {
        return NextResponse.json(
            { error: "Formato no permitido. Sube un PDF, JPG o PNG." },
            { status: 422 },
        );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const folder = user ? user.id : "pending";
    const path = `${folder}/${randomUUID()}.${type.ext}`;

    const admin = createAdminClient();
    const { error } = await admin.storage
        .from("passenger-documents")
        .upload(path, buffer, { contentType: type.mime, upsert: false });

    if (error) {
        console.error("[passenger-document] upload:", error.message);
        return NextResponse.json({ error: "No se pudo subir el documento." }, { status: 500 });
    }

    return NextResponse.json({ path: `passenger-documents:${path}` }, { status: 201 });
}
