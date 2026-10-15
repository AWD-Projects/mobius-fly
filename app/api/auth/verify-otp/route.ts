/**
 * POST /api/auth/verify-otp
 *
 * Step 5 of the registration flow.
 *
 * What it does (in order):
 *  1. Reads the pending signup record from signup_otps by email.
 *  2. Checks that the OTP has not expired.
 *  3. Hashes the submitted token and compares it with the stored hash.
 *  4. If valid:
 *     a. Creates the auth user in Supabase Auth (email already confirmed).
 *     b. Waits for the DB trigger to create the user_profiles row.
 *     c. Updates user_profiles with the real signup data.
 *     d. Inserts the user_documents record.
 *     e. If userType === "owner", inserts a row into the owners table.
 *     f. Deletes the signup_otps row.
 *  5. Returns { userId, email }.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyOTP, normalizeEmail, MAX_OTP_ATTEMPTS } from "@/lib/otp";
import { decryptSecret } from "@/lib/secret-box";
import { allowed, clientIp, tooManyRequests } from "@/lib/rate-limit-db";

const PENDING_REVIEW_STATUS_ID = "d0309d7b-ec5f-4e01-9a40-7801eb265144";

interface SignupPayload {
    /** Current format: AES-256-GCM token. */
    passwordEnc?: string;
    /** Legacy rows created before encryption was introduced. */
    password?: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    phone?: string | null;
    userType: "buyer" | "owner";
    storagePath: string;
    mimeType: string;
}

export async function POST(request: NextRequest) {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email: rawEmail, token } = (body ?? {}) as { email?: unknown; token?: unknown };

    if (typeof rawEmail !== "string" || typeof token !== "string" || !rawEmail || token.length !== 6) {
        return NextResponse.json(
            { error: "Correo y código de 6 dígitos requeridos" },
            { status: 400 },
        );
    }

    const email = normalizeEmail(rawEmail);

    // Per-IP throttle (the per-OTP attempt counter below is the hard stop).
    if (!(await allowed(`verify-otp:ip:${clientIp(request)}`, 30, 900))) {
        return tooManyRequests();
    }

    const admin = createAdminClient();

    // ── 2. Consume one attempt atomically and read the pending signup row ─────
    // The counter is incremented BEFORE comparing, so parallel requests cannot
    // guess more than MAX_OTP_ATTEMPTS times per issued code.
    const { data: taken, error: fetchError } = await admin.rpc("take_signup_otp_attempt", {
        p_email: email,
        p_max:   MAX_OTP_ATTEMPTS,
    });
    const otpRow = Array.isArray(taken) ? taken[0] : null;

    if (fetchError) {
        console.error("[verify-otp] take_signup_otp_attempt:", fetchError.message);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    if (!otpRow) {
        // No pending signup, or the attempts for this code are exhausted.
        return NextResponse.json(
            { error: "Sesión de registro expirada o sin intentos. Solicita un nuevo código o empieza de nuevo." },
            { status: 422 },
        );
    }

    // ── 3. Check OTP expiry ───────────────────────────────────────────────────
    if (Date.now() > new Date(otpRow.expires_at).getTime()) {
        return NextResponse.json(
            { error: "El código ha expirado. Solicita uno nuevo." },
            { status: 422 },
        );
    }

    // ── 4. Verify OTP hash ────────────────────────────────────────────────────
    if (!verifyOTP(token, otpRow.otp_hash, email)) {
        return NextResponse.json(
            { error: "Código incorrecto. Verifica e intenta de nuevo." },
            { status: 422 },
        );
    }

    // ── 5. OTP is valid — create the auth user ───────────────────────────────
    const pending = otpRow.payload as SignupPayload;
    let password: string;
    try {
        password = pending.passwordEnc ? decryptSecret(pending.passwordEnc) : (pending.password ?? "");
    } catch (err) {
        console.error("[verify-otp] decrypt payload:", err instanceof Error ? err.message : err);
        return NextResponse.json(
            { error: "Sesión de registro inválida. Por favor, empieza de nuevo." },
            { status: 422 },
        );
    }
    if (!password) {
        return NextResponse.json(
            { error: "Sesión de registro inválida. Por favor, empieza de nuevo." },
            { status: 422 },
        );
    }
    const role = pending.userType === "owner" ? "OWNER" : "PASSENGER";

    const { data: authData, error: authError } =
        await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                first_name: pending.firstName,
                last_name: pending.lastName,
                role,
                gender: pending.gender,
                date_of_birth: pending.birthDate,
                phone: pending.phone ?? null,
                nationality: "MX",
            },
        });

    if (authError) {
        if ((authError as { code?: string }).code === "email_exists") {
            return NextResponse.json(
                { error: "Este correo ya está registrado" },
                { status: 409 },
            );
        }
        console.error("[verify-otp] createUser:", authError.message);
        return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const userId = authData.user.id;

    // ── 6. Update user_profiles (trigger created the row on createUser) ────────
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { error: profileError } = await admin
        .from("user_profiles")
        .update({
            first_name: pending.firstName,
            last_name: pending.lastName,
            phone: pending.phone ?? null,
            date_of_birth: pending.birthDate,
            gender: pending.gender,
            nationality: "MX",
            role,
            status: "ACTIVE",
        })
        .eq("id", userId);

    if (profileError) {
        await admin.storage
            .from("identity-documents")
            .remove([pending.storagePath]);
        await admin.auth.admin.deleteUser(userId);
        console.error("[verify-otp] user_profiles update:", profileError.message);
        return NextResponse.json(
            { error: "Error al crear el perfil de usuario" },
            { status: 500 },
        );
    }

    // ── 7. Insert user_documents ──────────────────────────────────────────────
    const { error: docError } = await admin.from("user_documents").insert({
        user_id: userId,
        document_type: "IDENTITY",
        document_url: pending.storagePath,
        document_status_id: PENDING_REVIEW_STATUS_ID,
    });

    if (docError) {
        await admin.storage
            .from("identity-documents")
            .remove([pending.storagePath]);
        await admin.auth.admin.deleteUser(userId);
        console.error("[verify-otp] user_documents insert:", docError.message);
        return NextResponse.json(
            { error: "Error al registrar el documento" },
            { status: 500 },
        );
    }

    // ── 8. Create owners row for owner registrations ──────────────────────────
    if (pending.userType === "owner") {
        const { error: ownerError } = await admin.from("owners").insert({
            user_id: userId,
            status: "PENDING_ONBOARDING",
        });

        if (ownerError) {
            await admin.storage
                .from("identity-documents")
                .remove([pending.storagePath]);
            await admin.auth.admin.deleteUser(userId);
            console.error("[verify-otp] owners insert:", ownerError.message);
            return NextResponse.json(
                { error: "Error al registrar el propietario" },
                { status: 500 },
            );
        }
    }

    // ── 9. Delete the signup_otps row ─────────────────────────────────────────
    await admin.from("signup_otps").delete().eq("email", email);

    // ── 10. Return success ────────────────────────────────────────────────────
    return NextResponse.json({ userId, email }, { status: 200 });
}
