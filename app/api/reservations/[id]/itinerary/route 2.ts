import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateConfirmationPDF } from "@/lib/emails/confirmation-pdf";

const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function fmtDate(iso: string) {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()}`;
}
function fmtTime(iso: string) {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: row, error } = await admin
        .from("reservations")
        .select(`
            id, booking_reference, seats_requested, purchase_type, base_price_total,
            contact_full_name, contact_email, contact_phone,
            passengers:reservation_passengers (full_name, date_of_birth, gender, document_type, is_minor),
            flight:flights!reservations_flight_id_fkey (
                flight_code, flight_type,
                departure_datetime, arrival_datetime,
                departure_fbo_name, arrival_fbo_name,
                departure_airport:airports!flights_departure_airport_id_fkey (iata_code, city),
                arrival_airport:airports!flights_arrival_airport_id_fkey (iata_code, city),
                aircraft:aircrafts!flights_aircraft_id_fkey (manufacturer, model, tail_number)
            )
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error || !row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const r   = row as any;
    const f   = r.flight;
    const ac  = f.aircraft ?? {};
    const dep = f.departure_airport;
    const arr = f.arrival_airport;

    const pdf = await generateConfirmationPDF({
        bookingReference: r.booking_reference,
        contactFullName:  r.contact_full_name,
        contactEmail:     r.contact_email,
        contactPhone:     r.contact_phone ?? null,
        origin:           `${dep.city} (${dep.iata_code})`,
        destination:      `${arr.city} (${arr.iata_code})`,
        departureDate:    fmtDate(f.departure_datetime),
        departureTime:    fmtTime(f.departure_datetime),
        arrivalTime:      fmtTime(f.arrival_datetime),
        departureFboName: f.departure_fbo_name ?? "",
        arrivalFboName:   f.arrival_fbo_name ?? null,
        flightCode:       f.flight_code ?? "",
        aircraftType:     ac.manufacturer && ac.model ? `${ac.manufacturer} ${ac.model}` : undefined,
        tailNumber:       ac.tail_number ?? undefined,
        flightType:       f.flight_type as "ONE_WAY" | "ROUND_TRIP",
        purchaseType:     r.purchase_type,
        seatsRequested:   r.seats_requested,
        passengers:       (r.passengers ?? []).map((p: any) => ({
            full_name:     p.full_name,
            date_of_birth: p.date_of_birth ?? null,
            gender:        p.gender ?? null,
            is_minor:      p.is_minor ?? false,
            document_type: p.document_type ?? "",
        })),
        amountTotalPaid:  Number(r.base_price_total ?? 0),
        generatedAt:      new Date().toLocaleString("es-MX"),
    });

    return new NextResponse(pdf.buffer as ArrayBuffer, {
        status: 200,
        headers: {
            "Content-Type":        "application/pdf",
            "Content-Disposition": `attachment; filename="itinerario-${r.booking_reference}.pdf"`,
            "Content-Length":      String(pdf.length),
        },
    });
}
