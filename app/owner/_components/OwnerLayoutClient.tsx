"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { OwnerDock } from "@/components/organisms/OwnerDock";

interface OwnerLayoutClientProps {
    children: React.ReactNode;
    ownerStatus: string | null;
}

function PendingApprovalScreen() {
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

export function OwnerLayoutClient({ children, ownerStatus }: OwnerLayoutClientProps) {
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

    const isPending = ownerStatus === "PENDING_ONBOARDING";

    return (
        <div className="min-h-screen bg-background">
            <OwnerDock
                activeHref={pathname}
                onNavigate={(href) => router.push(href)}
                onLogout={logout}
            />

            <main className="md:pl-[104px] pb-28 md:pb-0">
                {isPending ? <PendingApprovalScreen /> : children}
            </main>
        </div>
    );
}
