"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Navbar } from "@/components/organisms/Navbar";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { useLocalAuth } from "@/hooks/useLocalAuth";

const MONTHS_FULL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function fmtDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getUTCDate()} de ${MONTHS_FULL[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

function fmtTime(iso: string): string {
    const d = new Date(iso);
    const h = d.getUTCHours();
    const min = d.getUTCMinutes().toString().padStart(2, "0");
    return `${h % 12 || 12}:${min} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtMXN(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

interface ThankYouContentProps {
    bookingRef: string;
    seatsRequested: number;
    purchaseType: "seats" | "full_aircraft";
    payment: {
        amountTotalPaid: number;
        basePrice: number;
        passengerFeeAmount: number;
        vatAmountTotal: number;
        payerEmail: string;
    };
    flight: {
        departureDatetime: string;
        arrivalDatetime: string;
        flightType: "ONE_WAY" | "ROUND_TRIP";
        departureAirport: { iataCode: string; city: string };
        arrivalAirport: { iataCode: string; city: string };
        aircraft: { manufacturer: string; model: string };
    };
}

export function ThankYouContent({ bookingRef, seatsRequested, purchaseType, payment, flight }: ThankYouContentProps) {
    const router = useRouter();
    const { user, logout } = useLocalAuth();

    const userInitials = user
        ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
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

                <m.div {...fadeUp(0)} className={`w-full ${sectionPadding} py-8`}>
                    <SectionHeader
                        title="¡Pago completado!"
                        subtitle="Tu reserva ha sido confirmada exitosamente"
                        size="page"
                    />
                </m.div>

                <div className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}>

                    {/* Left */}
                    <m.div {...fadeUp(0.05)} className="flex-1 min-w-0 flex flex-col gap-4">

                        {/* Success banner */}
                        <div className="flex items-start gap-3 bg-success/10 border border-success/30 rounded-md p-4">
                            <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-small font-medium text-success">Reserva confirmada</p>
                                <p className="text-small text-success/80 mt-0.5">
                                    Recibirás un correo de confirmación con los detalles de tu vuelo.
                                </p>
                            </div>
                        </div>

                        {/* Booking reference */}
                        <div className="bg-surface rounded-md border border-border p-5 flex items-center gap-4">
                            <CheckCircle size={20} className="text-success flex-shrink-0" />
                            <div>
                                <p className="text-caption text-muted">Referencia de reserva</p>
                                <p className="text-body font-bold text-text tracking-widest">{bookingRef}</p>
                            </div>
                        </div>

                        {/* Flight details */}
                        <div className="bg-surface rounded-md border border-border p-5 sm:p-6 flex flex-col gap-4">
                            <h3 className="text-body font-semibold text-text">Detalles del vuelo</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-h2 font-bold text-text">{flight.departureAirport.iataCode}</span>
                                <span className="text-muted">→</span>
                                <span className="text-h2 font-bold text-text">{flight.arrivalAirport.iataCode}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-small">
                                <div>
                                    <p className="text-muted mb-0.5">Origen</p>
                                    <p className="text-text font-medium">{flight.departureAirport.city}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Destino</p>
                                    <p className="text-text font-medium">{flight.arrivalAirport.city}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Fecha de salida</p>
                                    <p className="text-text font-medium">{fmtDate(flight.departureDatetime)}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Horario</p>
                                    <p className="text-text font-medium">
                                        {fmtTime(flight.departureDatetime)} — {fmtTime(flight.arrivalDatetime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Aeronave</p>
                                    <p className="text-text font-medium">{flight.aircraft.manufacturer} {flight.aircraft.model}</p>
                                </div>
                                <div>
                                    <p className="text-muted mb-0.5">Pasajeros</p>
                                    <p className="text-text font-medium">
                                        {purchaseType === "full_aircraft"
                                            ? "Avión completo"
                                            : `${seatsRequested} ${seatsRequested === 1 ? "pasajero" : "pasajeros"}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-3">
                            <h3 className="text-body font-semibold text-text">Desglose de precios</h3>
                            <div className="flex flex-col gap-2 text-small">
                                <div className="flex justify-between">
                                    <span className="text-muted">Precio del vuelo</span>
                                    <span className="text-text">${fmtMXN(payment.basePrice)} MXN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Cargo por servicio (5%)</span>
                                    <span className="text-text">${fmtMXN(payment.passengerFeeAmount)} MXN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">IVA (16%)</span>
                                    <span className="text-text">${fmtMXN(payment.vatAmountTotal)} MXN</span>
                                </div>
                                <div className="w-full h-px bg-border my-1" />
                                <div className="flex justify-between font-semibold">
                                    <span className="text-text">Total pagado</span>
                                    <span className="text-text text-body">${fmtMXN(payment.amountTotalPaid)} MXN</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-1">
                            <p className="text-caption text-muted">Método de pago</p>
                            <p className="text-small text-text font-medium">Tarjeta de crédito / débito</p>
                            <p className="text-caption text-muted">Procesado de forma segura por Stripe</p>
                        </div>
                    </m.div>

                    {/* Right — CTAs */}
                    <m.div {...fadeUp(0.1)} className="w-full lg:w-[320px] lg:flex-shrink-0 flex flex-col gap-4">
                        <div className="bg-surface rounded-md border border-border p-6 flex flex-col gap-5 text-center">
                            <div className="flex flex-col gap-1">
                                <p className="text-body font-semibold text-text">¿Qué sigue?</p>
                                <p className="text-small text-muted">
                                    {user
                                        ? "Puedes ver el estado de tu reserva en Mis Viajes."
                                        : "Crea una cuenta para rastrear tus reservas y gestionar tus viajes."}
                                </p>
                            </div>

                            {user ? (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                    icon={<ArrowRight size={18} />}
                                    iconPosition="end"
                                    onClick={() => router.push("/my-trips")}
                                >
                                    Ver mis viajes
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full"
                                        icon={<ArrowRight size={18} />}
                                        iconPosition="end"
                                        onClick={() => router.push("/register")}
                                    >
                                        Crear cuenta
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                        onClick={() => router.push("/login")}
                                    >
                                        Iniciar sesión
                                    </Button>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="md"
                                className="w-full"
                                onClick={() => router.push("/")}
                            >
                                Buscar más vuelos
                            </Button>
                        </div>
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}
