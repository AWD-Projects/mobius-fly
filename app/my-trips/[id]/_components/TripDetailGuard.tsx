"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalAuth } from "@/hooks/useLocalAuth";

interface TripDetailGuardProps {
    children: React.ReactNode;
}

export function TripDetailGuard({ children }: TripDetailGuardProps) {
    const { isLoggedIn, isHydrated } = useLocalAuth();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && !isLoggedIn) {
            router.replace("/login");
        }
    }, [isHydrated, isLoggedIn, router]);

    if (!isHydrated || !isLoggedIn) return null;

    return <>{children}</>;
}
