"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "wheel",
    "touchstart",
    "scroll",
] as const;

const STORAGE_KEY = "mobius-fly:last-activity";
// Avoid writing to localStorage on every single mousemove/scroll event.
const ACTIVITY_THROTTLE_MS = 5_000;

/**
 * Calls `onIdle` after `timeoutMs` of no user activity (mouse, keyboard, touch, scroll).
 * Activity is shared across same-origin tabs via localStorage so an idle tab doesn't
 * sign out while the user is active in another tab.
 */
export function useIdleTimeout(timeoutMs: number, onIdle: () => void, enabled: boolean) {
    const onIdleRef = useRef(onIdle);

    useEffect(() => {
        onIdleRef.current = onIdle;
    }, [onIdle]);

    useEffect(() => {
        if (!enabled || typeof window === "undefined") return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const readLastActivity = () => Number(localStorage.getItem(STORAGE_KEY)) || Date.now();

        const scheduleFromLastActivity = () => {
            clearTimeout(timeoutId);
            const elapsed = Date.now() - readLastActivity();
            const remaining = timeoutMs - elapsed;
            if (remaining <= 0) {
                onIdleRef.current();
                return;
            }
            timeoutId = setTimeout(() => onIdleRef.current(), remaining);
        };

        let lastRecordedAt = 0;
        const recordActivity = () => {
            const now = Date.now();
            if (now - lastRecordedAt < ACTIVITY_THROTTLE_MS) return;
            lastRecordedAt = now;
            localStorage.setItem(STORAGE_KEY, String(now));
            scheduleFromLastActivity();
        };

        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) scheduleFromLastActivity();
        };

        recordActivity();
        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, recordActivity));
        window.addEventListener("storage", handleStorage);

        return () => {
            clearTimeout(timeoutId);
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, recordActivity));
            window.removeEventListener("storage", handleStorage);
        };
    }, [timeoutMs, enabled]);
}
