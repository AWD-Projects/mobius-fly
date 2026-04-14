"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Navbar }        from "@/components/organisms/Navbar";
import { Button }        from "@/components/atoms/Button";
import { IconButton }    from "@/components/atoms/IconButton";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { useLocalAuth }  from "@/hooks/useLocalAuth";
import { useBookingStore } from "@/store/useBookingStore";
import type { FlightDetail } from "@/types/app.types";

// ─── Stripe init (outside component to avoid re-creating) ─────────────────────

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_FULL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function fmtDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getUTCDate()} de ${MONTHS_FULL[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

function fmtTime(iso: string): string {
    const d = new Date(iso);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtMXN(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function useCountdown(blockedUntil: string | null): { minutes: number; seconds: number; expired: boolean } {
    const [remaining, setRemaining] = React.useState<number>(() => {
        if (!blockedUntil) return 0;
        return Math.max(0, new Date(blockedUntil).getTime() - Date.now());
    });

    React.useEffect(() => {
        if (!blockedUntil) return;
        const tick = () => {
            const ms = Math.max(0, new Date(blockedUntil).getTime() - Date.now());
            setRemaining(ms);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [blockedUntil]);

    const totalSeconds = Math.floor(remaining / 1000);
    return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
        expired: remaining === 0,
    };
}

// ─── Inner checkout form (must be inside <Elements> provider) ─────────────────

interface CheckoutFormProps {
    expired:          boolean;
    bookingRef:       string;
    totalAmount:      number | undefined;
    onTimerExpired:   () => void;
}

function CheckoutForm({ expired, bookingRef, totalAmount, onTimerExpired }: CheckoutFormProps) {
    const stripe   = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [paymentError, setPaymentError] = React.useState<string | null>(null);

    const handleFinalize = async () => {
        // Check timer first — abort before touching Stripe
        if (expired) {
            onTimerExpired();
            return;
        }

        if (!stripe || !elements) return;

        setIsSubmitting(true);
        setPaymentError(null);

        // Submit the form so Stripe validates fields
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setPaymentError(submitError.message ?? "Por favor revisa los datos de pago.");
            setIsSubmitting(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/thank-you?ref=${bookingRef}`,
            },
        });

        // confirmPayment only returns here if there's an error;
        // on success Stripe redirects to return_url automatically.
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setPaymentError(error.message ?? "Pago fallido. Intenta con otro método de pago.");
            } else {
                setPaymentError("Ocurrió un error inesperado. Por favor intenta de nuevo.");
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <PaymentElement
                id="payment-element"
                options={{ layout: "tabs" }}
            />

            {paymentError && (
                <div className="flex items-start gap-3 bg-error/10 border border-error/30 rounded-md p-3">
                    <AlertTriangle size={16} className="text-error flex-shrink-0 mt-0.5" />
                    <p className="text-small text-error">{paymentError}</p>
                </div>
            )}

            <Button
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={!stripe || !elements || isSubmitting || expired}
                onClick={handleFinalize}
            >
                {isSubmitting
                    ? "Procesando..."
                    : `Finalizar compra${totalAmount ? ` · $${fmtMXN(totalAmount)} MXN` : ""}`}
            </Button>

            <p className="text-caption text-muted text-center">
                Pago procesado de forma segura por Stripe.
            </p>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PaymentContentProps {
    flightId:           string;
    flightDetail:       FlightDetail;
    reservationId:      string | null;
    serverBlockedUntil: string | null;
    wasCancelled:       boolean;
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentContent({ flightId, flightDetail: flight, reservationId, serverBlockedUntil, wasCancelled }: PaymentContentProps) {
    const router           = useRouter();
    const { user, logout } = useLocalAuth();
    const store            = useBookingStore();

    const [clientSecret,  setClientSecret]  = React.useState<string | null>(null);
    const [intentLoading, setIntentLoading] = React.useState(false);
    const [error,         setError]         = React.useState<string | null>(wasCancelled ? "Cancelaste el pago anterior. Tu reserva sigue activa mientras el contador no llegue a cero." : null);

    const activeReservationId = reservationId ?? store.reservationId;
    const activeBookingRef    = store.bookingReference;
    const activeBlockedUntil  = serverBlockedUntil ?? store.blockedUntil;

    const { minutes, seconds, expired } = useCountdown(activeBlockedUntil);

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
        : undefined;

    // Redirect if no active reservation
    React.useEffect(() => {
        if (!store._hasHydrated) return;
        if (!activeReservationId || !store.flightDetail) {
            router.replace(`/flights/${flightId}`);
        }
    }, [store._hasHydrated, activeReservationId, store.flightDetail, flightId, router]);

    // Create PaymentIntent on mount (once reservation and store are ready)
    React.useEffect(() => {
        if (!store._hasHydrated || !activeReservationId || !activeBookingRef || expired) return;
        if (clientSecret || intentLoading) return;

        const purchaseType   = store.purchaseType ?? "seats";
        const seatsRequested = store.totalPassengers;
        const description    =
            purchaseType === "full_aircraft"
                ? `${flight.departure_airport.iata_code} → ${flight.arrival_airport.iata_code} · Avión completo`
                : `${flight.departure_airport.iata_code} → ${flight.arrival_airport.iata_code} · ${seatsRequested} ${seatsRequested === 1 ? "asiento" : "asientos"}`;

        setIntentLoading(true);

        fetch("/api/payments/intent", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reservationId:     activeReservationId,
                flightId,
                bookingReference:  activeBookingRef,
                amountTotalPaid:   store.totalPrice,
                flightDescription: description,
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    if (res.status === 410) {
                        setError("Tu reserva ha expirado. Por favor busca otro vuelo.");
                    } else {
                        setError(data.error ?? "Error al inicializar el pago.");
                    }
                    return;
                }
                setClientSecret(data.clientSecret);
            })
            .catch(() => setError("Error de conexión. Por favor intenta de nuevo."))
            .finally(() => setIntentLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store._hasHydrated, activeReservationId, activeBookingRef]);

    const handleTimerExpired = () => {
        setError("Tiempo agotado. Tu reserva expiró. Por favor busca otro vuelo e intenta de nuevo.");
    };

    const handleSearchAgain = () => {
        const lastSearch = store.lastSearch;
        store.reset();
        if (lastSearch) {
            const qp = new URLSearchParams({
                origin:      lastSearch.origin,
                destination: lastSearch.destination,
                type:        lastSearch.type,
                passengers:  String(lastSearch.passengers),
                page:        "1",
                sort:        "price_asc",
            });
            if (lastSearch.date)       qp.set("date",       lastSearch.date);
            if (lastSearch.returnDate) qp.set("returnDate", lastSearch.returnDate);
            router.push(`/flights?${qp.toString()}`);
        } else {
            router.push("/flights");
        }
    };

    const breakdown = store.breakdown;

    if (!store._hasHydrated || !activeReservationId) return null;

    const elementsOptions = clientSecret
        ? {
              clientSecret,
              appearance: {
                  theme:     "night" as const,
                  variables: {
                      colorPrimary:    "#C4A77D",
                      borderRadius:    "6px",
                      fontFamily:      "inherit",
                  },
              },
          }
        : undefined;

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="min-h-screen bg-background">
                <Navbar
                    isLoggedIn={!!user}
                    userType={user?.role === "OWNER" ? "owner" : "buyer"}
                    userInitials={userInitials}
                    logo={<Image src="/logo/main-logo.svg" alt="Mobius Fly" width={32} height={32} />}
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
                            onClick={() => router.back()}
                            aria-label="Volver"
                        />
                        <SectionHeader
                            title="Confirmar y pagar"
                            subtitle="Revisa tu reserva e ingresa tus datos de pago"
                            size="page"
                        />
                    </div>
                </m.div>

                <div className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}>

                    {/* Left — booking summary */}
                    <m.div {...fadeUp(0.05)} className="flex-1 min-w-0 flex flex-col gap-4">

                        {/* Error banner */}
                        {error && (
                            <div className="flex items-start gap-3 bg-error/10 border border-error/30 rounded-md p-4">
                                <AlertTriangle size={18} className="text-error flex-shrink-0 mt-0.5" />
                                <p className="text-small text-error">{error}</p>
                            </div>
                        )}

                        {/* Cancelled notice */}
                        {wasCancelled && !error && (
                            <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-md p-4">
                                <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                                <p className="text-small text-warning">
                                    Cancelaste el pago. Tu reserva sigue activa mientras el contador no llegue a cero.
                                </p>
                            </div>
                        )}

                        {/* Flight card */}
                        <div className="bg-surface rounded-md border border-border p-5 sm:p-6 flex flex-col gap-4">
                            <h3 className="text-body font-semibold text-text">Detalles del vuelo</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-h2 font-bold text-text">{flight.departure_airport.iata_code}</span>
                                <span className="text-muted">→</span>
                                <span className="text-h2 font-bold text-text">{flight.arrival_airport.iata_code}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-small">
                                <div>
                                    <p className="text-muted mb-0.5">Origen</p>
                                    <p className="text-text font-medium">{flight.departure_airport.city}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Destino</p>
                                    <p className="text-text font-medium">{flight.arrival_airport.city}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Fecha de salida</p>
                                    <p className="text-text font-medium">{fmtDate(flight.departure_datetime)}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Horario</p>
                                    <p className="text-text font-medium">
                                        {fmtTime(flight.departure_datetime)} — {fmtTime(flight.arrival_datetime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Aeronave</p>
                                    <p className="text-text font-medium">{flight.aircraft.manufacturer} {flight.aircraft.model}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Pasajeros</p>
                                    <p className="text-text font-medium">
                                        {store.purchaseType === "full_aircraft"
                                            ? "Avión completo"
                                            : `${store.totalPassengers} ${store.totalPassengers === 1 ? "pasajero" : "pasajeros"}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking reference */}
                        {activeBookingRef && (
                            <div className="bg-surface rounded-md border border-border p-5 flex items-center gap-4">
                                <CheckCircle size={20} className="text-success flex-shrink-0" />
                                <div>
                                    <p className="text-caption text-muted">Referencia de reserva</p>
                                    <p className="text-body font-bold text-text tracking-widest">{activeBookingRef}</p>
                                </div>
                            </div>
                        )}

                        {/* Price breakdown */}
                        {breakdown && (
                            <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-3">
                                <h3 className="text-body font-semibold text-text">Desglose de precios</h3>
                                <div className="flex flex-col gap-2 text-small">
                                    <div className="flex justify-between">
                                        <span className="text-muted">Precio del vuelo</span>
                                        <span className="text-text">${fmtMXN(breakdown.base_price)} MXN</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Cargo por servicio (5%)</span>
                                        <span className="text-text">${fmtMXN(breakdown.mobius_commission_amount)} MXN</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">IVA (16%)</span>
                                        <span className="text-text">${fmtMXN(breakdown.vat_amount_total)} MXN</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Cargo de procesamiento</span>
                                        <span className="text-text">${fmtMXN(breakdown.stripe_fee_amount)} MXN</span>
                                    </div>
                                    <div className="w-full h-px bg-border my-1" />
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-text">Total a pagar</span>
                                        <span className="text-text text-body">${fmtMXN(breakdown.amount_total_paid)} MXN</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </m.div>

                    {/* Right — countdown + payment form */}
                    <m.div
                        {...fadeUp(0.1)}
                        className="w-full lg:w-[380px] lg:flex-shrink-0 flex flex-col gap-4"
                    >
                        {/* Countdown timer */}
                        <div className={`rounded-md border p-5 flex flex-col gap-3 ${
                            expired
                                ? "bg-error/10 border-error/30"
                                : minutes < 3
                                    ? "bg-warning/10 border-warning/30"
                                    : "bg-surface border-border"
                        }`}>
                            <div className="flex items-center gap-2">
                                <Clock
                                    size={16}
                                    className={expired ? "text-error" : minutes < 3 ? "text-warning" : "text-muted"}
                                />
                                <span className={`text-small font-medium ${
                                    expired ? "text-error" : minutes < 3 ? "text-warning" : "text-muted"
                                }`}>
                                    {expired ? "Reserva expirada" : "Tiempo restante para pagar"}
                                </span>
                            </div>

                            {!expired ? (
                                <p className={`text-h1 font-bold tabular-nums ${minutes < 3 ? "text-warning" : "text-text"}`}>
                                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                                </p>
                            ) : (
                                <p className="text-small text-error">
                                    Tu reserva expiró y los asientos han sido liberados.
                                </p>
                            )}

                            {!expired && (
                                <p className="text-caption text-muted">
                                    Los asientos están reservados para ti hasta que el contador llegue a cero.
                                </p>
                            )}
                        </div>

                        {/* Payment form or expired action */}
                        {expired ? (
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full"
                                onClick={handleSearchAgain}
                            >
                                Buscar otro vuelo
                            </Button>
                        ) : (
                            <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
                                <h3 className="text-body font-semibold text-text">Datos de pago</h3>

                                {intentLoading && (
                                    <div className="flex flex-col gap-3 animate-pulse">
                                        <div className="h-10 bg-border rounded-md" />
                                        <div className="h-10 bg-border rounded-md" />
                                        <div className="h-12 bg-border rounded-md" />
                                    </div>
                                )}

                                {!intentLoading && !clientSecret && error && (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full"
                                        onClick={handleSearchAgain}
                                    >
                                        Buscar otro vuelo
                                    </Button>
                                )}

                                {clientSecret && elementsOptions && (
                                    <Elements stripe={stripePromise} options={elementsOptions}>
                                        <CheckoutForm
                                            expired={expired}
                                            bookingRef={activeBookingRef ?? ""}
                                            totalAmount={breakdown?.amount_total_paid}
                                            onTimerExpired={handleTimerExpired}
                                        />
                                    </Elements>
                                )}
                            </div>
                        )}
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}
