/**
 * GET /api/auth/my-document
 *
 * Returns a signed URL for the current user's identity document so it can be
 * pre-filled in the passenger form without exposing the admin client to the browser.
 */

import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
    // ── Verify session ────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // ── Fetch identity document path ──────────────────────────────────────────
    const { data: doc, error } = await admin
        .from("user_documents")
        .select("document_url")
        .eq("user_id", user.id)
        .eq("document_type", "IDENTITY")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !doc?.document_url) {
        return NextResponse.json({ document: null }, { status: 200 });
    }

    // ── Create a signed URL (1 hour) ──────────────────────────────────────────
    const { data: signed, error: signError } = await admin.storage
        .from("identity-documents")
        .createSignedUrl(doc.document_url, 3600);

    if (signError || !signed?.signedUrl) {
        return NextResponse.json({ document: null }, { status: 200 });
    }

    // Derive a display name from the storage path
    const fileName = doc.document_url.split("/").pop() ?? "documento-identidad";

    return NextResponse.json({
        document: {
            name: fileName,
            size: "",
            url: signed.signedUrl,
            storagePath: doc.document_url,
        },
    });
}
