import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCrewMemberDetail, getCrewRoles } from "@/app/actions/crew";
import { EditCrewContent } from "./_components/EditCrewContent";

export default async function EditCrewMemberPage({
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

    const [member, crewRoles] = await Promise.all([
        getCrewMemberDetail(id, user.id),
        getCrewRoles(),
    ]);

    if (!member) notFound();

    return (
        <EditCrewContent
            crewId={id}
            ownerId={owner.id}
            crewRoles={crewRoles}
            initial={{
                firstName:     member.first_name,
                lastName:      member.last_name,
                crewRoleId:    member.crew_role?.id ?? "",
                licenseNumber: member.license_number ?? "",
                phone:         member.phone ?? "",
            }}
        />
    );
}
