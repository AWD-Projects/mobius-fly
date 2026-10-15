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
import { detectFileType } from "@/lib/file-signature";

// Vercel rejects request bodies above ~4.5 MB before they reach this route.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
    if (!(await allowed(`pax-doc:ip:${clientIp(req)}`, 30, 900))) {
        return tooManyRequests();
    }

    const declared = Number(req.headers.get("content-length") ?? "0");
    if (declared > MAX_BYTES + 512 * 1024) {
        return NextResponse.json({ error: "El archivo excede 4 MB." }, { status: 413 });
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
        return NextResponse.json({ error: "El archivo debe pesar entre 1 byte y 4 MB." }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectFileType(buffer);
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
