import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerFlightDetail } from "@/app/actions/flights";
import { getAirports } from "@/app/actions/flights";
import { getAircraftList } from "@/app/actions/aircraft";
import { getCrewList } from "@/app/actions/crew";
import { EditFlightContent } from "./_components/EditFlightContent";

export default async function EditFlightPage({
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

    const [flight, airports, aircraft, crew] = await Promise.all([
        getOwnerFlightDetail(id, user.id),
        getAirports(),
        getAircraftList(user.id),
        getCrewList(user.id),
    ]);

    if (!flight) notFound();

    return (
        <EditFlightContent
            flightId={id}
            ownerId={owner.id}
            initial={flight}
            airports={airports}
            aircraft={aircraft}
            crew={crew}
        />
    );
}
