import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getFlightById } from "@/app/actions/flights";
import { FlightDetailContent } from "./_components/FlightDetailContent";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export default async function FlightDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { passengers } = await searchParams;

    const flightDetail = await getFlightById(id);

    if (!flightDetail) {
        redirect("/flights");
    }

    return (
        <Suspense>
            <FlightDetailContent
                flightId={id}
                flightDetail={flightDetail}
                initialPassengers={Math.max(1, parseInt(passengers ?? "1") || 1)}
            />
        </Suspense>
    );
}
