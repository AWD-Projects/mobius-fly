"use server";

import { createClient } from "@/lib/supabase/server";
import type { DocumentStatusCode } from "@/types/app.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OwnerRow {
    id: string;
    fleet_name: string | null;
    status: "PENDING_ONBOARDING" | "ACTIVE" | "SUSPENDED";
}

export interface OwnerDocumentRow {
    id: string;
    document_type: "INE" | "PASSPORT";
    document_url: string;
    document_status_id: string;
    rejected_reason: string | null;
    document_status: { code: DocumentStatusCode } | null;
}

export interface OwnerProfileData {
    owner: OwnerRow;
    documents: OwnerDocumentRow[];
}

export interface UserProfileSnapshot {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    country_code: string | null;
    role: string;
    nationality: string;
}

// ─── getOwnerProfile ──────────────────────────────────────────────────────────

export async function getOwnerProfile(
    userId: string,
): Promise<OwnerProfileData | null> {
    const supabase = await createClient();

    const [ownerRes, docsRes] = await Promise.all([
        supabase
            .from("owners")
            .select("id, fleet_name, status")
            .eq("user_id", userId)
            .single(),
        supabase
            .from("user_documents")
            .select(
                "id, document_type, document_url, document_status_id, rejected_reason, document_status(code)",
            )
            .eq("user_id", userId),
    ]);

    if (ownerRes.error || !ownerRes.data) {
        console.error("[getOwnerProfile] owner error:", ownerRes.error?.message);
        return null;
    }

    return {
        owner:     ownerRes.data as OwnerRow,
        documents: (docsRes.data ?? []) as OwnerDocumentRow[],
    };
}

// ─── updateFleetName ──────────────────────────────────────────────────────────

export async function updateFleetName(
    ownerId: string,
    fleetName: string,
): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("owners")
        .update({ fleet_name: fleetName.trim() })
        .eq("id", ownerId);

    if (error) {
        console.error("[updateFleetName] error:", error.message);
        return { error: error.message };
    }

    return { error: null };
}
