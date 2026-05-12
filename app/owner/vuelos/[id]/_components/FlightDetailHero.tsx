"use client";

import React from "react";
import { ArrowRight, Hash, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/molecules/StatusBadge";

export interface FlightDetailHeroProps {
    flightCode:  string;
    origin:      string;
    destination: string;
    date:        string;
    statusCode:  string;
}

const STATUS_CFG: Record<string, { label: string; status: "pending" | "info" | "success" | "inactive" }> = {
    SCHEDULED:      { label: "Programado",  status: "pending"  },
    DELAYED:        { label: "Retrasado",   status: "pending"  },
    IN_FLIGHT:      { label: "En vuelo",    status: "info"     },
    ON_TIME:        { label: "A tiempo",    status: "success"  },
    COMPLETED:      { label: "Completado",  status: "inactive" },
    CANCELLED:      { label: "Cancelado",   status: "inactive" },
    PENDING_REVIEW: { label: "En revisión", status: "pending"  },
};

export const FlightDetailHero: React.FC<FlightDetailHeroProps> = ({
    flightCode,
    origin,
    destination,
    date,
    statusCode,
}) => {
    const cfg = STATUS_CFG[statusCode] ?? { label: statusCode, status: "pending" as const };

    return (
        <div className="w-full bg-[#f6f6f4] px-12 py-8 border-b border-border">
            <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-[#999999]">Vuelos</span>
                <span className="text-xs text-[#CCCCCC]">/</span>
                <span className="text-xs font-medium text-text">{flightCode}</span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[40px] font-medium text-text" style={{ letterSpacing: "-0.5px" }}>
                            {origin}
                        </h1>
                        <ArrowRight className="w-6 h-6 text-muted" />
                        <h1 className="text-[40px] font-medium text-text" style={{ letterSpacing: "-0.5px" }}>
                            {destination}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-muted" />
                            <span className="text-sm text-[#666666]">{flightCode}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted" />
                            <span className="text-sm text-[#666666]">{date}</span>
                        </div>
                    </div>
                </div>

                <StatusBadge status={cfg.status}>{cfg.label}</StatusBadge>
            </div>
        </div>
    );
};
