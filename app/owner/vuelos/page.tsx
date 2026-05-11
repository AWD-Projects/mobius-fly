import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerFlightList } from "@/app/actions/flights";
import { FlightsListContent } from "./_components/FlightsListContent";

export default async function FlightsListPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const flights = await getOwnerFlightList(user.id);

    return <FlightsListContent flights={flights} ownerId={owner.id} />;
}
