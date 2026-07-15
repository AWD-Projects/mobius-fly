import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllAircraftForManagement } from "@/app/actions/aircraft";
import { AircraftListContent } from "./_components/AircraftListContent";

export default async function AircraftListPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const aircraft = await getAllAircraftForManagement(user.id);

    return <AircraftListContent aircraft={aircraft} ownerId={owner.id} />;
}
