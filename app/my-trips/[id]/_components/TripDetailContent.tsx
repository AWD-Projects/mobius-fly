"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { FlightDetailsGrid } from "@/components/molecules/FlightDetailsGrid";
import { FlightRoute } from "@/components/molecules/FlightRoute";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CrewMemberRow } from "@/components/molecules/CrewMemberRow";
import { AircraftCardWithImage } from "@/components/organisms/AircraftCardWithImage";
import { AirportFBOCard } from "@/components/organisms/AirportFBOCard";
import { Navbar } from "@/components/organisms/Navbar";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import type { ReservationDetail } from "@/types/app.types";

interface TripDetailContentProps {
    reservation: ReservationDetail;
}

const MONTHS_FULL = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MONTHS_SHORT = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function formatHeaderDate(isoString: string): string {
    const d = new Date(isoString);
    return `${d.getDate()} de ${MONTHS_FULL[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDatetime(isoString: string): string {
    const d = new Date(isoString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = MONTHS_SHORT[d.getMonth()];
    const year = d.getFullYear();
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${day} ${month} ${year} • ${h % 12 || 12}:${m} ${ampm}`;
}

function formatDuration(minutes: number | null): string {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} horas ${m} minutos` : `${h} horas`;
}

function getCrewRoleLabel(role: string): string {
    if (role === "CAPTAIN") return "Piloto al mando";
    if (role === "FIRST_OFFICER") return "Copiloto";
    return "Tripulante de cabina";
}

function getCrewAvatarColor(role: string): string {
    return role === "CAPTAIN" ? "var(--color-secondary)" : "var(--color-muted)";
}

function getFlightTypeLabel(type: string): string {
    return type === "ONE_WAY" ? "Sencillo" : "Ida y vuelta";
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function TripDetailContent({ reservation }: TripDetailContentProps) {
    const router = useRouter();
    const { user, logout } = useLocalAuth();
    const { flight } = reservation;
    const { aircraft, crew } = flight;

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : "MB";

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-background">
                <Navbar
                    isLoggedIn
                    userType="buyer"
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

                {/* Back + Title */}
                <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-8`}>
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<ArrowLeft size={24} />}
                            variant="ghost"
                            size="md"
                            onClick={() => router.push("/my-trips")}
                            aria-label="Volver a mis viajes"
                        />
                        <SectionHeader
                            title={`${flight.departure_airport.city} → ${flight.arrival_airport.city}`}
                            subtitle={formatHeaderDate(flight.departure_datetime)}
                            size="page"
                        />
                    </div>
                </m.div>

                {/* Main Content — 2 columns */}
                <div className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}>
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                        <m.div {...fadeUp(0.1)} className="bg-surface rounded-md border border-border p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
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
                                items={[
                                    { label: "Fecha de salida", value: formatDatetime(flight.departure_datetime) },
                                    { label: "Fecha de llegada", value: formatDatetime(flight.arrival_datetime) },
                                    { label: "Duración del vuelo", value: formatDuration(flight.duration_minutes) },
                                    {
                                        label: "Tipo de vuelo",
                                        value: (
                                            <TypeBadge variant="neutral">
                                                {getFlightTypeLabel(flight.flight_type)}
                                            </TypeBadge>
                                        ),
                                    },
                                ]}
                            />
                        </m.div>

                        <m.div {...fadeUp(0.15)}>
                            <AirportFBOCard
                                departure={{
                                    airport: `${flight.departure_airport.name} (${flight.departure_airport.iata_code})`,
                                    address: `${flight.departure_airport.city}, ${flight.departure_airport.country}`,
                                    fbo: flight.departure_fbo_name,
                                }}
                                arrival={{
                                    airport: `${flight.arrival_airport.name} (${flight.arrival_airport.iata_code})`,
                                    address: `${flight.arrival_airport.city}, ${flight.arrival_airport.country}`,
                                    fbo: flight.arrival_fbo_name ?? "—",
                                }}
                            />
                        </m.div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-[380px] lg:flex-shrink-0 flex flex-col gap-6">
                        <m.div {...fadeUp(0.2)}>
                            <AircraftCardWithImage
                                model={`${aircraft.manufacturer} ${aircraft.model}`}
                                registration={aircraft.tail_number}
                                capacity={`${aircraft.seats} pasajeros`}
                                range={aircraft.range_km ? `${aircraft.range_km.toLocaleString("es-MX")} km` : "—"}
                                badgeText="Jet ejecutivo"
                                badgeVariant="primary"
                                imageUrl={aircraft.photos[0]}
                            />
                        </m.div>

                        <m.div {...fadeUp(0.25)} className="bg-surface rounded-md border border-border p-6 flex flex-col">
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

                        {reservation.reservation_status === "CONFIRMED" && (
                            <m.div {...fadeUp(0.3)}>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                    icon={<Download size={20} />}
                                    iconPosition="start"
                                >
                                    Descargar itinerario
                                </Button>
                            </m.div>
                        )}
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
}
