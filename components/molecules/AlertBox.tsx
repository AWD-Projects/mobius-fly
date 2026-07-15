import React from "react";
import { AlertCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "warning" | "error" | "info" | "pending";

interface AlertBoxProps {
    variant:      AlertVariant;
    title:        string;
    description?: React.ReactNode;
    children?:    React.ReactNode;
    className?:   string;
}

const CONFIG: Record<AlertVariant, {
    bg:     string;
    border: string;
    title:  string;
    body:   string;
    Icon:   React.ElementType;
}> = {
    warning: {
        bg:     "bg-[#FFF3E0]",
        border: "border-[#FB8C00]/25",
        title:  "text-[#E65100]",
        body:   "text-[#E65100]/80",
        Icon:   AlertCircle,
    },
    pending: {
        bg:     "bg-[#FFF8E1]",
        border: "border-[#F9A825]/30",
        title:  "text-[#7A5800]",
        body:   "text-[#7A5800]/80",
        Icon:   Clock,
    },
    error: {
        bg:     "bg-[#FFEBEE]",
        border: "border-[#EF9A9A]/40",
        title:  "text-[#C62828]",
        body:   "text-[#C62828]/80",
        Icon:   AlertTriangle,
    },
    info: {
        bg:     "bg-[#E3F2FD]",
        border: "border-[#90CAF9]/40",
        title:  "text-[#1565C0]",
        body:   "text-[#1565C0]/80",
        Icon:   Info,
    },
};

export function AlertBox({ variant, title, description, children, className }: AlertBoxProps) {
    const { bg, border, title: titleColor, body: bodyColor, Icon } = CONFIG[variant];

    return (
        <div className={cn(
            "flex items-start gap-3.5 px-5 py-4 rounded-xl border",
            bg, border, className,
        )}>
            <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", titleColor)} />
            <div className="flex flex-col gap-2">
                <p className={cn("text-sm font-semibold", titleColor)}>{title}</p>
                {description && (
                    <p className={cn("text-xs leading-relaxed", bodyColor)}>{description}</p>
                )}
                {children}
            </div>
        </div>
    );
}
