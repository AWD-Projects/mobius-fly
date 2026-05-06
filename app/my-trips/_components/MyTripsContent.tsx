"use client";

import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Plane, CalendarX, History } from "lucide-react";
import { AppNavbar } from "@/components/organisms/AppNavbar";
import { UpcomingFlightCard } from "@/components/organisms/UpcomingFlightCard";
import { PastFlightCard } from "@/components/organisms/PastFlightCard";
import { Button } from "@/components/atoms/Button";
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
    const isEmpty = upcoming.length === 0 && past.length === 0;

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-background flex flex-col">
                <AppNavbar
                    backgroundColor="var(--color-background)"
                    contentPadding={sectionPadding}
                    navLinks={[]}
                    activeHref="/my-trips"
                    onLogoClick={() => router.push("/")}
                    onNavLinkClick={(href) => router.push(href)}
                />

                {isEmpty ? (
                    /* ── Full page empty state ─────────────────────────────── */
                    <m.div
                        {...fadeUp(0)}
                        className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-24 text-center"
                    >
                        {/* Icon */}
                        <div className="relative flex items-center justify-center">
                            <div className="w-28 h-28 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Plane size={48} className="text-secondary -rotate-45" />
                            </div>
                            {/* Decorative ring */}
                            <div className="absolute w-40 h-40 rounded-full border border-dashed border-secondary/20" />
                        </div>

                        {/* Copy */}
                        <div className="flex flex-col gap-3 max-w-sm">
                            <h2 className="text-h3 font-bold text-text">
                                Aún no tienes viajes
                            </h2>
                            <p className="text-small text-muted leading-relaxed">
                                Reserva tu primer vuelo privado y descubre una nueva forma de volar. Comodidad, exclusividad y flexibilidad en cada trayecto.
                            </p>
                        </div>

                        {/* CTA */}
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => router.push("/flights")}
                            icon={<Plane size={18} className="-rotate-45" />}
                            iconPosition="start"
                        >
                            Explorar vuelos disponibles
                        </Button>
                    </m.div>
                ) : (
                    /* ── Normal content ────────────────────────────────────── */
                    <>
                        {/* Page Header */}
                        <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-10`}>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-2xl sm:text-[2rem] font-bold text-text">Mis viajes</h1>
                                <p className="text-small text-muted">
                                    Explora tus próximas aventuras y experiencias privadas de vuelo
                                </p>
                            </div>
                        </m.div>

                        <div className={`w-full ${sectionPadding} flex flex-col gap-12 pb-12`}>
                            {/* Upcoming Trips */}
                            <m.section {...fadeUp(0.1)} className="flex flex-col gap-6">
                                <h2 className="text-lg font-semibold text-text">Próximos viajes</h2>
                                {upcoming.length === 0 ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-md border border-dashed border-border bg-surface/50 p-6">
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                            <CalendarX size={20} className="text-secondary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-small font-medium text-text">No tienes vuelos próximos</p>
                                            <p className="text-caption text-muted mt-0.5">¿Listo para tu próxima aventura?</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="sm:ml-auto w-full sm:w-auto"
                                            onClick={() => router.push("/flights")}
                                        >
                                            Explorar vuelos
                                        </Button>
                                    </div>
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
                                    <div className="flex items-center gap-4 rounded-md border border-dashed border-border bg-surface/50 p-6">
                                        <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center flex-shrink-0">
                                            <History size={20} className="text-muted" />
                                        </div>
                                        <div>
                                            <p className="text-small font-medium text-text">Sin historial de vuelos</p>
                                            <p className="text-caption text-muted mt-0.5">Tus viajes completados aparecerán aquí.</p>
                                        </div>
                                    </div>
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
                    </>
                )}
            </div>
        </LazyMotion>
    );
}
