"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types/app.types";

const STORAGE_KEY = "mobius_user";

export function useLocalAuth() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        startTransition(() => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setUser(JSON.parse(stored) as UserProfile);
                } catch {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
            setIsHydrated(true);
        });
    }, []);

    const login = useCallback((userData: UserProfile) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        router.push("/login");
    }, [router]);

    return {
        user,
        isLoggedIn: !!user,
        isHydrated,
        login,
        logout,
    };
}
