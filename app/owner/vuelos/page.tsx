import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerFlightList } from "@/app/actions/flights";
import { getAircraftList } from "@/app/actions/aircraft";
import { getAvailableCrewList } from "@/app/actions/crew";
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

    const [flights, aircraft, crew, airportsRes] = await Promise.all([
        getOwnerFlightList(user.id),
        getAircraftList(user.id),
        getAvailableCrewList(user.id),
        supabase.from("airports").select("iata_code, city").order("iata_code"),
    ]);

    const hasAircraft = aircraft.length > 0;
    const hasCaptain  = crew.some((c) => c.crew_role?.code === "CAPTAIN");
    const airports    = (airportsRes.data ?? []) as { iata_code: string; city: string }[];

    return (
        <FlightsListContent
            flights={flights}
            ownerId={owner.id}
            hasAircraft={hasAircraft}
            hasCaptain={hasCaptain}
            airports={airports}
            aircraftOptions={aircraft.map((a) => ({ id: a.id, model: a.model }))}
        />
    );
}
