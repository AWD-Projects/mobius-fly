"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { Navbar } from "@/components/organisms/Navbar";
import { UpcomingFlightCard } from "@/components/organisms/UpcomingFlightCard";
import { PastFlightCard } from "@/components/organisms/PastFlightCard";
import type { ReservationListItem, ReservationStatusCode } from "@/types/app.types";

interface MyTripsContentProps {
    upcoming: ReservationListItem[];
    past: ReservationListItem[];
}

const MONTHS_SHORT = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function formatDate(isoString: string): string {
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, "0")} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(isoString: string): string {
    const d = new Date(isoString);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m} ${ampm}`;
}

function formatDuration(minutes: number | null): string {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

type StatusVariant = "confirmed" | "pending" | "cancelled" | "completed";

function getStatusProps(status: ReservationStatusCode): { label: string; variant: StatusVariant } {
    switch (status) {
        case "CONFIRMED": return { label: "Confirmado", variant: "confirmed" };
        case "BLOCKED":   return { label: "Pendiente de pago", variant: "pending" };
        case "CANCELLED": return { label: "Cancelado", variant: "cancelled" };
        case "EXPIRED":   return { label: "Expirada", variant: "cancelled" };
    }
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function MyTripsContent({ upcoming, past }: MyTripsContentProps) {
    const router = useRouter();
    const { user, logout } = useLocalAuth();

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
                    activeHref="/my-trips"
                    onLogoClick={() => router.push("/")}
                    onNavLinkClick={(href) => router.push(href)}
                    onLogoutClick={logout}
                    onMyBookingsClick={() => router.push("/my-trips")}
                />

                {/* Page Header */}
                <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-10`}>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-2xl sm:text-[2rem] font-bold text-text">Mis viajes</h1>
                        <p className="text-small text-muted">
                            Explora tus próximas aventuras y experiencias privadas de vuelo
                        </p>
                    </div>
                </m.div>

                {/* Main Content */}
                <div className={`w-full ${sectionPadding} flex flex-col gap-12 pb-12`}>
                    {/* Upcoming Trips */}
                    <m.section {...fadeUp(0.1)} className="flex flex-col gap-6">
                        <h2 className="text-lg font-semibold text-text">Próximos viajes</h2>
                        {upcoming.length === 0 ? (
                            <p className="text-small text-muted">No tienes viajes próximos.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {upcoming.map((reservation, index) => {
                                    const { flight } = reservation;
                                    const { label, variant } = getStatusProps(reservation.reservation_status);
                                    return (
                                        <m.div key={reservation.id} {...fadeUp(0.15 + index * 0.08)}>
                                            <UpcomingFlightCard
                                                route={`${flight.departure_airport.city} → ${flight.arrival_airport.city}`}
                                                date={formatDate(flight.departure_datetime)}
                                                time={formatTime(flight.departure_datetime)}
                                                duration={formatDuration(flight.duration_minutes)}
                                                status={label}
                                                statusVariant={variant}
                                                imageUrl={flight.aircraft_photo ?? undefined}
                                                onDetailsClick={() => router.push(`/my-trips/${reservation.id}`)}
                                            />
                                        </m.div>
                                    );
                                })}
                            </div>
                        )}
                    </m.section>

                    {/* Past Trips */}
                    <m.section {...fadeUp(0.2)} className="flex flex-col gap-6">
                        <h2 className="text-lg font-semibold text-text">Viajes anteriores</h2>
                        {past.length === 0 ? (
                            <p className="text-small text-muted">No tienes viajes anteriores.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {past.map((reservation, index) => {
                                    const { flight } = reservation;
                                    return (
                                        <m.div key={reservation.id} {...fadeUp(0.25 + index * 0.08)}>
                                            <PastFlightCard
                                                route={`${flight.departure_airport.city} → ${flight.arrival_airport.city}`}
                                                date={formatDate(flight.departure_datetime)}
                                                timeRange={`${formatTime(flight.departure_datetime)} - ${formatTime(flight.arrival_datetime)}`}
                                                status="Completado"
                                                statusVariant="completed"
                                                imageUrl={flight.aircraft_photo ?? undefined}
                                                onDetailsClick={() => router.push(`/my-trips/${reservation.id}`)}
                                            />
                                        </m.div>
                                    );
                                })}
                            </div>
                        )}
                    </m.section>
                </div>
            </div>
        </LazyMotion>
    );
}
