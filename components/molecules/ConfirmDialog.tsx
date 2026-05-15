"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    warning?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    description,
    warning,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    isLoading = false,
    destructive = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => !isLoading && onCancel()}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-[15px] font-semibold text-text">{title}</h2>
                        <p className="text-[13px] text-muted leading-relaxed">{description}</p>
                    </div>

                    {warning && (
                        <div className="flex items-start gap-2.5 rounded-xl bg-[#FFF8E1] border border-[#F9A825]/30 px-4 py-3">
                            <AlertTriangle className="w-4 h-4 text-[#F9A825] flex-shrink-0 mt-0.5" />
                            <p className="text-[12px] text-[#7A5800] leading-relaxed">{warning}</p>
                        </div>
                    )}

                    <div className="flex gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-10 text-sm"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            type="button"
                            variant={destructive ? "outline" : "primary"}
                            className={`flex-1 h-10 text-sm ${destructive ? "text-red-600 border-red-300 hover:bg-red-50" : ""}`}
                            onClick={onConfirm}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
