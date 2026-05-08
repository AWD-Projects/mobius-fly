import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnerProfile } from "@/app/actions/owner";
import { PerfilContent } from "./_components/PerfilContent";
import type { UserProfileSnapshot } from "@/app/actions/owner";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const data = await getOwnerProfile(user.id);

    if (!data) redirect("/login");

    const userProfile: UserProfileSnapshot = {
        id:           user.id,
        email:        user.email ?? "",
        first_name:   user.user_metadata?.first_name ?? "",
        last_name:    user.user_metadata?.last_name ?? "",
        phone:        user.user_metadata?.phone ?? null,
        country_code: user.user_metadata?.country_code ?? null,
        role:         user.user_metadata?.role ?? "OWNER",
        nationality:  user.user_metadata?.nationality ?? "MX",
    };

    return (
        <PerfilContent
            owner={data.owner}
            documents={data.documents}
            userProfile={userProfile}
        />
    );
}
