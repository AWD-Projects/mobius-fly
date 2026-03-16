"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { OwnerDock } from "@/components/organisms/OwnerDock";

interface OwnerLayoutClientProps {
    children: React.ReactNode;
}

export function OwnerLayoutClient({ children }: OwnerLayoutClientProps) {
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

    return (
        <div className="min-h-screen bg-background">
            <OwnerDock
                activeHref={pathname}
                onNavigate={(href) => router.push(href)}
                onLogout={logout}
            />

            {/* Content area — compensates for dock width on desktop and tab bar on mobile */}
            <main className="md:pl-[104px] pb-28 md:pb-0">
                {children}
            </main>
        </div>
    );
}
