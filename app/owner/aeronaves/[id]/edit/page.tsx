import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAircraftDetail } from "@/app/actions/aircraft";
import { EditAircraftContent } from "./_components/EditAircraftContent";

export default async function EditAircraftPage({
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

    return (
        <EditAircraftContent
            aircraftId={id}
            ownerId={owner.id}
            initial={{
                model:        data.model,
                manufacturer: data.manufacturer ?? "",
                tailNumber:   data.tail_number,
                year:         data.year?.toString() ?? "",
                seats:        data.seats.toString(),
            }}
            documents={data.documents}
        />
    );
}
