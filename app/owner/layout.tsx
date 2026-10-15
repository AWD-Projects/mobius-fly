import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { privateMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import { OwnerLayoutClient } from "./_components/OwnerLayoutClient";

export const metadata: Metadata = privateMetadata("Panel de propietario");

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let ownerStatus: string | null = null;
    let onboardingCompleted = false;
    let documentStatus: string | null = null;
    let rejectedReason: string | null = null;

    if (user) {
        const { data: owner, error: ownerError } = await supabase
            .from("owners")
            .select("status, fleet_name")
            .eq("user_id", user.id)
            .maybeSingle();

        // Signed in but not an owner (e.g. a passenger): deny on the server too,
        // not only in the client layout. A transient query error is not a denial.
        if (!owner && !ownerError) redirect("/forbidden");

        ownerStatus = owner?.status ?? null;
        onboardingCompleted = !!owner?.fleet_name;

        if (onboardingCompleted && ownerStatus === "PENDING_ONBOARDING") {
            const { data: docs } = await supabase
                .from("user_documents")
                .select("document_status_code:document_status!user_documents_document_status_id_fkey(code), rejected_reason")
                .eq("user_id", user.id)
                .limit(1);

            if (docs && docs.length > 0) {
                const row = docs[0] as unknown as { document_status_code: { code: string } | null; rejected_reason: string | null };
                documentStatus = row.document_status_code?.code ?? null;
                rejectedReason = row.rejected_reason;
            }
        }
    }

    return (
        <OwnerLayoutClient
            ownerStatus={ownerStatus}
            onboardingCompleted={onboardingCompleted}
            documentStatus={documentStatus}
            rejectedReason={rejectedReason}
        >
            {children}
        </OwnerLayoutClient>
    );
}
