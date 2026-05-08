import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCrewMemberDetail } from "@/app/actions/crew";
import { CrewDetailContent } from "./_components/CrewDetailContent";

export default async function CrewDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const data = await getCrewMemberDetail(id, user.id);

    if (!data) notFound();

    return <CrewDetailContent data={data} ownerId={owner.id} />;
}
