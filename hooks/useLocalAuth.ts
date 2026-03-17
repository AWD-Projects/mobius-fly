"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/atoms/Toast";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/app.types";

function buildProfile(user: User): UserProfile {
    const m = user.user_metadata ?? {};
    return {
        id: user.id,
        email: user.email ?? "",
        first_name: m.first_name ?? "",
        last_name: m.last_name ?? "",
        role: m.role ?? "PASSENGER",
        gender: m.gender ?? "OTHER",
        date_of_birth: m.date_of_birth ?? "",
        phone: m.phone ?? null,
        country_code: m.country_code ?? null,
        nationality: m.nationality ?? "MX",
        status: m.status ?? "ACTIVE",
    };
}

export function useLocalAuth() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();
    // createBrowserClient is a singleton internally — safe to call here
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        // Check session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ? buildProfile(session.user) : null);
            setIsHydrated(true);
        });

        // Keep state in sync with Supabase auth events (sign-in, sign-out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ? buildProfile(session.user) : null);
            },
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    /**
     * Call after a successful login API response to sync the new session
     * into client state immediately. Accepts an optional UserProfile for
     * backwards-compatibility with existing callers (ignored internally).
     */
    const login = useCallback(async (_userData?: UserProfile) => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ? buildProfile(session.user) : null);
    }, [supabase]);

    const logout = useCallback(async () => {
        await toast.promise(
            (async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                await supabase.auth.signOut();
                setUser(null);
            })(),
            {
                loading: { title: "Cerrando sesión..." },
                success: { title: "Sesión cerrada", description: "Hasta pronto" },
                error: { title: "Error al cerrar sesión", description: "Inténtalo de nuevo" },
            },
        );
        router.push("/login");
    }, [supabase, router]);

    return {
        user,
        isLoggedIn: !!user,
        isHydrated,
        login,
        logout,
    };
}
