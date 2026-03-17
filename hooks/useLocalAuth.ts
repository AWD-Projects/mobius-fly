"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/atoms/Toast";
import type { SupabaseClient, User } from "@supabase/supabase-js";
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
    // Returns null during SSR prerender — all auth logic runs inside useEffect (browser only)
    const supabase = useMemo<SupabaseClient | null>(() => createClient(), []);

    useEffect(() => {
        if (!supabase) return;

        supabase.auth.getSession().then((res) => {
            const session = res.data.session;
            setUser(session?.user ? buildProfile(session.user) : null);
            setIsHydrated(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ? buildProfile(session.user) : null);
            },
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    const login = useCallback(async (_userData?: UserProfile) => {
        if (!supabase) return;
        const res = await supabase.auth.getSession();
        const session = res.data.session;
        setUser(session?.user ? buildProfile(session.user) : null);
    }, [supabase]);

    const logout = useCallback(async () => {
        await toast.promise(
            (async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                await supabase?.auth.signOut();
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
