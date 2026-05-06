"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const emailSchema = z.object({
    email: z
        .string()
        .min(1, "Correo requerido")
        .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Correo no válido" }),
});

const otpSchema = z.object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;


// ─── OTP digit input ──────────────────────────────────────────────────────────

interface OtpInputProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
}

function OtpInput({ value, onChange, error }: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const digits = value.padEnd(6, "").split("").slice(0, 6);

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) {
            refs.current[i - 1]?.focus();
        }
    };

    const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (!raw) {
            const next = digits.map((d, idx) => (idx === i ? "" : d)).join("").trimEnd();
            onChange(next);
            return;
        }
        // Support paste: fill from position i
        const pasted = raw.slice(0, 6 - i);
        const next = [...digits];
        for (let j = 0; j < pasted.length; j++) next[i + j] = pasted[j];
        onChange(next.join("").trimEnd());
        const focusIdx = Math.min(i + pasted.length, 5);
        refs.current[focusIdx]?.focus();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digits[i] ?? ""}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className={[
                        "w-11 h-14 text-center text-h3 font-bold rounded-sm border transition-all",
                        "focus-visible:outline-none focus-visible:border-2",
                        error
                            ? "border-error focus-visible:border-error text-error"
                            : "border-border focus-visible:border-text text-text",
                        "bg-transparent",
                    ].join(" ")}
                />
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "success";

const slideVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
};

