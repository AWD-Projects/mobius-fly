import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAircraftDetail } from "@/app/actions/aircraft";
import { AircraftDetailContent } from "./_components/AircraftDetailContent";

export default async function AircraftDetailPage({
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

    const data = await getAircraftDetail(id, user.id);

    if (!data) notFound();

    return <AircraftDetailContent data={data} ownerId={owner.id} />;
}
