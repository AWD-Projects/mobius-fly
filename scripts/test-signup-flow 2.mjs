/**
 * End-to-end test for the signup flow.
 *
 * Pre-requisites:
 *  1. signup_otps table exists in Supabase (run supabase/migrations/20240101000000_signup_otps.sql)
 *  2. Dev server is running: npm run dev
 *
 * Usage:
 *   node scripts/test-signup-flow.mjs
 */

const BASE = "http://localhost:3000";
const TEST_EMAIL = `e2e-test-${Date.now()}@example.com`;
const FAKE_DOC = Buffer.from("fake-pdf-content").toString("base64");

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

console.log("\n══════════════════════════════════════════════");
console.log("  Signup flow — end-to-end test");
console.log(`  Email: ${TEST_EMAIL}`);
console.log("══════════════════════════════════════════════\n");

// ── SECTION 1: Input validation ───────────────────────────────────────────────
console.log("=== Section 1: Input validation ===");

{
    const r = await post("/api/auth/signup", "not-json");
    // fetch sends it as a string but Content-Type is application/json so it parses
}

{
    const r = await post("/api/auth/signup", {});
    assert("signup: empty body → 400", r.status === 400);
    assert("signup: empty body error message", !!r.data.error);
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

// ── SECTION 2: No-session errors ──────────────────────────────────────────────
console.log("\n=== Section 2: No pending session ===");

{
    const r = await post("/api/auth/verify-otp", {
        email: "nobody@example.com",
        token: "123456",
    });
    assert("verify-otp: no session → 422", r.status === 422);
}

{
    const r = await post("/api/auth/resend-otp", { email: "nobody@example.com" });
    assert("resend-otp: no session → 422", r.status === 422);
}

// ── SECTION 3: Happy path ─────────────────────────────────────────────────────
console.log("\n=== Section 3: Happy path ===");

// Step 4: signup
const signupRes = await post("/api/auth/signup", {
    email: TEST_EMAIL,
    password: "TestPass123!",
    fullName: "Carlos Mendoza",
    birthDate: "1992-05-15",
    gender: "male",
    phone: "+5215512345678",
    userType: "buyer",
    documentBase64: FAKE_DOC,
    documentMimeType: "application/pdf",
    documentFileName: "test-id.pdf",
});

assert("signup → 201", signupRes.status === 201, JSON.stringify(signupRes.data));
assert("signup returns email", signupRes.data.email === TEST_EMAIL);

if (signupRes.status !== 201) {
    console.error("\nCannot continue — signup failed:", signupRes.data);
    console.log("\n⚠️  Make sure signup_otps table exists and Resend key is set.\n");
    process.exit(1);
}

// The OTP is logged to the terminal by the dev server.
// Read it from the dev server log or enter it manually.
console.log("\n  ⚡ OTP is logged in the dev server terminal as:");
console.log(`     [signup] DEV OTP for ${TEST_EMAIL}: XXXXXX`);
console.log("  Enter it below to continue.\n");

// Read OTP from stdin
import { createInterface } from "readline";
const rl = createInterface({ input: process.stdin, output: process.stdout });
const otp = await new Promise((resolve) => {
    rl.question("  Enter OTP from server log: ", (ans) => {
        rl.close();
        resolve(ans.trim());
    });
});

if (!otp || otp.length !== 6) {
    console.error("  Invalid OTP entered. Aborting.");
    process.exit(1);
}

// Step 5: verify-otp with correct code
const verifyRes = await post("/api/auth/verify-otp", {
    email: TEST_EMAIL,
    token: otp,
});

assert("verify-otp (correct) → 200", verifyRes.status === 200, JSON.stringify(verifyRes.data));
assert("verify-otp returns userId", !!verifyRes.data.userId);
assert("verify-otp returns email", verifyRes.data.email === TEST_EMAIL);

const userId = verifyRes.data.userId;

if (verifyRes.status !== 200) {
    console.error("\nCannot continue — verify-otp failed:", verifyRes.data);
    process.exit(1);
}

// ── SECTION 4: Idempotency / cleanup ─────────────────────────────────────────
console.log("\n=== Section 4: Post-verification ===");

// After successful verification, the signup_otps row should be gone
{
    const r = await post("/api/auth/verify-otp", {
        email: TEST_EMAIL,
        token: otp,
    });
    assert("verify-otp: row deleted after success → 422", r.status === 422);
}

// Duplicate signup should fail (email already in auth.users)
{
    const r = await post("/api/auth/signup", {
        email: TEST_EMAIL,
        password: "AnotherPass123!",
        fullName: "Duplicate User",
        birthDate: "1990-01-01",
        gender: "female",
        userType: "buyer",
        documentBase64: FAKE_DOC,
        documentMimeType: "application/pdf",
        documentFileName: "dup.pdf",
    });
    // signup itself succeeds (creates OTP row), the conflict is detected at verify-otp
    // So this test verifies a second signup with the same email creates a new OTP row
    assert("duplicate signup → 201 (new OTP created)", r.status === 201);
}

// Verify with wrong OTP fails on the new row
{
    const r = await post("/api/auth/verify-otp", {
        email: TEST_EMAIL,
        token: "000000",
    });
    // The OTP won't be 000000 so this should fail
    assert("verify-otp: wrong token → 422", r.status === 422);
}

// Clean up: delete the duplicate OTP row
const { createClient } = await import("@supabase/supabase-js");
const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
);

// Clean up auth user created during test
await admin.auth.admin.deleteUser(userId);
// Clean up duplicate signup_otps row if it exists
await admin.from("signup_otps").delete().eq("email", TEST_EMAIL);
console.log(`  ✓ Cleaned up test user ${userId}`);

// ── SECTION 5: Resend OTP flow ────────────────────────────────────────────────
console.log("\n=== Section 5: Resend OTP flow ===");

// Create a new signup session for resend testing
const resendEmail = `resend-test-${Date.now()}@example.com`;

await post("/api/auth/signup", {
    email: resendEmail,
    password: "TestPass123!",
    fullName: "Resend Test",
    birthDate: "1995-01-01",
    gender: "other",
    userType: "owner",
    documentBase64: FAKE_DOC,
    documentMimeType: "image/jpeg",
    documentFileName: "id.jpg",
});

// Resend OTP
{
    const r = await post("/api/auth/resend-otp", { email: resendEmail });
    assert("resend-otp → 200", r.status === 200, JSON.stringify(r.data));
    assert("resend-otp returns ok:true", r.data.ok === true);
}

// Clean up resend test row
await admin.from("signup_otps").delete().eq("email", resendEmail);
// Clean up orphaned storage files
const { data: pendingFiles } = await admin.storage.from("identity-documents").list("pending");
if (pendingFiles && pendingFiles.length > 0) {
    await admin.storage.from("identity-documents").remove(
        pendingFiles.map((f) => `pending/${f.name}`)
    );
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
