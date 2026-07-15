import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCrewList, getCrewRoles } from "@/app/actions/crew";
import { CrewListContent } from "./_components/CrewListContent";

export default async function CrewListPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const [crew, crewRoles] = await Promise.all([
        getCrewList(user.id),
        getCrewRoles(),
    ]);

    return <CrewListContent crew={crew} ownerId={owner.id} crewRoles={crewRoles} />;
}
