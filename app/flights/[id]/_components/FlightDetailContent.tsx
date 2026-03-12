"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Navbar } from "@/components/organisms/Navbar";
import { AircraftCardWithImage } from "@/components/organisms/AircraftCardWithImage";
import { DocumentationInfoCard } from "@/components/organisms/DocumentationInfoCard";
import { FlightPurchaseSidebarCard } from "@/components/organisms/FlightPurchaseSidebarCard";
import { FlightRoute } from "@/components/molecules/FlightRoute";
import { FlightDetailsGrid } from "@/components/molecules/FlightDetailsGrid";
import { CrewMemberRow } from "@/components/molecules/CrewMemberRow";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { IconButton } from "@/components/atoms/IconButton";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useBookingStore } from "@/store/useBookingStore";
import type { FlightDetail } from "@/types/app.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MONTHS_FULL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function fmtDateFull(iso: string): string {
    const d = new Date(iso);
    return `${d.getUTCDate()} de ${MONTHS_FULL[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

function fmtDatetime(iso: string): string {
    const d = new Date(iso);
    const h = d.getUTCHours();
    const min = d.getUTCMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()} · ${h % 12 || 12}:${min} ${ampm}`;
}

function fmtDuration(minutes: number | null): string {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

function getCrewRoleLabel(role: string): string {
    if (role === "CAPTAIN") return "Piloto al mando";
    if (role === "FIRST_OFFICER") return "Copiloto";
    return "Tripulante de cabina";
}

function getCrewAvatarColor(role: string): string {
    return role === "CAPTAIN" ? "var(--color-secondary)" : "var(--color-muted)";
}

function seatsText(available: number): { text: string; className: string } {
    if (available === 0) return { text: "Sin asientos", className: "text-error" };
    if (available <= 3) return { text: `${available} asiento${available !== 1 ? "s" : ""}`, className: "text-warning" };
    return { text: `${available} asientos`, className: "text-success" };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FlightDetailContentProps {
    flightId: string;
    flightDetail: FlightDetail;
    initialPassengers: number;
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function FlightDetailContent({
    flightId,
    flightDetail: flight,
    initialPassengers,
}: FlightDetailContentProps) {
    const router = useRouter();
    const { user, logout } = useLocalAuth();
    const { setFlight, setPurchaseType, setTotalPassengers, setTotalPrice, initPassengers } = useBookingStore();

    const { aircraft, crew } = flight;
    const seats = seatsText(flight.available_seats);
    const isFullAvailable = flight.available_seats === flight.total_seats;

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : undefined;

    const handleContinue = (
        type: "seats" | "full_aircraft",
        totalPax: number,
        totalPrice: number,
        adults: number,
        minors: number
    ) => {
        setFlight(flightId, flight);
        setPurchaseType(type);
        setTotalPassengers(totalPax);
        setTotalPrice(totalPrice);
        initPassengers(adults, minors);
        router.push(`/flights/${flightId}/passengers`);
    };

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-background">
                <Navbar
                    isLoggedIn={!!user}
                    userType={user?.role === "OWNER" ? "owner" : "buyer"}
                    userInitials={userInitials}
                    logo={
                        <Image
                            src="/logo/main-logo.svg"
                            alt="Mobius Fly"
                            width={32}
                            height={32}
                        />
                    }
                    backgroundColor="var(--color-background)"
                    contentPadding={sectionPadding}
                    navLinks={[]}
                    onLogoClick={() => router.push("/")}
                    onNavLinkClick={(href) => router.push(href)}
                    onLogoutClick={logout}
                    onMyBookingsClick={() => router.push("/my-trips")}
                />

                {/* Back + Header */}
                <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-8`}>
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<ArrowLeft size={24} />}
                            variant="ghost"
                            size="md"
                            onClick={() => router.back()}
                            aria-label="Volver"
                        />
                        <SectionHeader
                            title={`${flight.departure_airport.city} → ${flight.arrival_airport.city}`}
                            subtitle={fmtDateFull(flight.departure_datetime)}
                            size="page"
                        />
                    </div>
                </m.div>

                {/* Main — 2 columns */}
                <div
                    className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}
                >
                    {/* Left column */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">

                        {/* Flight route card */}
                        <m.div
                            {...fadeUp(0.05)}
                            className="bg-surface rounded-md border border-border p-5 sm:p-8 flex flex-col gap-6"
                        >
                            <FlightRoute
                                origin={{
                                    code: flight.departure_airport.iata_code,
                                    city: flight.departure_airport.city,
                                    airport: flight.departure_airport.name,
                                }}
                                destination={{
                                    code: flight.arrival_airport.iata_code,
                                    city: flight.arrival_airport.city,
                                    airport: flight.arrival_airport.name,
                                }}
                            />
                            <FlightDetailsGrid
                                columns={3}
                                items={[
                                    {
                                        label: "Salida",
                                        value: fmtDatetime(flight.departure_datetime),
                                    },
                                    {
                                        label: "Disponible",
                                        value: (
                                            <span className={`text-body font-semibold ${seats.className}`}>
                                                {seats.text}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Tipo de vuelo",
                                        value: (
                                            <TypeBadge variant="neutral">
                                                {flight.flight_type === "ONE_WAY" ? "Sencillo" : "Redondo"}
                                            </TypeBadge>
                                        ),
                                    },
                                ]}
                            />
                            {isFullAvailable && (
                                <div className="inline-flex">
                                    <TypeBadge variant="info">Avión completo disponible</TypeBadge>
                                </div>
                            )}
                        </m.div>

                        {/* Aircraft + Crew row */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <m.div {...fadeUp(0.1)} className="flex-1 min-w-0">
                                <AircraftCardWithImage
                                    model={`${aircraft.manufacturer} ${aircraft.model}`}
                                    registration={aircraft.tail_number}
                                    capacity={`${aircraft.seats} pasajeros`}
                                    range={
                                        aircraft.range_km
                                            ? `${aircraft.range_km.toLocaleString("es-MX")} km`
                                            : "—"
                                    }
                                    badgeText="Jet ejecutivo"
                                    badgeVariant="primary"
                                    imageUrl={aircraft.photos[0]}
                                />
                            </m.div>

                            <m.div
                                {...fadeUp(0.12)}
                                className="flex-1 min-w-0 bg-surface rounded-md border border-border p-5 flex flex-col"
                            >
                                <h2 className="text-body font-semibold text-text mb-0">Tripulación</h2>
                                {crew.map((member, index) => (
                                    <CrewMemberRow
                                        key={member.id}
                                        name={`${member.first_name} ${member.last_name}`}
                                        role={getCrewRoleLabel(member.crew_role)}
                                        initials={`${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase()}
                                        avatarColor={getCrewAvatarColor(member.crew_role)}
                                        licenseValue={member.license_number}
                                        showBorder={index < crew.length - 1}
                                    />
                                ))}
                            </m.div>
                        </div>

                        {/* Documentation */}
                        <m.div {...fadeUp(0.15)}>
                            <DocumentationInfoCard
                                title="Documentación"
                                text="Para abordar es necesario presentar INE vigente (ciudadanos mexicanos) o Pasaporte válido (viajes internacionales). Los menores de edad requieren un adulto responsable designado en la reserva."
                            />
                        </m.div>
                    </div>

                    {/* Right column — purchase sidebar */}
                    <m.div
                        {...fadeUp(0.1)}
                        className="w-full lg:w-[360px] lg:flex-shrink-0"
                    >
                        <FlightPurchaseSidebarCard
                            pricePerSeat={flight.price_per_seat}
                            priceFullAircraft={flight.price_full_aircraft}
                            availableSeats={flight.available_seats}
                            totalSeats={flight.total_seats}
                            initialPassengers={initialPassengers}
                            onContinue={handleContinue}
                        />
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}