export default function RecoverPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [pendingEmail, setPendingEmail] = useState("");
    const [otpValue, setOtpValue] = useState("");
    const [otpError, setOtpError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(false);

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    // ── Step 1: request OTP ───────────────────────────────────────────────────
    const handleRequestOtp = async (data: EmailFormData) => {
        setServerError(null);
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
        });
        // Always advance (anti-enumeration)
        if (res.ok || res.status === 200) {
            setPendingEmail(data.email);
            setStep("otp");
        } else {
            const json = await res.json().catch(() => ({}));
            setServerError(json.error ?? "Error al enviar el código");
        }
    };

    // ── Step 2: verify OTP + set new password ─────────────────────────────────
    const handleResetPassword = async (data: OtpFormData) => {
        setServerError(null);
        setOtpError(null);

        if (otpValue.length !== 6) {
            setOtpError("Ingresa el código de 6 dígitos");
            return;
        }

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: pendingEmail,
                token: otpValue,
                password: data.password,
            }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (json.error?.toLowerCase().includes("código")) {
                setOtpError(json.error);
            } else {
                setServerError(json.error ?? "Error al restablecer la contraseña");
            }
            return;
        }

        setStep("success");
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (resendCooldown) return;
        setResendCooldown(true);
        setOtpError(null);
        setServerError(null);
        await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: pendingEmail }),
        });
        setOtpValue("");
        setTimeout(() => setResendCooldown(false), 30_000);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
            <LazyMotion features={domAnimation} strict>
                <div className="w-full max-w-[380px] flex flex-col items-center">
                    {/* Logo */}
                    <m.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
                            <Image src="/logo/main-logo.svg" alt="Mobius Fly" width={32} height={32} />
                            <span className="text-xl font-medium text-text">Mobius Fly</span>
                        </Link>
                    </m.div>

                    <AnimatePresence mode="wait" initial={false}>

                        {/* ── Step 1: Email ───────────────────────────────── */}
                        {step === "email" && (
                            <m.div
                                key="email"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full flex flex-col items-center gap-8"
                            >
                                <div className="text-center">
                                    <h1 className="text-[2rem] font-bold text-text mb-2">
                                        ¿Olvidaste tu contraseña?
                                    </h1>
                                    <p className="text-small text-muted">
                                        Ingresa tu correo y te enviaremos un código para restablecerla.
                                    </p>
                                </div>

                                <form
                                    onSubmit={emailForm.handleSubmit(handleRequestOtp)}
                                    noValidate
                                    className="w-full flex flex-col gap-5"
                                >
                                    <InputGroup
                                        label="Correo electrónico"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        error={emailForm.formState.errors.email?.message}
                                        {...emailForm.register("email")}
                                    />

                                    {serverError && (
                                        <p className="text-caption text-error text-center">{serverError}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="lg"
                                        isLoading={emailForm.formState.isSubmitting}
                                        className="w-full"
                                    >
                                        Enviar código
                                    </Button>

                                    <p className="text-caption text-muted text-center">
                                        ¿Recuerdas tu contraseña?{" "}
                                        <Link href="/login" className="text-text font-medium underline underline-offset-2">
                                            Inicia sesión
                                        </Link>
                                    </p>
                                </form>
                            </m.div>
                        )}

                        {/* ── Step 2: OTP + nueva contraseña ─────────────── */}
                        {step === "otp" && (
                            <m.div
                                key="otp"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full flex flex-col items-center gap-8"
                            >
                                <div className="text-center">
                                    <h1 className="text-[2rem] font-bold text-text mb-2">
                                        Revisa tu correo
                                    </h1>
                                    <p className="text-small text-muted">
                                        Enviamos un código de 6 dígitos a{" "}
                                        <span className="font-medium text-text">{pendingEmail}</span>
                                    </p>
                                </div>

                                <form
                                    onSubmit={otpForm.handleSubmit(handleResetPassword)}
                                    noValidate
                                    className="w-full flex flex-col gap-5"
                                >
                                    {/* OTP digits */}
                                    <div className="flex flex-col gap-2">
                                        <label className="block text-small font-medium tracking-[0.01em] text-secondary text-center">
                                            Código de verificación
                                        </label>
                                        <OtpInput
                                            value={otpValue}
                                            onChange={(v) => { setOtpValue(v); setOtpError(null); }}
                                            error={!!otpError}
                                        />
                                        {otpError && (
                                            <p className="text-caption text-error text-center">{otpError}</p>
                                        )}
                                    </div>

                                    {/* Nueva contraseña */}
                                    <div className="space-y-2">
                                        <label className="block text-small font-medium tracking-[0.01em] text-secondary">
                                            Nueva contraseña <span className="text-error ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mínimo 8 caracteres"
                                                error={!!otpForm.formState.errors.password}
                                                className="w-full pr-10"
                                                {...otpForm.register("password")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((p) => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                        {otpForm.formState.errors.password && (
                                            <p className="mt-2 text-small text-error">{otpForm.formState.errors.password.message}</p>
                                        )}
                                    </div>

                                    {/* Confirmar contraseña */}
                                    <div className="space-y-2">
                                        <label className="block text-small font-medium tracking-[0.01em] text-secondary">
                                            Confirmar contraseña <span className="text-error ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="Repite tu contraseña"
                                                error={!!otpForm.formState.errors.confirmPassword}
                                                className="w-full pr-10"
                                                {...otpForm.register("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((p) => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                        {otpForm.formState.errors.confirmPassword && (
                                            <p className="mt-2 text-small text-error">{otpForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    {serverError && (
                                        <p className="text-caption text-error text-center">{serverError}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="lg"
                                        isLoading={otpForm.formState.isSubmitting}
                                        className="w-full"
                                    >
                                        Restablecer contraseña
                                    </Button>

                                    {/* Resend */}
                                    <p className="text-caption text-muted text-center">
                                        ¿No recibiste el código?{" "}
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={resendCooldown}
                                            className="text-text font-medium underline underline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {resendCooldown ? "Código reenviado" : "Reenviar"}
                                        </button>
                                    </p>
                                </form>
                            </m.div>
                        )}

                        {/* ── Step 3: Éxito ───────────────────────────────── */}
                        {step === "success" && (
                            <m.div
                                key="success"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full flex flex-col items-center gap-8 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 size={40} className="text-success" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h1 className="text-[2rem] font-bold text-text">
                                        Contraseña actualizada
                                    </h1>
                                    <p className="text-small text-muted">
                                        Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión.
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => router.push("/login")}
                                >
                                    Ir a iniciar sesión
                                </Button>
                            </m.div>
                        )}

                    </AnimatePresence>
                </div>
            </LazyMotion>
        </div>
    );
}
