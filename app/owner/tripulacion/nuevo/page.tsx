import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCrewRoles } from "@/app/actions/crew";
import { AddCrewContent } from "./_components/AddCrewContent";

export default async function AddCrewMemberPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const crewRoles = await getCrewRoles();

    return <AddCrewContent ownerId={owner.id} crewRoles={crewRoles} />;
}
