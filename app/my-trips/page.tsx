import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserReservations } from "@/app/actions/reservations";
import { MyTripsContent } from "./_components/MyTripsContent";

export default async function MyTripsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { upcoming, past } = await getUserReservations(user.id);

    return <MyTripsContent upcoming={upcoming} past={past} />;
}
