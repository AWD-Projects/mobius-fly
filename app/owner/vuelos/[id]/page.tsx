import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerFlightDetail } from "@/app/actions/flights";
import { FlightDetailContent } from "./_components/FlightDetailContent";

export default async function FlightDetailPage({
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

    const data = await getOwnerFlightDetail(id, user.id);

    if (!data) notFound();

    return <FlightDetailContent data={data} ownerId={owner.id} />;
}
