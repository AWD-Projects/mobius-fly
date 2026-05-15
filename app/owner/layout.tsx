import { createClient } from "@/lib/supabase/server";
import { OwnerLayoutClient } from "./_components/OwnerLayoutClient";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let ownerStatus: string | null = null;
    if (user) {
        const { data: owner } = await supabase
            .from("owners")
            .select("status")
            .eq("user_id", user.id)
            .single();
        ownerStatus = owner?.status ?? null;
    }

    return (
        <OwnerLayoutClient ownerStatus={ownerStatus}>
            {children}
        </OwnerLayoutClient>
    );
}
