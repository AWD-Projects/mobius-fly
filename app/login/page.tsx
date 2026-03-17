"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Button } from "@/components/atoms/Button";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import type { UserProfile } from "@/types/app.types";

const loginSchema = z.object({
    email: z.string().min(1, "Correo requerido").refine(
        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        { message: "Correo no válido" }
    ),
    password: z.string().min(1, "Contraseña requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggedIn, isHydrated } = useLocalAuth();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isHydrated && isLoggedIn) {
            router.replace("/my-trips");
        }
    }, [isHydrated, isLoggedIn, router]);

    const onSubmit = async (data: LoginFormData) => {
        setApiError(null);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            const json = await res.json() as { user?: UserProfile; error?: string };

            if (!res.ok) {
                setApiError(json.error ?? "Error al iniciar sesión");
                return;
            }

            login(json.user!);
            router.push(json.user!.role === "OWNER" ? "/owner/dashboard" : "/my-trips");
        } catch {
            setApiError("Error de conexión. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <LazyMotion features={domAnimation} strict>
                <div className="w-full max-w-[356px] flex flex-col items-center">
                    {/* Logo */}
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
                            <Image
                                src="/logo/main-logo.svg"
                                alt="Mobius Fly"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-medium text-text">Mobius Fly</span>
                        </Link>
                    </m.div>

                    {/* Heading */}
                    <m.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="text-[2rem] font-bold text-text mb-8 text-center"
                    >
                        Iniciar Sesión
                    </m.h1>

                    {/* API error */}
                    {apiError && (
                        <p className="text-sm text-error text-center mb-4 -mt-4">{apiError}</p>
                    )}

                    {/* Form */}
                    <m.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="w-full space-y-6"
                    >
                        <InputGroup
                            label="Correo electrónico"
                            type="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <InputGroup
                            label="Contraseña"
                            type="password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button
                            type="submit"
                            variant="secondary"
                            size="lg"
                            isLoading={isSubmitting}
                            className="w-full mt-8"
                        >
                            Iniciar sesión
                        </Button>
                    </m.form>

                    {/* Forgot Password Link */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        className="text-center mt-4"
                    >
                        <Link href="/recover-password" className="text-sm text-text hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </m.div>

                    {/* Register Link */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                        className="mt-8 text-center text-sm text-text flex items-center justify-center gap-1"
                    >
                        <span>¿Nuevo en Mobius Fly?</span>
                        <Link href="/register">
                            <Button variant="link" className="h-auto p-0 text-sm font-semibold text-secondary hover:text-secondary">
                                Regístrate
                            </Button>
                        </Link>
                    </m.div>
                </div>
            </LazyMotion>
        </div>
    );
}
