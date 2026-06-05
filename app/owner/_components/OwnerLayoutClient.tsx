"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Clock, AlertTriangle, Check, Info } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { OwnerDock } from "@/components/organisms/OwnerDock";

interface OwnerLayoutClientProps {
    children:             React.ReactNode;
    ownerStatus:          string | null;
    onboardingCompleted:  boolean;
    documentStatus:       string | null;
    rejectedReason:       string | null;
}

// ─── Pantalla: sin documento subido ──────────────────────────────────────────

function NoDocumentScreen() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#EDE7DC] flex items-center justify-center">
                <Info className="w-9 h-9 text-[#C39C64]" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[22px] font-semibold text-text">Completa tu registro</h1>
                <p className="text-[13px] text-muted leading-relaxed">
                    Para activar tu cuenta necesitamos verificar tu identidad. Sube tu documento de identidad (INE o Pasaporte) desde tu perfil.
                </p>
            </div>
            <Button
                variant="primary"
                onClick={() => router.push("/owner/perfil")}
                className="w-52"
            >
                Ir a mi perfil
            </Button>
        </div>
    );
}

// ─── Pantalla: cuenta suspendida ─────────────────────────────────────────────

function SuspendedScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                <AlertTriangle className="w-9 h-9 text-[#C62828]" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[22px] font-semibold text-text">Cuenta suspendida</h1>
                <p className="text-[13px] text-muted leading-relaxed">
                    Tu cuenta ha sido suspendida. Para más información o para apelar esta decisión, contáctanos en{" "}
                    <a href="mailto:soporte@mobiusfly.com" className="font-medium text-text underline underline-offset-2">
                        soporte@mobiusfly.com
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

// ─── Pantalla: documento en revisión ─────────────────────────────────────────

function PendingReviewScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FFF8E1] flex items-center justify-center">
                <Clock className="w-9 h-9 text-[#F9A825]" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[22px] font-semibold text-text">Tu cuenta está en revisión</h1>
                <p className="text-[13px] text-muted leading-relaxed">
                    Nuestro equipo está validando tu documentación de identidad. Te notificaremos por correo electrónico en cuanto tu cuenta sea aprobada.
                </p>
                <p className="text-[13px] text-muted leading-relaxed mt-1">
                    Este proceso puede tomar hasta <span className="font-semibold text-text">48 horas hábiles</span>.
                </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">¿Qué sigue?</p>
                <div className="flex flex-col gap-2">
                    {[
                        "Mobius valida tu documento de identidad",
                        "Tu cuenta se activa y puedes registrar tu flota",
                        "Agregas aeronaves y tripulación para aprobación",
                        "Una vez aprobados, puedes publicar vuelos",
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#F0F0F0] text-[11px] font-semibold text-muted flex items-center justify-center flex-shrink-0 mt-px">
                                {i + 1}
                            </span>
                            <span className="text-[13px] text-text">{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Pantalla: documento rechazado ───────────────────────────────────────────

function RejectedDocumentScreen({ reason }: { reason: string | null }) {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                <AlertTriangle className="w-9 h-9 text-[#C62828]" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[22px] font-semibold text-text">Documento rechazado</h1>
                <p className="text-[13px] text-muted leading-relaxed">
                    Tu documento de identidad no pudo ser verificado. Por favor súbelo nuevamente desde tu perfil.
                </p>
                {reason && (
                    <div className="mt-1 px-4 py-3 bg-[#FFEBEE] rounded-lg border border-[#EF9A9A]/40 text-left">
                        <p className="text-[11px] font-semibold text-[#C62828] mb-0.5">Motivo del rechazo</p>
                        <p className="text-[13px] text-[#C62828]/80 leading-snug">{reason}</p>
                    </div>
                )}
            </div>
            <Button
                variant="primary"
                onClick={() => router.push("/owner/perfil")}
                className="w-52"
            >
                Reemplazar documento
            </Button>
        </div>
    );
}

// ─── Pantalla: documento aprobado pero cuenta aún no activada ────────────────

function PendingActivationScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <Check className="w-9 h-9 text-[#2E7D32]" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[22px] font-semibold text-text">Documento aprobado</h1>
                <p className="text-[13px] text-muted leading-relaxed">
                    Tu identidad fue verificada exitosamente. Tu cuenta está siendo activada por nuestro equipo. En breve tendrás acceso completo.
                </p>
                <p className="text-[13px] text-muted leading-relaxed mt-1">
                    Este proceso puede tomar hasta <span className="font-semibold text-text">24 horas hábiles</span>.
                </p>
            </div>
        </div>
    );
}

// ─── Layout client ────────────────────────────────────────────────────────────

export function OwnerLayoutClient({ children, ownerStatus, onboardingCompleted, documentStatus, rejectedReason }: OwnerLayoutClientProps) {
    const { user, isLoggedIn, isHydrated, logout } = useLocalAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isHydrated) return;
        if (!isLoggedIn) {
            router.replace("/login");
            return;
        }
        if (user?.role !== "OWNER") {
            router.replace("/forbidden");
        }
    }, [isHydrated, isLoggedIn, user, router]);

    if (!isHydrated || !isLoggedIn || user?.role !== "OWNER") return null;

    // ── Determinar qué pantalla mostrar ──────────────────────────────────────
    let gate: React.ReactNode = null;

    if (ownerStatus === "SUSPENDED") {
        gate = <SuspendedScreen />;
    } else if (onboardingCompleted && ownerStatus !== "ACTIVE") {
        // La validación solo aplica una vez que el owner completó el onboarding (fleet_name guardado)
        if (!documentStatus) {
            gate = <NoDocumentScreen />;
        } else if (documentStatus === "REJECTED") {
            gate = <RejectedDocumentScreen reason={rejectedReason} />;
        } else if (documentStatus === "APPROVED") {
            gate = <PendingActivationScreen />;
        } else {
            // PENDING_REVIEW u otro estado desconocido
            gate = <PendingReviewScreen />;
        }
    }

    // Perfil siempre accesible aunque esté en PENDING_ONBOARDING
    const isPerfilRoute = pathname.startsWith("/owner/perfil");
    const content = (gate && !isPerfilRoute) ? gate : children;

    return (
        <div className="min-h-screen bg-background">
            <OwnerDock
                activeHref={pathname}
                onNavigate={(href) => router.push(href)}
                onLogout={logout}
            />

            <main className="md:pl-[104px] pb-28 md:pb-0">
                {content}
            </main>
        </div>
    );
}
