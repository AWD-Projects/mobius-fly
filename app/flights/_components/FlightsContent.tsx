"use client";

import * as React from "react";
import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpDown, SearchX } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Navbar } from "@/components/organisms/Navbar";
import { IconButton } from "@/components/atoms/IconButton";
import { FlightListCardSimple } from "@/components/organisms/FlightListCardSimple";
import { FlightListCardRound } from "@/components/organisms/FlightListCardRound";
import { SearchSummaryCard } from "@/components/organisms/SearchSummaryCard";
import { ModifySearchModal, type ModifySearchValues } from "@/components/organisms/ModifySearchModal";
import { Pagination } from "@/components/molecules/Pagination";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useBookingStore } from "@/store/useBookingStore";
import type { FlightListItem, RoundTripPair } from "@/types/app.types";
import type { SearchFlightsParams, SearchFlightsResult } from "@/app/actions/flights";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlightsContentProps {
    searchState: SearchFlightsParams;
    initialData: SearchFlightsResult;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FlightCardsSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="w-full rounded-md border border-border bg-surface p-5 sm:p-6 flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-12 rounded bg-border" />
                            <div className="h-3 w-16 rounded bg-border" />
                            <div className="h-6 w-12 rounded bg-border" />
                        </div>
                        <div className="h-6 w-20 rounded bg-border" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-3">
                            <div className="h-4 w-28 rounded bg-border" />
                            <div className="h-4 w-20 rounded bg-border" />
                        </div>
                        <div className="h-8 w-24 rounded bg-border" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FlightsContent({ searchState, initialData }: FlightsContentProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { user, logout } = useLocalAuth();
    const setLastSearch = useBookingStore((s) => s.setLastSearch);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const {
        origin,
        destination,
        date,
        returnDate,
        type,
        passengers,
        page,
        sortBy,
        pageSize = 4,
    } = searchState;

    const { items, totalCount, totalPages } = initialData;

    // ─── URL builder ─────────────────────────────────────────────────────────

    function buildUrl(overrides: Partial<SearchFlightsParams>): string {
        const merged = { ...searchState, ...overrides };
        const qp = new URLSearchParams({
            origin: merged.origin,
            destination: merged.destination,
            date: merged.date ?? "",
            type: merged.type,
            passengers: String(merged.passengers),
            page: String(merged.page ?? 1),
            sort: merged.sortBy ?? "price_asc",
        });
        if (merged.returnDate) qp.set("returnDate", merged.returnDate);
        return `/flights?${qp.toString()}`;
    }

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleSortToggle = () => {
        const newSort = sortBy === "price_asc" ? "price_desc" : "price_asc";
        startTransition(() => router.push(buildUrl({ sortBy: newSort, page: 1 })));
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => router.push(buildUrl({ page: newPage })));
    };

    const handleSelectFlight = (flight: FlightListItem) => {
        setLastSearch({ origin, destination, date, returnDate, type, passengers });
        const qp = new URLSearchParams({ passengers: String(passengers) });
        router.push(`/flights/${flight.id}?${qp.toString()}`);
    };

    const handleSelectPair = (pair: RoundTripPair) => {
        setLastSearch({ origin, destination, date, returnDate, type, passengers });
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
            page: "1",
            sort: "price_asc",
        });
        if (values.type === "round_trip" && values.returnDate) {
            qp.set("returnDate", values.returnDate);
        }
        setIsModalOpen(false);
        startTransition(() => router.push(`/flights?${qp.toString()}`));
    };

    // ─── Display helpers ──────────────────────────────────────────────────────

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : undefined;

    const pageTitle =
        origin && destination ? `${origin} → ${destination}` : "Vuelos disponibles";

    const pageSubtitle = [
        date ? fmtDateShort(date) : null,
        returnDate ? `→ ${fmtDateShort(returnDate)}` : null,
        `${passengers} ${passengers === 1 ? "pasajero" : "pasajeros"}`,
    ]
        .filter(Boolean)
        .join(" · ");

    const currentPage = page ?? 1;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

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
                    onLoginClick={() => router.push("/login")}
                    onSignUpClick={() => router.push("/register")}
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
                                {totalCount}{" "}
                                {totalCount === 1 ? "vuelo encontrado" : "vuelos encontrados"}
                            </span>
                            <button
                                onClick={handleSortToggle}
                                className="flex items-center gap-1.5 text-small text-muted font-medium hover:text-text transition-colors"
                            >
                                <ArrowUpDown size={14} />
                                Precio {sortBy === "price_asc" ? "↑" : "↓"}
                            </button>
                        </m.div>

                        {/* Skeleton while search is pending */}
                        {isPending && <FlightCardsSkeleton />}

                        {/* Results */}
                        {!isPending && (
                            <>
                                {/* Empty state */}
                                {items.length === 0 && (
                                    <m.div
                                        {...fadeUp(0.1)}
                                        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
                                    >
                                        <SearchX size={40} className="text-muted opacity-40" />
                                        <p className="text-body font-medium text-text">
                                            No encontramos vuelos disponibles
                                        </p>
                                        <p className="text-small text-muted max-w-xs">
                                            Intenta con otras fechas, origen o destino.
                                        </p>
                                    </m.div>
                                )}

                                {/* Cards */}
                                <div className="flex flex-col gap-4">
                                    {items.map((item, i) => {
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
                                {totalPages > 1 && (
                                    <m.div
                                        {...fadeUp(0.2)}
                                        className="flex items-center justify-between gap-4 pt-2 flex-wrap"
                                    >
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                        <span className="text-caption text-muted">
                                            Mostrando {startItem}–{endItem} de {totalCount} vuelos
                                        </span>
                                    </m.div>
                                )}
                            </>
                        )}
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
                    initialValues={{
                        origin,
                        destination,
                        date,
                        returnDate,
                        type,
                        passengers,
                    }}
                    onSearch={handleModifySearch}
                />
            </div>
        </LazyMotion>
    );
}
