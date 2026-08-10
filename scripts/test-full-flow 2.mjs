/**
 * Automated end-to-end test for the full auth flow.
 * Reads the OTP from the dev server log automatically.
 * Tests: buyer signup, owner signup, login, owners table row.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const BASE = "http://localhost:3000";
const FAKE_DOC = Buffer.from("fake-pdf-content").toString("base64");
const DEV_LOG = "/tmp/devserver.log";

let pass = 0;
let fail = 0;

function assert(label, condition, extra = "") {
    if (condition) {
        console.log("  ✓", label);
        pass++;
    } else {
        console.error("  ✗", label, extra ? `(${extra})` : "");
        fail++;
    }
}

async function post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return { status: res.status, data };
}

function waitForOTP(email, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        const deadline = Date.now() + timeoutMs;
        const interval = setInterval(() => {
            try {
                const log = readFileSync(DEV_LOG, "utf8");
                const lines = log.split("\n");
                for (const line of lines) {
                    if (line.includes(`DEV OTP for ${email}:`)) {
                        const match = line.match(/:\s*(\d{6})$/);
                        if (match) {
                            clearInterval(interval);
                            resolve(match[1]);
                            return;
                        }
                    }
                }
            } catch { /* log not ready yet */ }
            if (Date.now() > deadline) {
                clearInterval(interval);
                reject(new Error(`OTP for ${email} not found in log within ${timeoutMs}ms`));
            }
        }, 300);
    });
}

const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
);

const ts = Date.now();
const buyerEmail = `buyer-test-${ts}@example.com`;
const ownerEmail = `owner-test-${ts}@example.com`;

console.log("\n══════════════════════════════════════════════");
console.log("  Full auth flow — automated e2e test");
console.log(`  Buyer: ${buyerEmail}`);
console.log(`  Owner: ${ownerEmail}`);
console.log("══════════════════════════════════════════════\n");

let buyerUserId, ownerUserId;

// ── SECTION 1: Input validation ───────────────────────────────────────────────
console.log("=== Section 1: Input validation ===");

{
    const r = await post("/api/auth/signup", {});
    assert("signup: empty body → 400", r.status === 400);
}
{
    const r = await post("/api/auth/verify-otp", {});
    assert("verify-otp: empty body → 400", r.status === 400);
}
{
    const r = await post("/api/auth/verify-otp", { email: "x@y.com", token: "12" });
    assert("verify-otp: short token → 400", r.status === 400);
}
{
    const r = await post("/api/auth/resend-otp", {});
    assert("resend-otp: no email → 400", r.status === 400);
}
{
    const r = await post("/api/auth/verify-otp", { email: "nobody@example.com", token: "123456" });
    assert("verify-otp: no session → 422", r.status === 422);
}
{
    const r = await post("/api/auth/resend-otp", { email: "nobody@example.com" });
    assert("resend-otp: no session → 422", r.status === 422);
}
{
    const r = await post("/api/auth/login", {});
    assert("login: empty body → 400", r.status === 400);
}

// ── SECTION 2: Buyer happy path ───────────────────────────────────────────────
console.log("\n=== Section 2: Buyer registration ===");

{
    const r = await post("/api/auth/signup", {
        email: buyerEmail,
        password: "TestPass123!",
        fullName: "Carlos Comprador",
        birthDate: "1992-05-15",
        gender: "male",
        phone: "+5215512345678",
        userType: "buyer",
        documentBase64: FAKE_DOC,
        documentMimeType: "application/pdf",
        documentFileName: "id.pdf",
    });
    assert("buyer signup → 201", r.status === 201, JSON.stringify(r.data));
    assert("buyer signup returns email", r.data.email === buyerEmail);
}

console.log("  ⏳ Waiting for OTP in dev log...");
const buyerOTP = await waitForOTP(buyerEmail);
console.log(`  ⚡ OTP received: ${buyerOTP}`);

{
    const r = await post("/api/auth/verify-otp", { email: buyerEmail, token: "000000" });
    assert("verify-otp: wrong token → 422", r.status === 422);
}

{
    const r = await post("/api/auth/verify-otp", { email: buyerEmail, token: buyerOTP });
    assert("buyer verify-otp → 200", r.status === 200, JSON.stringify(r.data));
    assert("buyer verify-otp returns userId", !!r.data.userId);
    assert("buyer verify-otp returns email", r.data.email === buyerEmail);
    buyerUserId = r.data.userId;
}

// Verify DB state for buyer
if (buyerUserId) {
    const { data: profile } = await admin.from("user_profiles").select("*").eq("id", buyerUserId).single();
    assert("buyer user_profiles row exists", !!profile);
    assert("buyer role = PASSENGER", profile?.role === "PASSENGER");
    assert("buyer status = ACTIVE", profile?.status === "ACTIVE");
    assert("buyer first_name set", profile?.first_name === "Carlos");
    assert("buyer last_name set", profile?.last_name === "Comprador");

    const { data: doc } = await admin.from("user_documents").select("*").eq("user_id", buyerUserId).single();
    assert("buyer user_documents row exists", !!doc);
    assert("buyer document_type = IDENTITY", doc?.document_type === "IDENTITY");

    const { data: ownerRow } = await admin.from("owners").select("*").eq("user_id", buyerUserId).maybeSingle();
    assert("buyer has NO owners row", ownerRow === null);
}

// OTP row should be deleted
{
    const r = await post("/api/auth/verify-otp", { email: buyerEmail, token: buyerOTP });
    assert("verify-otp: row deleted after success → 422", r.status === 422);
}

// ── SECTION 3: Owner happy path ───────────────────────────────────────────────
console.log("\n=== Section 3: Owner registration ===");

