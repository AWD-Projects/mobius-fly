import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OwnerDock } from "@/components/organisms/OwnerDock";

// Logo placeholder para Storybook (evita next/image y rutas de assets)
const LogoPlaceholder = () => (
    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
    </div>
);

const meta = {
    title: "Organismos/OwnerDock",
    component: OwnerDock,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Dock de navegación exclusivo para el dashboard del propietario (role = OWNER). " +
                    "En desktop aparece flotando a la izquierda; en mobile se convierte en una tab bar fija en la parte inferior.",
            },
        },
    },
    tags: ["autodocs"],
    args: {
        logo: <LogoPlaceholder />,
    },
    argTypes: {
        activeHref: {
            control: "select",
            options: [
                "/owner/dashboard",
                "/owner/vuelos",
                "/owner/manifiestos",
                "/owner/tripulacion",
                "/owner/perfil",
            ],
            description: "Ruta activa actual (determina qué ícono se muestra como activo)",
        },
        onNavigate: { action: "navigate" },
        onLogout: { action: "logout" },
    },
    decorators: [
        (Story) => (
            <div className="w-full min-h-screen bg-background relative">
                <Story />
                {/* Placeholder content para simular el layout del dashboard */}
                <div className="md:ml-24 p-8">
                    <div className="max-w-4xl">
                        <div className="h-8 w-48 bg-neutral/40 rounded-md mb-4" />
                        <div className="h-4 w-72 bg-neutral/30 rounded mb-8" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-neutral/30" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
    ],
} satisfies Meta<typeof OwnerDock>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Static stories ───────────────────────────────────────────────────────────

export const Dashboard: Story = {
    args: {
        activeHref: "/owner/dashboard",
    },
    parameters: {
        docs: { description: { story: "Estado activo: Dashboard." } },
    },
};

export const Vuelos: Story = {
    args: {
        activeHref: "/owner/vuelos",
    },
    parameters: {
        docs: { description: { story: "Estado activo: Mis Vuelos." } },
    },
};

export const Manifiestos: Story = {
    args: {
        activeHref: "/owner/manifiestos",
    },
    parameters: {
        docs: { description: { story: "Estado activo: Manifiestos." } },
    },
};

export const Tripulacion: Story = {
    args: {
        activeHref: "/owner/tripulacion",
    },
    parameters: {
        docs: { description: { story: "Estado activo: Tripulación." } },
    },
};

export const Perfil: Story = {
    args: {
        activeHref: "/owner/perfil",
    },
    parameters: {
        docs: { description: { story: "Estado activo: Mi Perfil." } },
    },
};

export const SinActivo: Story = {
    args: {
        activeHref: undefined,
    },
    parameters: {
        docs: { description: { story: "Ningún item activo (estado inicial o ruta no mapeada)." } },
    },
};

// ─── Mobile viewport ──────────────────────────────────────────────────────────

export const Mobile: Story = {
    args: {
        activeHref: "/owner/dashboard",
    },
    parameters: {
        viewport: { defaultViewport: "mobile1" },
        docs: {
            description: {
                story:
                    "En mobile el dock se convierte en una tab bar fija en la parte inferior de la pantalla.",
            },
        },
    },
};

// ─── Interactive ──────────────────────────────────────────────────────────────

export const Interactivo: Story = {
    render: () => {
        const [activeHref, setActiveHref] = useState("/owner/dashboard");

        const labels: Record<string, string> = {
            "/owner/dashboard": "Dashboard",
            "/owner/vuelos": "Mis Vuelos",
            "/owner/manifiestos": "Manifiestos",
            "/owner/tripulacion": "Tripulación",
            "/owner/perfil": "Mi Perfil",
        };

        return (
            <div className="w-full min-h-screen bg-background relative">
                <OwnerDock
                    activeHref={activeHref}
                    onNavigate={setActiveHref}
                    onLogout={() => alert("Sesión cerrada")}
                />
                <div className="md:ml-24 p-8">
                    <p className="text-sm text-secondary/60 mb-2">Sección activa:</p>
                    <h1 className="text-2xl font-bold text-text">
                        {labels[activeHref] ?? activeHref}
                    </h1>
                    <p className="text-sm text-secondary/50 mt-1">{activeHref}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-neutral/30" />
                        ))}
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    "Demo interactivo: navega entre secciones haciendo clic en los íconos del dock. " +
                    "El contenido central refleja la sección activa.",
            },
        },
    },
};

// ─── All states ───────────────────────────────────────────────────────────────

export const TodosLosEstados: Story = {
    render: () => {
        const items = [
            { href: "/owner/dashboard", label: "Dashboard activo" },
            { href: "/owner/vuelos", label: "Vuelos activo" },
            { href: "/owner/manifiestos", label: "Manifiestos activo" },
            { href: "/owner/tripulacion", label: "Tripulación activo" },
            { href: "/owner/perfil", label: "Perfil activo" },
            { href: undefined, label: "Sin activo" },
        ] as const;

        return (
            <div className="flex flex-wrap gap-16 p-8 bg-background min-h-screen items-center justify-center">
                {items.map(({ href, label }) => (
                    <div key={href ?? "none"} className="relative h-96 w-20 flex items-center justify-center">
                        <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-secondary/50 whitespace-nowrap">{label}</p>
                        <OwnerDock
                            activeHref={href}
                            onNavigate={(h) => console.log("navigate:", h)}
                            onLogout={() => console.log("logout")}
                            className="!static !translate-y-0 !left-auto !top-auto"
                        />
                    </div>
                ))}
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Comparación visual de todos los estados posibles del dock.",
            },
        },
    },
};
