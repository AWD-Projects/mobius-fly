import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddAircraftContent } from "./_components/AddAircraftContent";

export default async function AddAircraftPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: owner } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!owner) redirect("/owner/dashboard");

    return <AddAircraftContent ownerId={owner.id} />;
}
