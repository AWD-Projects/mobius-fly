"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface LoadingOverlayProps {
    visible: boolean;
    title: string;
    description?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    title,
    description,
}) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
                    style={{ backgroundColor: "rgba(246, 246, 244, 0.92)" }}
                >
                    {/* Logo */}
                    <Image
                        src="/logo/main-logo.svg"
                        alt="Mobius Fly"
                        width={48}
                        height={48}
                        className="w-12 h-12 opacity-80"
                    />

                    {/* Spinner */}
                    <Loader2 className="w-6 h-6 animate-spin text-primary" strokeWidth={1.5} />

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col items-center gap-1.5 text-center"
                    >
                        <span className="text-body font-semibold text-text">{title}</span>
                        {description && (
                            <span className="text-small text-muted">{description}</span>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
