import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { ThankYouContent } from "./_components/ThankYouContent";

interface Props {
    searchParams: Promise<{ ref?: string }>;
}

export default async function ThankYouPage({ searchParams }: Props) {
    const { ref } = await searchParams;

    if (!ref) notFound();

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("reservations")
        .select(`
            booking_reference,
            seats_requested,
            purchase_type,
            payments (
                amount_total_paid,
                base_price,
                mobius_commission_amount,
                vat_amount_total,
                passenger_fee_amount,
                payer_email,
                status
            ),
            flights (
                departure_datetime,
                arrival_datetime,
                duration_minutes,
                flight_type,
                departure_airport:airports!flights_departure_airport_id_fkey (
                    iata_code,
                    city
                ),
                arrival_airport:airports!flights_arrival_airport_id_fkey (
                    iata_code,
                    city
                ),
                aircrafts (
                    manufacturer,
                    model
                )
            )
        `)
        .eq("booking_reference", ref)
        .single();

    if (error || !data) notFound();

    const payment = Array.isArray(data.payments) ? data.payments[0] : data.payments;
    const flight = Array.isArray(data.flights) ? data.flights[0] : data.flights;
    const depAirport = Array.isArray(flight?.departure_airport) ? flight.departure_airport[0] : flight?.departure_airport;
    const arrAirport = Array.isArray(flight?.arrival_airport) ? flight.arrival_airport[0] : flight?.arrival_airport;
    const aircraft = Array.isArray(flight?.aircrafts) ? flight.aircrafts[0] : flight?.aircrafts;

    return (
        <ThankYouContent
            bookingRef={data.booking_reference}
            seatsRequested={data.seats_requested}
            purchaseType={data.purchase_type as "seats" | "full_aircraft"}
            payment={{
                amountTotalPaid: Number(payment?.amount_total_paid ?? 0),
                basePrice: Number(payment?.base_price ?? 0),
                mobiusCommissionAmount: Number(payment?.mobius_commission_amount ?? 0),
                vatAmountTotal: Number(payment?.vat_amount_total ?? 0),
                passengerFeeAmount: Number(payment?.passenger_fee_amount ?? 0),
                payerEmail: payment?.payer_email ?? "",
            }}
            flight={{
                departureDatetime: flight?.departure_datetime ?? "",
                arrivalDatetime: flight?.arrival_datetime ?? "",
                flightType: (flight?.flight_type ?? "ONE_WAY") as "ONE_WAY" | "ROUND_TRIP",
                departureAirport: {
                    iataCode: depAirport?.iata_code ?? "",
                    city: depAirport?.city ?? "",
                },
                arrivalAirport: {
                    iataCode: arrAirport?.iata_code ?? "",
                    city: arrAirport?.city ?? "",
                },
                aircraft: {
                    manufacturer: aircraft?.manufacturer ?? "",
                    model: aircraft?.model ?? "",
                },
            }}
        />
    );
}
