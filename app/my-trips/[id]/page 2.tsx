import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getReservationDetail } from "@/app/actions/reservations";
import { TripDetailContent } from "./_components/TripDetailContent";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TripDetailPage({ params }: Props) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const reservation = await getReservationDetail(id, user.id);

    if (!reservation) notFound();

    return <TripDetailContent reservation={reservation} />;
}
