import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAirports } from "@/app/actions/flights";
import { getAircraftList } from "@/app/actions/aircraft";
import { getAvailableCrewList } from "@/app/actions/crew";
import { CreateFlightContent } from "./_components/CreateFlightContent";

export default async function CreateFlightPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    const [airports, aircraft, crew] = await Promise.all([
        getAirports(),
        getAircraftList(user.id),
        getAvailableCrewList(user.id),
    ]);

    const hasAircraft = aircraft.length > 0;
    const hasCaptain  = crew.some((c) => c.crew_role?.code === "CAPTAIN");

    if (!hasAircraft || !hasCaptain) redirect("/owner/vuelos");

    return (
        <CreateFlightContent
            ownerId={owner.id}
            airports={airports}
            aircraft={aircraft}
            crew={crew}
        />
    );
}
