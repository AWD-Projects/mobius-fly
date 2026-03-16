"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { Navbar, type NavbarProps } from "@/components/organisms/Navbar";

type AppNavbarProps = Omit<
    NavbarProps,
    "isLoggedIn" | "userType" | "userInitials" | "onLogoutClick" | "onProfileClick"
>;

/**
 * Navbar conectado al estado de autenticación.
 * Lee user, role e initials de useLocalAuth — no requiere pasarlos como props.
 * Usar este componente en todas las páginas de la app en lugar de <Navbar> directamente.
 */
export const AppNavbar = React.memo<AppNavbarProps>((props) => {
    const { user, isLoggedIn, logout } = useLocalAuth();
    const router = useRouter();

    const userInitials = user
        ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
        : "";

    const userType = user?.role === "OWNER" ? "owner" : "buyer";

    return (
        <Navbar
            logo={
                <Image
                    src="/logo/main-logo.svg"
                    alt="Mobius Fly"
                    width={32}
                    height={32}
                />
            }
            isLoggedIn={isLoggedIn}
            userType={userType}
            userInitials={userInitials}
            onLogoutClick={logout}
            onProfileClick={() => router.push(userType === "owner" ? "/owner/perfil" : "/perfil")}
            onMyBookingsClick={() => router.push("/my-trips")}
            onMyPlanesClick={() => router.push("/owner/dashboard")}
            {...props}
        />
    );
});

AppNavbar.displayName = "AppNavbar";
