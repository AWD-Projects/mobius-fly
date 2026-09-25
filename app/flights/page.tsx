import { Suspense } from "react";
import { searchFlights } from "@/app/actions/flights";
import type { Metadata } from "next";
import { getFlightsListMetadata } from "@/lib/seo/metadata";
import { FlightsContent } from "./_components/FlightsContent";

interface Props {
    searchParams: Promise<{
        origin?: string;
        destination?: string;
        date?: string;
        returnDate?: string;
        type?: string;
        passengers?: string;
        page?: string;
        sort?: string;
    }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const sp = await searchParams;
    const hasFilters = Object.values(sp).some(Boolean);
    return getFlightsListMetadata(
        hasFilters,
        sp.origin?.toUpperCase().slice(0, 3),
        sp.destination?.toUpperCase().slice(0, 3),
    );
}

export default async function FlightsPage({ searchParams }: Props) {
    const sp = await searchParams;

    const params = {
        origin: sp.origin ?? "",
        destination: sp.destination ?? "",
        date: sp.date ?? "",
        returnDate: sp.returnDate,
        type: (sp.type === "round_trip" ? "round_trip" : "one_way") as
            | "one_way"
            | "round_trip",
        passengers: Math.max(1, parseInt(sp.passengers ?? "1") || 1),
        page: Math.max(1, parseInt(sp.page ?? "1") || 1),
        pageSize: 4,
        sortBy: (sp.sort === "price_desc" ? "price_desc" : "price_asc") as
            | "price_asc"
            | "price_desc",
    };

    const initialData = await searchFlights(params);

    return (
        <Suspense>
            <FlightsContent searchState={params} initialData={initialData} />
        </Suspense>
    );
}
