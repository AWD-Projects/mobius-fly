"use client";

import { useCallback } from "react";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";

const IDLE_TIMEOUT_MS = 90 * 60 * 1000; // 90 minutes

/**
 * Signs the user out automatically after 90 minutes of inactivity.
 * Mounted once in the root layout so it applies across the whole app.
 */
export function AutoSignOutProvider() {
    const { isLoggedIn, isHydrated, logout } = useLocalAuth();

    const handleIdle = useCallback(() => {
        void logout();
    }, [logout]);

    useIdleTimeout(IDLE_TIMEOUT_MS, handleIdle, isHydrated && isLoggedIn);

    return null;
}
