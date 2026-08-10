import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getFlightById } from "@/app/actions/flights";
import { createAdminClient } from "@/lib/supabase/server";
import { PaymentContent } from "./_components/PaymentContent";

interface Props {
    params:       Promise<{ id: string }>;
    searchParams: Promise<{ reservation_id?: string; cancelled?: string }>;
}

export default async function PaymentPage({ params, searchParams }: Props) {
    const { id }                        = await params;
    const { reservation_id, cancelled } = await searchParams;

    const flightDetail = await getFlightById(id);
    if (!flightDetail) redirect("/flights");

    // Fetch blocked_until from DB so the client countdown uses server time,
    // not the client clock (avoids time-skew issues of up to several minutes).
    let serverBlockedUntil: string | null = null;
    if (reservation_id) {
        const supabase = createAdminClient();
        const { data } = await supabase
            .from("reservations")
            .select("blocked_until")
            .eq("id", reservation_id)
            .single();
        serverBlockedUntil = data?.blocked_until ?? null;
    }

    return (
        <Suspense>
            <PaymentContent
                flightId={id}
                flightDetail={flightDetail}
                reservationId={reservation_id ?? null}
                serverBlockedUntil={serverBlockedUntil}
                wasCancelled={cancelled === "1"}
            />
        </Suspense>
    );
}
