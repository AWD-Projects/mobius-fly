import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerDashboard } from "@/app/actions/dashboard";
import { DashboardContent } from "./_components/DashboardContent";

export default async function OwnerDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const data = await getOwnerDashboard(user.id);

    if (!data) redirect("/login");

    const firstName = (user.user_metadata?.first_name as string | undefined) ?? null;

    return <DashboardContent data={data} firstName={firstName} />;
}