{
    const r = await post("/api/auth/signup", {
        email: ownerEmail,
        password: "OwnerPass456!",
        fullName: "Ana Propietaria",
        birthDate: "1985-11-20",
        gender: "female",
        phone: "+5215598765432",
        userType: "owner",
        documentBase64: FAKE_DOC,
        documentMimeType: "image/jpeg",
        documentFileName: "passport.jpg",
    });
    assert("owner signup → 201", r.status === 201, JSON.stringify(r.data));
}

console.log("  ⏳ Waiting for OTP in dev log...");
const ownerOTP = await waitForOTP(ownerEmail);
console.log(`  ⚡ OTP received: ${ownerOTP}`);

{
    const r = await post("/api/auth/verify-otp", { email: ownerEmail, token: ownerOTP });
    assert("owner verify-otp → 200", r.status === 200, JSON.stringify(r.data));
    assert("owner verify-otp returns userId", !!r.data.userId);
    ownerUserId = r.data.userId;
}

// Verify DB state for owner
if (ownerUserId) {
    const { data: profile } = await admin.from("user_profiles").select("*").eq("id", ownerUserId).single();
    assert("owner user_profiles row exists", !!profile);
    assert("owner role = OWNER", profile?.role === "OWNER");
    assert("owner status = ACTIVE", profile?.status === "ACTIVE");
    assert("owner first_name set", profile?.first_name === "Ana");
    assert("owner last_name set", profile?.last_name === "Propietaria");

    const { data: doc } = await admin.from("user_documents").select("*").eq("user_id", ownerUserId).single();
    assert("owner user_documents row exists", !!doc);

    const { data: ownerRow } = await admin.from("owners").select("*").eq("user_id", ownerUserId).maybeSingle();
    assert("owner HAS owners row", !!ownerRow, JSON.stringify(ownerRow));
    assert("owner status = PENDING_ONBOARDING", ownerRow?.status === "PENDING_ONBOARDING");
    assert("owner fleet_name = null initially", ownerRow?.fleet_name === null);
}

// Step 6: set fleet name (simulates FleetNameStep onContinue)
if (ownerUserId) {
    const r = await fetch(`${BASE}/api/owners/fleet-name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ownerUserId, fleetName: "Aerolineas del Norte" }),
    });
    const data = await r.json();
    assert("fleet-name PATCH → 200", r.status === 200, JSON.stringify(data));

    const { data: ownerRow } = await admin.from("owners").select("fleet_name").eq("user_id", ownerUserId).single();
    assert("fleet_name persisted in DB", ownerRow?.fleet_name === "Aerolineas del Norte");
}

// Validation: fleet-name with missing fields
{
    const r = await fetch(`${BASE}/api/owners/fleet-name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ownerUserId }),
    });
    assert("fleet-name: missing fleetName → 400", r.status === 400);
}

// ── SECTION 4: Login ──────────────────────────────────────────────────────────
console.log("\n=== Section 4: Login ===");

{
    const r = await post("/api/auth/login", { email: "nobody@example.com", password: "Wrong123!" });
    assert("login: wrong creds → 401", r.status === 401);
}

{
    const r = await post("/api/auth/login", { email: buyerEmail, password: "TestPass123!" });
    assert("buyer login → 200", r.status === 200, JSON.stringify(r.data));
    assert("buyer login returns user", !!r.data.user);
    assert("buyer login role = PASSENGER", r.data.user?.role === "PASSENGER");
    assert("buyer login email", r.data.user?.email === buyerEmail);
}

{
    const r = await post("/api/auth/login", { email: ownerEmail, password: "OwnerPass456!" });
    assert("owner login → 200", r.status === 200, JSON.stringify(r.data));
    assert("owner login returns user", !!r.data.user);
    assert("owner login role = OWNER", r.data.user?.role === "OWNER");
}

// ── SECTION 5: Resend OTP flow ────────────────────────────────────────────────
console.log("\n=== Section 5: Resend OTP ===");

const resendEmail = `resend-test-${ts}@example.com`;
await post("/api/auth/signup", {
    email: resendEmail,
    password: "TestPass123!",
    fullName: "Resend Test",
    birthDate: "1995-01-01",
    gender: "other",
    userType: "buyer",
    documentBase64: FAKE_DOC,
    documentMimeType: "application/pdf",
    documentFileName: "id.pdf",
});

{
    const r = await post("/api/auth/resend-otp", { email: resendEmail });
    assert("resend-otp → 200", r.status === 200, JSON.stringify(r.data));
    assert("resend-otp returns ok:true", r.data.ok === true);
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
console.log("\n=== Cleanup ===");

if (buyerUserId) {
    await admin.auth.admin.deleteUser(buyerUserId);
    console.log(`  ✓ Deleted buyer auth user ${buyerUserId}`);
}
if (ownerUserId) {
    await admin.auth.admin.deleteUser(ownerUserId);
    console.log(`  ✓ Deleted owner auth user ${ownerUserId}`);
}
// Clean up resend test
await admin.from("signup_otps").delete().eq("email", resendEmail);

// Clean up pending storage files
const { data: pendingFiles } = await admin.storage.from("identity-documents").list("pending");
if (pendingFiles && pendingFiles.length > 0) {
    await admin.storage.from("identity-documents").remove(pendingFiles.map(f => `pending/${f.name}`));
    console.log(`  ✓ Cleaned up ${pendingFiles.length} pending storage file(s)`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n══════════════════════════════════════════════");
console.log(`  PASS: ${pass}  FAIL: ${fail}`);
if (fail === 0) {
    console.log("  ALL TESTS PASSED ✓");
} else {
    console.log("  SOME TESTS FAILED ✗");
    process.exit(1);
}
console.log("══════════════════════════════════════════════\n");
