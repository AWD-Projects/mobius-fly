"use client";

import * as React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import {
    LayoutDashboard,
    Plane,
    Ticket,
    Users,
    CircleUser,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/atoms/Tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OwnerDockItem = {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
};

export interface OwnerDockProps {
    activeHref?: string;
    logo?: React.ReactNode;
    onNavigate?: (href: string) => void;
    onLogout?: () => void;
    className?: string;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: OwnerDockItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        href: "/owner/dashboard",
        icon: <LayoutDashboard size={22} strokeWidth={1.5} />,
    },
    {
        id: "vuelos",
        label: "Mis Vuelos",
        href: "/owner/vuelos",
        icon: <Plane size={22} strokeWidth={1.5} />,
    },
    {
        id: "manifiestos",
        label: "Manifiestos",
        href: "/owner/manifiestos",
        icon: <Ticket size={22} strokeWidth={1.5} />,
    },
    {
        id: "tripulacion",
        label: "Tripulación",
        href: "/owner/tripulacion",
        icon: <Users size={22} strokeWidth={1.5} />,
    },
    {
        id: "perfil",
        label: "Mi Perfil",
        href: "/owner/perfil",
        icon: <CircleUser size={22} strokeWidth={1.5} />,
    },
];

// ─── DockButton ───────────────────────────────────────────────────────────────

interface DockButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    layoutGroup?: string;
    tooltipPosition?: "right" | "top";
    className?: string;
}

const DockButton = React.memo<DockButtonProps>(({
    label,
    icon,
    isActive,
    onClick,
    layoutGroup = "dock",
    tooltipPosition = "right",
    className,
}) => (
    <Tooltip content={label} position={tooltipPosition}>
        <button
            onClick={onClick}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                    ? "text-primary bg-primary/10"
                    : "text-secondary hover:text-primary hover:bg-primary/8",
                className,
            )}
        >
            {isActive && (
                <m.span
                    layoutId={`${layoutGroup}-active-pill`}
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
            )}
            <span className="relative z-10">{icon}</span>
        </button>
    </Tooltip>
));

DockButton.displayName = "DockButton";

// ─── OwnerDock ────────────────────────────────────────────────────────────────

export const OwnerDock = React.memo<OwnerDockProps>(({
    activeHref,
    logo,
    onNavigate,
    onLogout,
    className,
}) => {
    const handleNavigate = React.useCallback(
        (href: string) => onNavigate?.(href),
        [onNavigate],
    );

    return (
        <LazyMotion features={domAnimation} strict>
            {/* ── Desktop: left floating dock ─────────────────────────── */}
            <nav
                aria-label="Owner navigation"
                className={cn(
                    // Hidden on mobile, shown on md+
                    "hidden md:flex",
                    "fixed left-4 top-1/2 -translate-y-1/2 z-40",
                    "flex-col items-center gap-1",
                    "bg-white rounded-3xl px-3 py-4",
                    "shadow-[0px_4px_24px_rgba(0,0,0,0.10)]",
                    className,
                )}
            >
                {/* Logo */}
                <div className="mb-4 flex items-center justify-center w-11 h-11">
                    {logo ?? (
                        <img
                            src="/logo/main-logo.svg"
                            alt="Mobius Fly"
                            className="w-9 h-9"
                        />
                    )}
                </div>

                {/* Divider */}
                <span className="w-6 h-px bg-neutral mb-3" />

                {/* Nav items */}
                <div className="flex flex-col items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <DockButton
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeHref === item.href}
                            onClick={() => handleNavigate(item.href)}
                            layoutGroup="dock-desktop"
                            tooltipPosition="right"
                        />
                    ))}
                </div>

                {/* Divider */}
                <span className="w-6 h-px bg-neutral mt-3 mb-1" />

                {/* Logout */}
                <Tooltip content="Cerrar sesión" position="right">
                    <button
                        onClick={onLogout}
                        aria-label="Cerrar sesión"
                        className={cn(
                            "flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200",
                            "text-secondary hover:text-error hover:bg-error/8",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error",
                        )}
                    >
                        <LogOut size={22} strokeWidth={1.5} />
                    </button>
                </Tooltip>
            </nav>

            {/* ── Mobile: bottom floating dock ─────────────────────────── */}
            <nav
                aria-label="Owner navigation"
                className={cn(
                    "flex md:hidden",
                    "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40",
                    "items-center gap-1",
                    "bg-white rounded-3xl px-3 py-3",
                    "shadow-[0px_4px_24px_rgba(0,0,0,0.10)]",
                    className,
                )}
            >
                {NAV_ITEMS.map((item) => (
                    <DockButton
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeHref === item.href}
                        onClick={() => handleNavigate(item.href)}
                        layoutGroup="dock-mobile"
                        tooltipPosition="top"
                    />
                ))}

                {/* Logout en mobile */}
                <Tooltip content="Cerrar sesión" position="top">
                    <button
                        onClick={onLogout}
                        aria-label="Cerrar sesión"
                        className={cn(
                            "flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200",
                            "text-secondary hover:text-error hover:bg-error/8",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error",
                        )}
                    >
                        <LogOut size={22} strokeWidth={1.5} />
                    </button>
                </Tooltip>
            </nav>
        </LazyMotion>
    );
});

OwnerDock.displayName = "OwnerDock";
