"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Navbar } from "@/components/organisms/Navbar";
import { PassengerNavigationCard } from "@/components/organisms/PassengerNavigationCard";
import {
    PassengerForm,
    type PassengerFormData,
} from "@/components/molecules/PassengerForm";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Select } from "@/components/atoms/Select";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useBookingStore, type StoredPassenger } from "@/store/useBookingStore";
import type { UploadedDocument } from "@/components/molecules/DocumentUpload";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];
const MONTHS_FULL = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
];

function fmtDayDate(iso: string): string {
    const d = new Date(iso);
    return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} de ${MONTHS_FULL[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

function fmtTime(iso: string): string {
    const d = new Date(iso);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m} ${ampm}`;
}

function fmtDuration(minutes: number | null): string {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function fmtPrice(n: number): string {
    return n.toLocaleString("es-MX", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PassengersContentProps {
    flightId: string;
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function PassengersContent({ flightId }: PassengersContentProps) {
    const router = useRouter();
    const { user, logout } = useLocalAuth();
    const store = useBookingStore();

    // ─── Redirect if store is empty (wait for hydration first) ───────────────
    React.useEffect(() => {
        if (!store._hasHydrated) return; // localStorage not loaded yet — wait
        if (!store.flightDetail) {
            router.replace(`/flights/${flightId}?passengers=${store.totalPassengers || 1}`);
        }
    }, [store._hasHydrated, store.flightDetail, store.totalPassengers, flightId, router]);

    // ─── Passenger forms ──────────────────────────────────────────────────────
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [documents, setDocuments] = React.useState<
        Record<number, UploadedDocument>
    >({});
    const [responsibleSelections, setResponsibleSelections] = React.useState<
        Record<number, number>
    >({});
    const [erroredPassengers, setErroredPassengers] = React.useState<
        Set<number>
    >(new Set());

    const activePassenger: StoredPassenger | undefined =
        store.passengers[activeIndex];

    // Build adult name list for the responsible adult selector
    const adultNames: { index: number; label: string }[] = store.passengers
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.slotType === "adult")
        .map(({ p, i }) => ({
            index: i,
            label: p.fullName ?? `Pasajero ${i + 1}`,
        }));

    const handlePassengerSubmit = (data: PassengerFormData) => {
        const documentUrl = documents[activeIndex]?.url ?? "";
        store.updatePassenger(activeIndex, {
            ...data,
            documentUrl,
            isCompleted: true,
        });
        // Clear error state for this passenger
        setErroredPassengers((prev) => {
            const next = new Set(prev);
            next.delete(activeIndex);
            return next;
        });
        // Auto-advance to next incomplete passenger
        const nextIndex = store.passengers.findIndex(
            (p, i) => i > activeIndex && !p.isCompleted,
        );
        if (nextIndex !== -1) {
            setActiveIndex(nextIndex);
        }
    };

    const handleDocumentUpload = (index: number, file: File) => {
        setDocuments((prev) => ({
            ...prev,
            [index]: {
                name: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`,
                url: URL.createObjectURL(file),
            },
        }));
    };

    const handleDocumentRemove = (index: number) => {
        setDocuments((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const [isCreatingReservation, setIsCreatingReservation] = React.useState(false);
    const [reservationError, setReservationError]           = React.useState<string | null>(null);

    const allCompleted =
        store.passengers.length > 0 &&
        store.passengers.every((p) => p.isCompleted);

    const handleNavigatePassenger = (
        groupType: "adult" | "minor",
        index: number,
    ) => {
        // Mark current as errored if not completed
        if (!store.passengers[activeIndex]?.isCompleted) {
            setErroredPassengers((prev) => new Set(prev).add(activeIndex));
        }

        const adults = store.passengers
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => p.slotType === "adult");
        const minors = store.passengers
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => p.slotType === "minor");

        const group = groupType === "adult" ? adults : minors;
        if (group[index]) {
            setActiveIndex(group[index].i);
        }
    };

    const flight = store.flightDetail;
    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : undefined;

    if (!flight) return null;

    // ─── Build nav groups ─────────────────────────────────────────────────────
    const adultPassengers = store.passengers
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.slotType === "adult");
    const minorPassengers = store.passengers
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.slotType === "minor");

    const navAdults = {
        title: `Adultos (${store.adults})`,
        passengers: adultPassengers.map(({ p, i }, idx) => ({
            label: p.fullName ?? `Pasajero ${idx + 1}`,
            isCompleted: p.isCompleted,
            isActive: i === activeIndex,
            hasError: erroredPassengers.has(i),
        })),
    };
    const navMinors = {
        title: `Menores (${store.minors})`,
        passengers: minorPassengers.map(({ p, i }, idx) => ({
            label: p.fullName ?? `Menor ${idx + 1}`,
            isCompleted: p.isCompleted,
            isActive: i === activeIndex,
            hasError: erroredPassengers.has(i),
        })),
    };

    // ─── Passenger form title ─────────────────────────────────────────────────
    const getFormTitle = () => {
        if (!activePassenger) return "Pasajero";
        if (activePassenger.slotType === "adult") {
            const idx = adultPassengers.findIndex(({ i }) => i === activeIndex);
            return `Adulto – Pasajero ${idx + 1}`;
        } else {
            const idx = minorPassengers.findIndex(({ i }) => i === activeIndex);
            return `Menor – Pasajero ${store.adults + idx + 1}`;
        }
    };

    // Default values for active passenger form
    const activeDefaults: Partial<PassengerFormData> = {
        fullName: activePassenger?.fullName,
        sex: activePassenger?.sex,
        dateOfBirth: activePassenger?.dateOfBirth,
        email: activePassenger?.email,
        phone: activePassenger?.phone,
        responsibleName: activePassenger?.responsibleName,
        responsibleRelationship: activePassenger?.responsibleRelationship,
        responsiblePhone: activePassenger?.responsiblePhone,
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

                {/* Header */}
                <m.div
                    {...fadeUp(0)}
                    className={`w-full ${sectionPadding} py-8`}
                >
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<ArrowLeft size={24} />}
                            variant="ghost"
                            size="md"
                            onClick={() => router.back()}
                            aria-label="Volver"
                        />
                        <SectionHeader
                            title="Información de pasajeros"
                            subtitle="Completa los datos requeridos para continuar con tu reserva"
                            size="page"
                        />
                    </div>
                </m.div>

                {/* ─── Passenger forms ───────────────────────────────────────────────── */}
                {store.passengers.length > 0 && (
                    <div
                        className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}
                    >
                        {/* Left — navigation */}
                        <m.div
                            {...fadeUp(0.05)}
                            className="w-full lg:w-[240px] lg:flex-shrink-0"
                        >
                            <PassengerNavigationCard
                                adults={navAdults}
                                minors={navMinors}
                                onPassengerClick={handleNavigatePassenger}
                            />
                        </m.div>

                        {/* Center — form */}
                        <m.div
                            {...fadeUp(0.08)}
                            className="flex-1 min-w-0 flex flex-col gap-4"
                        >
                            {/* Responsible adult selector — only for minor slots */}
                            {activePassenger?.slotType === "minor" && (
                                <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-3">
                                    <h4 className="text-body font-semibold text-text">
                                        Adulto responsable
                                    </h4>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-caption font-medium text-muted">
                                            Selecciona un adulto
                                        </label>
                                        <Select
                                            value={
                                                responsibleSelections[
                                                    activeIndex
                                                ] ?? ""
                                            }
                                            onChange={(e) => {
                                                const idx = parseInt(
                                                    e.target.value,
                                                );
                                                setResponsibleSelections(
                                                    (prev) => ({
                                                        ...prev,
                                                        [activeIndex]: idx,
                                                    }),
                                                );
                                                const adult =
                                                    store.passengers[idx];
                                                if (adult?.fullName) {
                                                    store.updatePassenger(
                                                        activeIndex,
                                                        {
                                                            responsibleName:
                                                                adult.fullName,
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="">
                                                Selecciona un adulto
                                            </option>
                                            {adultNames.map(
                                                ({ index, label }) => (
                                                    <option
                                                        key={index}
                                                        value={index}
                                                    >
                                                        {label}
                                                    </option>
                                                ),
                                            )}
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <PassengerForm
                                key={`passenger-${activeIndex}`}
                                title={getFormTitle()}
                                passengerType={
                                    activePassenger?.slotType ?? "adult"
                                }
                                defaultValues={activeDefaults}
                                document={documents[activeIndex]}
                                onSubmit={handlePassengerSubmit}
                                onDocumentUpload={(file) =>
                                    handleDocumentUpload(activeIndex, file)
                                }
                                onDocumentRemove={() =>
                                    handleDocumentRemove(activeIndex)
                                }
                                submitLabel={
                                    activeIndex < store.passengers.length - 1
                                        ? "Guardar y continuar"
                                        : "Guardar pasajero"
                                }
                            />
                        </m.div>

                        {/* Right — flight summary */}
                        <m.div
                            {...fadeUp(0.1)}
                            className="w-full lg:w-[300px] lg:flex-shrink-0 flex flex-col gap-4"
                        >
                            <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
                                <h3 className="text-body font-semibold text-text">
                                    Resumen de tu vuelo
                                </h3>

                                {/* Route */}
                                <div className="flex items-center gap-2">
                                    <span className="text-h3 font-bold text-text">
                                        {flight.departure_airport.iata_code}
                                    </span>
                                    <span className="text-muted text-small">
                                        →
                                    </span>
                                    <span className="text-h3 font-bold text-text">
                                        {flight.arrival_airport.iata_code}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5 text-small">
                                    <span className="text-text font-medium">
                                        {fmtDayDate(flight.departure_datetime)}
                                    </span>
                                    <span className="text-muted">
                                        {fmtTime(flight.departure_datetime)} –{" "}
                                        {fmtTime(flight.arrival_datetime)}
                                        {flight.duration_minutes
                                            ? ` (${fmtDuration(flight.duration_minutes)})`
                                            : ""}
                                    </span>
                                </div>

                                <TypeBadge variant="neutral">
                                    {flight.flight_type === "ONE_WAY"
                                        ? "Sencillo"
                                        : "Redondo"}
                                </TypeBadge>

                                <div className="w-full h-px bg-border" />

                                {/* Passengers breakdown */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-small">
                                        <span className="text-muted">
                                            Adultos
                                        </span>
                                        <span className="text-text font-medium">
                                            {store.adults}
                                        </span>
                                    </div>
                                    {store.minors > 0 && (
                                        <div className="flex justify-between text-small">
                                            <span className="text-muted">
                                                Menores
                                            </span>
                                            <span className="text-text font-medium">
                                                {store.minors}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full h-px bg-border" />

                                {/* Price */}
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-h3 font-bold text-text">
                                        ${fmtPrice(store.totalPrice)}{" "}
                                        <span className="text-small font-normal text-muted">
                                            MXN
                                        </span>
                                    </span>
                                    {store.purchaseType === "seats" && (
                                        <span className="text-caption text-muted">
                                            por {store.totalPassengers}{" "}
                                            {store.totalPassengers === 1
                                                ? "asiento"
                                                : "asientos"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {reservationError && (
                                <div className="flex items-start gap-2 bg-error/10 border border-error/30 rounded-md p-3">
                                    <AlertTriangle size={16} className="text-error flex-shrink-0 mt-0.5" />
                                    <p className="text-caption text-error">{reservationError}</p>
                                </div>
                            )}
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full"
                                disabled={!allCompleted || isCreatingReservation}
                                isLoading={isCreatingReservation}
                                onClick={async () => {
                                    if (!store.flightDetail || !store.purchaseType) return;
                                    setIsCreatingReservation(true);
                                    setReservationError(null);
                                    try {
                                        const res = await fetch("/api/reservations", {
                                            method:  "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                flightId:       flightId,
                                                purchaseType:   store.purchaseType,
                                                seatsRequested: store.totalPassengers,
                                                basePrice:      store.totalPrice,
                                                passengers:     store.passengers,
                                            }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok) {
                                            setReservationError(data.error ?? "Error al crear la reserva.");
                                            return;
                                        }
                                        store.setReservation(
                                            data.reservationId,
                                            data.bookingReference,
                                            data.blockedUntil,
                                            data.breakdown,
                                        );
                                        router.push(`/flights/${flightId}/payment?reservation_id=${data.reservationId}`);
                                    } catch {
                                        setReservationError("Error de conexión. Por favor intenta de nuevo.");
                                    } finally {
                                        setIsCreatingReservation(false);
                                    }
                                }}
                            >
                                {isCreatingReservation ? "Reservando asientos..." : "Continuar con el pago"}
                            </Button>
                        </m.div>
                    </div>
                )}
            </div>
        </LazyMotion>
    );
}
