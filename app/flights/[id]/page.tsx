import { Suspense } from "react";
import { getMockFlightDetail } from "@/lib/mock/flights.mock";
import { FlightDetailContent } from "./_components/FlightDetailContent";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export default async function FlightDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { passengers } = await searchParams;
    const flightDetail = getMockFlightDetail(id);

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
