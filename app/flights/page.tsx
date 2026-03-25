import { Suspense } from "react";
import { getFlights, getRoundTripFlights } from "@/lib/supabase/flights";
import { FlightsContent } from "./_components/FlightsContent";
import type { FlightListItem, RoundTripPair } from "@/types/app.types";

interface Props {
    searchParams: Promise<{
        origin?: string;
        destination?: string;
        date?: string;
        returnDate?: string;
        type?: string;
        passengers?: string;
    }>;
}

export default async function FlightsPage({ searchParams }: Props) {
    const params = await searchParams;
    const type = params.type === "round_trip" ? "round_trip" : "one_way";
    const passengers = parseInt(params.passengers ?? "1");

    const fetchParams = {
        origin: params.origin,
        destination: params.destination,
        date: params.date,
        returnDate: params.returnDate,
        passengers,
    };

    let initialFlights: (FlightListItem | RoundTripPair)[] = [];

    if (type === "round_trip") {
        initialFlights = await getRoundTripFlights(fetchParams);
    } else {
        initialFlights = await getFlights(fetchParams);
    }

    return (
        <Suspense>
            <FlightsContent initialFlights={initialFlights} />
        </Suspense>
    );
}
