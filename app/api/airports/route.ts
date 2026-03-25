import { NextResponse } from "next/server";
import { getAirports } from "@/lib/supabase/flights";

export async function GET() {
    const airports = await getAirports();
    return NextResponse.json(airports);
}
