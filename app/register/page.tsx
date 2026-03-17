"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { accountSchema, passwordSchema, type AccountFormData, type PasswordFormData } from "@/lib/validations/register";
import { formatFileSize, type UploadedDocument } from "@/components/molecules/DocumentUpload";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { toast } from "@/components/atoms/Toast";
import { UserTypeStep } from "./components/UserTypeStep";
import { AccountStep } from "./components/AccountStep";
import { PasswordStep } from "./components/PasswordStep";
import { IdentityStep } from "./components/IdentityStep";
import { VerificationStep } from "./components/VerificationStep";
import { WelcomeStep } from "./components/WelcomeStep";
import { FleetNameStep } from "./components/FleetNameStep";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function RegisterPage() {
    const router = useRouter();
    const { user, login, isLoggedIn, isHydrated } = useLocalAuth();

    const [step, setStep] = useState<Step>(1);
    const [userType, setUserType] = useState<"buyer" | "owner" | "">("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFinalStepLoading, setIsFinalStepLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [idFile, setIdFile] = useState<File | undefined>(undefined);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [registeredUserId, setRegisteredUserId] = useState("");
    const [idDocument, setIdDocument] = useState<UploadedDocument | undefined>(undefined);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(60);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const canResend = step === 5 && resendTimer === 0;

    const accountForm = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        mode: "onBlur",
        defaultValues: {
            fullName: "",
            birthDate: "",
            gender: undefined,
            email: "",
            phone: "",
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Redirect if already logged in (before starting registration)
    useEffect(() => {
        if (isHydrated && isLoggedIn) {
            router.replace(user?.role === "OWNER" ? "/owner/dashboard" : "/my-trips");
        }
    }, [isHydrated, isLoggedIn, user, router]);

    // Resend code timer
    useEffect(() => {
        if (step === 5 && resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step, resendTimer]);

    const handleSelectUserType = useCallback((type: "buyer" | "owner") => {
        setUserType(type);
    }, []);

    const handleTogglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleToggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const handleDocumentUpload = useCallback((file: File) => {
        setIdFile(file);
        setIdDocument({
            name: file.name,
            size: formatFileSize(file.size),
        });
    }, []);

    const handleDocumentRemove = useCallback(() => {
        setIdFile(undefined);
        setIdDocument(undefined);
    }, []);

    const handleAcceptTermsChange = useCallback((checked: boolean) => {
        setAcceptTerms(checked);
    }, []);

    const handleCodeChange = useCallback((index: number, value: string) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
    }, [verificationCode]);

    const handlePasteOTP = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain");
        const digits = pastedData.replace(/\D/g, "").slice(0, 6);

        if (digits.length === 6) {
            const newCode = digits.split("");
            setVerificationCode(newCode);
            const lastInput = document.getElementById("code-5");
            lastInput?.focus();
        }
    }, []);

    const handleResendCode = useCallback(async () => {
        if (!canResend) return;
        setResendTimer(60);
        setVerificationCode(["", "", "", "", "", ""]);
        await fetch("/api/auth/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: registeredEmail }),
        }).catch((err) => console.error("[resend-otp]", err));
    }, [canResend, registeredEmail]);

    const handleGoToDashboard = useCallback(async (fleetName?: string) => {
        setIsFinalStepLoading(true);
        try {
            // Save fleet name for owner registrations
            if (fleetName && registeredUserId) {
                await toast.promise(
                    fetch("/api/owners/fleet-name", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: registeredUserId, fleetName }),
                    }),
                    {
                        loading: { title: "Guardando nombre de flota..." },
                        success: { title: "¡Todo listo!", description: "Bienvenido a Mobius Fly" },
                        error: { title: "No se pudo guardar el nombre", description: "Podrás cambiarlo desde tu perfil" },
                    }
                );
            }

            // Establish a real Supabase session (sets cookies via SSR login route)
            const values = accountForm.getValues();
            const passwordValues = passwordForm.getValues();
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email, password: passwordValues.password }),
            });

            if (loginRes.ok) {
                await login(); // sync new session into hook state
            }

            router.push(userType === "owner" ? "/owner/dashboard" : "/my-trips");
        } finally {
            setIsFinalStepLoading(false);
        }
    }, [accountForm, passwordForm, userType, login, router, registeredUserId]);

    const handleNext = useCallback(async () => {
        setApiError(null);
        if (step === 4) {
            if (!idFile) return;
            setIsLoading(true);
            try {
                const values = accountForm.getValues();
                const passwordValues = passwordForm.getValues();
                const arrayBuffer = await idFile.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString("base64");

                const signupPromise = fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: values.email,
                        password: passwordValues.password,
                        fullName: values.fullName,
                        birthDate: values.birthDate,
                        gender: values.gender,
                        phone: values.phone || undefined,
                        userType,
                        documentBase64: base64,
                        documentMimeType: idFile.type,
                        documentFileName: idFile.name,
                    }),
                }).then(async (res) => {
                    const data = await res.json() as { userId?: string; email?: string; error?: string };
                    if (!res.ok) throw new Error(data.error ?? "Error al crear la cuenta");
                    return data;
                });

                const data = await toast.promise(signupPromise, {
                    loading: { title: "Creando tu cuenta...", description: "Esto puede tardar unos segundos" },
                    success: { title: "¡Código enviado!", description: "Revisa tu correo electrónico" },
                    error: (err) => ({ title: err instanceof Error ? err.message : "Error al crear la cuenta" }),
                });

                setRegisteredUserId(data.userId ?? "");
                setRegisteredEmail(data.email ?? values.email);
                setStep(5);
            } catch (err) {
                setApiError(err instanceof Error ? err.message : "Error de conexión. Inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        } else if (step < 6) {
            setStep((step + 1) as Step);
        }
    }, [step, idFile, accountForm, passwordForm, userType]);

    const handlePrev = useCallback(() => {
        setApiError(null);
        if (step > 1) setStep((step - 1) as Step);
    }, [step]);

    const handleSubmit = useCallback(async () => {
        setApiError(null);
        setIsLoading(true);
        try {
            const verifyPromise = fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registeredEmail,
                    token: verificationCode.join(""),
                }),
            }).then(async (res) => {
                const data = await res.json() as { error?: string; userId?: string };
                if (!res.ok) throw new Error(data.error ?? "Código incorrecto");
                return data;
            });

            const data = await toast.promise(verifyPromise, {
                loading: { title: "Verificando código...", description: "Confirmando tu cuenta" },
                success: { title: "¡Cuenta verificada!", description: "Tu correo ha sido confirmado" },
                error: (err) => ({ title: err instanceof Error ? err.message : "Código incorrecto" }),
            });

            if (data.userId) setRegisteredUserId(data.userId);
            setStep(6);
        } catch (err) {
            setApiError(err instanceof Error ? err.message : "Error de conexión. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [registeredEmail, verificationCode]);

    const canProceed = useCallback(() => {
        switch (step) {
            case 1:
                return userType !== "";
            case 2:
                return accountForm.formState.isValid;
            case 3:
                return passwordForm.formState.isValid;
            case 4:
                return idDocument !== undefined && acceptTerms;
            case 5:
                return verificationCode.every(code => code !== "");
            default:
                return true;
        }
    }, [step, userType, accountForm.formState.isValid, passwordForm.formState.isValid, idDocument, acceptTerms, verificationCode]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-y-auto">
            <LazyMotion features={domAnimation} strict>
                {/* Logo */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo/main-logo.svg"
                            alt="Mobius Fly"
                            width={60}
                            height={60}
                            className="w-12 h-12 sm:w-16 sm:h-16"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-4xl mt-12 sm:mt-16">
                    {/* API error */}
                    {apiError && (
                        <p className="text-center text-sm text-error mb-4">{apiError}</p>
                    )}

                    {/* Form Container */}
                    <div className="w-full relative flex items-center gap-3 sm:gap-6 md:gap-8">
                        {/* Left Arrow */}
                        {step !== 6 && (
                            <IconButton
                                onClick={handlePrev}
                                disabled={step === 1}
                                className="!w-10 !h-10 sm:!w-16 sm:!h-16 md:!w-20 md:!h-20 flex-shrink-0"
                                icon={<ChevronLeft className="w-7 h-7 sm:w-12 sm:h-12 md:w-16 md:h-16" strokeWidth={1} style={{ color: "#39424E" }} />}
                                tooltip="Anterior"
                            />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <UserTypeStep
                                        userType={userType}
                                        onSelectUserType={handleSelectUserType}
                                    />
                                )}

                                {step === 2 && (
                                    <AccountStep form={accountForm} />
                                )}

                                {step === 3 && (
                                    <PasswordStep
                                        form={passwordForm}
                                        showPassword={showPassword}
                                        showConfirmPassword={showConfirmPassword}
                                        onTogglePassword={handleTogglePassword}
                                        onToggleConfirmPassword={handleToggleConfirmPassword}
                                    />
                                )}

                                {step === 4 && (
                                    <IdentityStep
                                        idDocument={idDocument}
                                        acceptTerms={acceptTerms}
                                        onDocumentUpload={handleDocumentUpload}
                                        onDocumentRemove={handleDocumentRemove}
                                        onAcceptTermsChange={handleAcceptTermsChange}
                                    />
                                )}

                                {step === 5 && (
                                    <VerificationStep
                                        verificationCode={verificationCode}
                                        canResend={canResend}
                                        resendTimer={resendTimer}
                                        onCodeChange={handleCodeChange}
                                        onPaste={handlePasteOTP}
                                        onResendCode={handleResendCode}
                                    />
                                )}

                                {step === 6 && userType !== "owner" && (
                                    <WelcomeStep onGoToDashboard={() => handleGoToDashboard()} isLoading={isFinalStepLoading} />
                                )}

                                {step === 6 && userType === "owner" && (
                                    <FleetNameStep onContinue={handleGoToDashboard} isLoading={isFinalStepLoading} />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Arrow */}
                        {step !== 6 && (() => {
                            const can = canProceed() && !isLoading;
                            return (
                                <IconButton
                                    onClick={step === 5 ? handleSubmit : handleNext}
                                    disabled={!can}
                                    className="!w-10 !h-10 sm:!w-16 sm:!h-16 md:!w-20 md:!h-20 flex-shrink-0"
                                    icon={
                                        <ChevronRight
                                            className="w-7 h-7 sm:w-12 sm:h-12 md:w-16 md:h-16"
                                            strokeWidth={1}
                                            style={{ color: can ? "var(--color-primary)" : "#39424E" }}
                                        />
                                    }
                                    tooltip={step === 5 ? "Enviar" : "Siguiente"}
                                />
                            );
                        })()}
                    </div>
                </div>
            </LazyMotion>
        </div>
    );
}
