import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerDashboard } from "@/app/actions/dashboard";
import { DashboardContent } from "./_components/DashboardContent";

export default async function OwnerDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const [dashboardData, docsResult] = await Promise.all([
        getOwnerDashboard(user.id),
        supabase
            .from("user_documents")
            .select("document_status_code:document_status!user_documents_document_status_id_fkey(code)")
            .eq("user_id", user.id)
            .limit(1),
    ]);

    if (!dashboardData) redirect("/login");

    const firstName = (user.user_metadata?.first_name as string | undefined) ?? null;

    const docRow = docsResult.data?.[0] as { document_status_code: { code: string } | null } | undefined;
    const documentStatus = docRow?.document_status_code?.code ?? null;

    return (
        <DashboardContent
            data={dashboardData}
            firstName={firstName}
            documentStatus={documentStatus}
        />
    );
}
