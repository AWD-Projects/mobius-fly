import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFlightDetail } from "@/lib/supabase/flights";
import { FlightDetailContent } from "./_components/FlightDetailContent";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export default async function FlightDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { passengers } = await searchParams;
    const flightDetail = await getFlightDetail(id);

    if (!flightDetail) notFound();

    return (
        <Suspense>
            <FlightDetailContent
                flightId={id}
                flightDetail={flightDetail}
                initialPassengers={parseInt(passengers ?? "1")}
            />
        </Suspense>
    );
}
