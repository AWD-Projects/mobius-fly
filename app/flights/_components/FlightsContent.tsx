"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Navbar } from "@/components/organisms/Navbar";
import { IconButton } from "@/components/atoms/IconButton";
import { FlightListCardSimple } from "@/components/organisms/FlightListCardSimple";
import { FlightListCardRound } from "@/components/organisms/FlightListCardRound";
import { SearchSummaryCard } from "@/components/organisms/SearchSummaryCard";
import { ModifySearchModal, type ModifySearchValues } from "@/components/organisms/ModifySearchModal";
import { Pagination } from "@/components/molecules/Pagination";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import type { FlightListItem, RoundTripPair } from "@/types/app.types";

const FLIGHTS_PER_PAGE = 4;

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function fmtDateShort(iso: string): string {
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parseInt(parts[2])} ${MONTHS[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

interface FlightsContentProps {
    initialFlights?: (FlightListItem | RoundTripPair)[];
}

export function FlightsContent({ initialFlights = [] }: FlightsContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, logout } = useLocalAuth();

    // ─── URL params ───────────────────────────────────────────────────────────
    const origin = searchParams.get("origin") ?? "";
    const destination = searchParams.get("destination") ?? "";
    const date = searchParams.get("date") ?? "";
    const returnDate = searchParams.get("returnDate") ?? undefined;
    const type = (searchParams.get("type") ?? "one_way") as "one_way" | "round_trip";
    const passengers = parseInt(searchParams.get("passengers") ?? "1");

    // ─── Local state ──────────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortAsc, setSortAsc] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // ─── Sorted data — filtering is done server-side in page.tsx ─────────────
    const allFlights: (FlightListItem | RoundTripPair)[] = React.useMemo(() => {
        if (type === "round_trip") {
            return [...initialFlights].sort((a, b) => {
                const pair = a as RoundTripPair;
                const pairB = b as RoundTripPair;
                const priceA = pair.outbound.price_per_seat + pair.inbound.price_per_seat;
                const priceB = pairB.outbound.price_per_seat + pairB.inbound.price_per_seat;
                return sortAsc ? priceA - priceB : priceB - priceA;
            });
        }
        return [...initialFlights].sort((a, b) => {
            const fa = a as FlightListItem;
            const fb = b as FlightListItem;
            return sortAsc ? fa.price_per_seat - fb.price_per_seat : fb.price_per_seat - fa.price_per_seat;
        });
    }, [initialFlights, type, sortAsc]);

    const totalPages = Math.ceil(allFlights.length / FLIGHTS_PER_PAGE);
    const paginated = allFlights.slice(
        (currentPage - 1) * FLIGHTS_PER_PAGE,
        currentPage * FLIGHTS_PER_PAGE
    );

    // Reset page when flight results change (new search from server)
    React.useEffect(() => { setCurrentPage(1); }, [initialFlights]);

    // ─── Navigation helpers ───────────────────────────────────────────────────
    const handleSelectFlight = (flight: FlightListItem) => {
        const qp = new URLSearchParams({ passengers: String(passengers) });
        router.push(`/flights/${flight.id}?${qp.toString()}`);
    };

    const handleSelectPair = (pair: RoundTripPair) => {
        const qp = new URLSearchParams({ passengers: String(passengers) });
        router.push(`/flights/${pair.outbound.id}?${qp.toString()}`);
    };

    const handleModifySearch = (values: ModifySearchValues) => {
        const qp = new URLSearchParams({
            origin: values.origin,
            destination: values.destination,
            date: values.date,
            type: values.type,
            passengers: String(values.passengers),
        });
        if (values.type === "round_trip" && values.returnDate) {
            qp.set("returnDate", values.returnDate);
        }
        router.push(`/flights?${qp.toString()}`);
        setIsModalOpen(false);
    };

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : undefined;

    const pageTitle = origin && destination
        ? `${origin} → ${destination}`
        : "Vuelos disponibles";

    const pageSubtitle = [
        date ? fmtDateShort(date) : null,
        returnDate ? `→ ${fmtDateShort(returnDate)}` : null,
        `${passengers} ${passengers === 1 ? "pasajero" : "pasajeros"}`,
    ]
        .filter(Boolean)
        .join(" · ");

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

                {/* Header */}
                <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-8`}>
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<ArrowLeft size={24} />}
                            variant="ghost"
                            size="md"
                            onClick={() => router.push("/")}
                            aria-label="Volver al inicio"
                        />
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl sm:text-[2rem] font-bold text-text leading-tight">
                                {pageTitle}
                            </h1>
                            {pageSubtitle && (
                                <p className="text-small text-muted font-normal">{pageSubtitle}</p>
                            )}
                        </div>
                    </div>
                </m.div>

                {/* Main content */}
                <div
                    className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}
                >
                    {/* Left — flight list */}
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        {/* Results bar */}
                        <m.div
                            {...fadeUp(0.05)}
                            className="flex items-center justify-between gap-4"
                        >
                            <span className="text-small text-muted font-normal">
                                {allFlights.length}{" "}
                                {allFlights.length === 1 ? "vuelo encontrado" : "vuelos encontrados"}
                            </span>
                            <button
                                onClick={() => setSortAsc((v) => !v)}
                                className="flex items-center gap-1.5 text-small text-muted font-medium hover:text-text transition-colors"
                            >
                                <ArrowUpDown size={14} />
                                Precio {sortAsc ? "↑" : "↓"}
                            </button>
                        </m.div>

                        {/* Cards */}
                        <div className="flex flex-col gap-4">
                            {paginated.map((item, i) => {
                                if (type === "round_trip") {
                                    const pair = item as RoundTripPair;
                                    return (
                                        <m.div key={pair.id} {...fadeUp(0.08 + i * 0.06)}>
                                            <FlightListCardRound
                                                pair={pair}
                                                onSelect={handleSelectPair}
                                            />
                                        </m.div>
                                    );
                                }
                                const flight = item as FlightListItem;
                                return (
                                    <m.div key={flight.id} {...fadeUp(0.08 + i * 0.06)}>
                                        <FlightListCardSimple
                                            flight={flight}
                                            onSelect={handleSelectFlight}
                                        />
                                    </m.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <m.div
                            {...fadeUp(0.2)}
                            className="flex items-center justify-between gap-4 pt-2 flex-wrap"
                        >
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.max(totalPages, 1)}
                                onPageChange={setCurrentPage}
                            />
                            <span className="text-caption text-muted">
                                Mostrando{" "}
                                {(currentPage - 1) * FLIGHTS_PER_PAGE + 1}–
                                {Math.min(currentPage * FLIGHTS_PER_PAGE, allFlights.length)}{" "}
                                de {allFlights.length} vuelos
                            </span>
                        </m.div>
                    </div>

                    {/* Right — search summary sidebar */}
                    <m.div
                        {...fadeUp(0.1)}
                        className="w-full lg:w-[300px] lg:flex-shrink-0"
                    >
                        <SearchSummaryCard
                            origin={origin || "—"}
                            destination={destination || "—"}
                            date={date}
                            returnDate={returnDate}
                            type={type}
                            passengers={passengers}
                            onModify={() => setIsModalOpen(true)}
                        />
                    </m.div>
                </div>

                {/* Modify search modal */}
                <ModifySearchModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialValues={{ origin, destination, date, returnDate, type, passengers }}
                    onSearch={handleModifySearch}
                />
            </div>
        </LazyMotion>
    );
}
