/**
 * POST /api/auth/signup
 *
 * Step 4 of the registration flow.
 *
 * What it does (in order):
 *  1. Validates the request body.
 *  2. Uploads the identity document to the 'identity-documents' bucket.
 *  3. Generates a 6-digit OTP, hashes it (SHA-256).
 *  4. Upserts all signup data + OTP hash into the signup_otps DB table.
 *  5. Sends the plain OTP to the user's email via Resend.
 *  6. Returns { email } — the auth user is NOT created yet.
 *
 * The auth user is only created after the OTP is verified in /api/auth/verify-otp.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { generateOTP, hashOTP, OTP_TTL_MINUTES } from "@/lib/otp";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ limit: 5, windowMs: 60_000 });

const GENDER_MAP: Record<string, string> = {
    male: "MALE",
    female: "FEMALE",
    other: "OTHER",
};

export async function POST(request: NextRequest) {
    const limited = limiter(request);
    if (limited) return limited;

    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
        email,
        password,
        fullName,
        birthDate,
        gender,
        phone,
        userType,
        documentBase64,
        documentMimeType,
        documentFileName,
    } = body as {
        email: string;
        password: string;
        fullName: string;
        birthDate: string;
        gender: string;
        phone?: string;
        userType: "buyer" | "owner";
        documentBase64: string;
        documentMimeType: string;
        documentFileName: string;
    };

    if (
        !email ||
        !password ||
        !fullName ||
        !birthDate ||
        !gender ||
        !userType ||
        !documentBase64 ||
        !documentMimeType ||
        !documentFileName
    ) {
        return NextResponse.json(
            { error: "Faltan campos requeridos" },
            { status: 400 },
        );
    }

    const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (!ALLOWED_MIME_TYPES.includes(documentMimeType)) {
        return NextResponse.json(
            { error: "Tipo de archivo no permitido. Solo se aceptan PDF, JPEG o PNG." },
            { status: 422 },
        );
    }

    const fileBuffer = Buffer.from(documentBase64, "base64");
    if (fileBuffer.length > MAX_FILE_SIZE) {
        return NextResponse.json(
            { error: "El archivo excede el tamaño máximo permitido de 10 MB." },
            { status: 422 },
        );
    }

    // ── 2. Derive names ───────────────────────────────────────────────────────
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] ?? "Usuario";
    const lastName = nameParts.slice(1).join(" ") || "Mobius";

    // ── 3. Upload document to storage (temp path — no auth user yet) ──────────
    const admin = createAdminClient();
    const ext = documentFileName.split(".").pop() ?? "bin";

    const { randomUUID } = await import("crypto");
    const tempId = randomUUID();
    const storagePath = `pending/${tempId}.${ext}`;
    const { error: uploadError } = await admin.storage
        .from("identity-documents")
        .upload(storagePath, fileBuffer, {
            contentType: documentMimeType,
            upsert: false,
        });

    if (uploadError) {
        console.error("[signup] storage upload:", uploadError.message);
        return NextResponse.json(
            { error: "Error al subir el documento de identidad" },
            { status: 500 },
        );
    }

    // ── 4. Generate OTP and upsert into signup_otps ───────────────────────────
    // If a previous pending row exists, clean up its orphaned storage file first.
    const { data: existing } = await admin
        .from("signup_otps")
        .select("payload")
        .eq("email", email)
        .maybeSingle();

    if (existing?.payload) {
        const oldPath = (existing.payload as { storagePath?: string }).storagePath;
        if (oldPath) {
            await admin.storage.from("identity-documents").remove([oldPath]);
        }
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    const payload = {
        password,
        firstName,
        lastName,
        birthDate,
        gender: GENDER_MAP[gender] ?? gender,
        phone: phone || null,
        userType,
        storagePath,
        mimeType: documentMimeType,
    };

    const { error: otpError } = await admin
        .from("signup_otps")
        .upsert(
            { email, otp_hash: otpHash, expires_at: expiresAt, payload },
            { onConflict: "email" },
        );

    if (otpError) {
        // Roll back the storage upload
        await admin.storage.from("identity-documents").remove([storagePath]);
        console.error("[signup] signup_otps upsert:", otpError.message);
        return NextResponse.json(
            { error: "Error al iniciar el proceso de registro" },
            { status: 500 },
        );
    }

    // ── 5. Send OTP email via Resend ──────────────────────────────────────────
    if (process.env.NODE_ENV !== "production") {
        console.log(`[signup] DEV OTP for ${email}: ${otp}`);
    }

    // Skip actual email in dev when no real key is configured
    const resendKey = process.env.RESEND_API_KEY ?? "";
    if (process.env.NODE_ENV !== "production" && (!resendKey || resendKey.startsWith("your-"))) {
        return NextResponse.json({ email }, { status: 201 });
    }

    const resend = new Resend(resendKey);

    const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@amoxtli.tech",
        to: email,
        subject: "Tu código de verificación — Mobius Fly",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#F6F6F4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F6F6F4;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520"
             style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#C4A77D;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;letter-spacing:-0.02em;">
              Mobius Fly
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:#39424E;font-size:16px;">Tu código de verificación es</p>
            <p style="margin:0 0 24px;color:#39424E;font-size:48px;font-weight:700;letter-spacing:0.15em;">
              ${otp}
            </p>
            <p style="margin:0;color:#39424E;font-size:14px;opacity:0.7;">
              Este código expira en ${OTP_TTL_MINUTES} minutos.<br>
              Si no solicitaste este código, ignora este mensaje.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#F6F6F4;text-align:center;">
            <p style="margin:0;color:#39424E;font-size:12px;opacity:0.6;">
              © Mobius Fly — Vuelos privados
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailError) {
        // Roll back storage and OTP row
        await admin.storage.from("identity-documents").remove([storagePath]);
        await admin.from("signup_otps").delete().eq("email", email);
        console.error("[signup] resend email:", emailError);
        return NextResponse.json(
            { error: "Error al enviar el código de verificación" },
            { status: 500 },
        );
    }

    // ── 6. Return ─────────────────────────────────────────────────────────────
    return NextResponse.json({ email }, { status: 201 });
}
