"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Checkbox } from "@/components/atoms/Checkbox";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import { DocumentUpload, formatFileSize, type UploadedDocument } from "@/components/molecules/DocumentUpload";
import { accountSchema, passwordSchema, type AccountFormData, type PasswordFormData } from "@/lib/validations/register";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [userType, setUserType] = useState<"buyer" | "owner" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [idDocument, setIdDocument] = useState<UploadedDocument | undefined>(undefined);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Derive canResend from resendTimer and step instead of storing it in state
  const canResend = step === 5 && resendTimer === 0;

  // Step 2: Account Creation Form
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

  // Step 6: Password Creation Form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Resend code timer
  useEffect(() => {
    if (step === 5 && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  const handleNext = () => {
    if (step < 6) setStep((step + 1) as Step);
  };

  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => {
      setIsLoading(false);
      setStep(6); // Go to welcome screen
    }, 1500);
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(60);
      setVerificationCode(["", "", "", "", "", ""]);
      // TODO: Implement API call to resend verification code
    }
  };

  const handlePasteOTP = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newCode = digits.split("");
      setVerificationCode(newCode);
      // Focus the last input
      const lastInput = document.getElementById("code-5");
      lastInput?.focus();
    }
  };

  const canProceed = () => {
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
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative">
      <LazyMotion features={domAnimation} strict>
        {/* Logo */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2"
        >
          <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo/main-logo.svg"
              alt="Mobius Fly"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
          </Link>
        </m.div>

        <div className="w-full max-w-4xl mt-16">
          {/* Form Container */}
          <div className="w-full relative flex items-center gap-8">
            {/* Left Arrow */}
            {step !== 6 && (
              <IconButton
                onClick={handlePrev}
                disabled={step === 1}
                icon={<ChevronLeft size={32} strokeWidth={1} style={{ color: "#39424E" }} />}
                tooltip="Anterior"
              />
            )}

            {/* Content */}
            <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
            {/* Step 1: User Type Selection */}
            {step === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl space-y-8"
              >
                <p
                  className="text-sm sm:text-base font-normal text-center"
                  style={{
                    color: "#39424E",
                    opacity: 0.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ¿Qué te gustaría hacer en Mobius Fly?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <SelectionCard
                    title="Vivir la experiencia de un vuelo privado"
                    description="Explorar vuelos privados disponibles"
                    isSelected={userType === "buyer"}
                    onClick={() => setUserType("buyer")}
                  />

                  <SelectionCard
                    title="Tener control total de mis empty legs"
                    description="Soy operador o propietario de aeronaves"
                    isSelected={userType === "owner"}
                    onClick={() => setUserType("owner")}
                  />
                </div>
              </m.div>
            )}

            {/* Step 2: Account Creation */}
            {step === 2 && (
              <m.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl space-y-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-12">
                  Crea tu cuenta
                </h1>

                <form className="max-w-xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm text-text">
                      Nombre completo <span className="text-error">*</span>
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      {...accountForm.register("fullName")}
                      className="w-full"
                      error={!!accountForm.formState.errors.fullName}
                    />
                    {accountForm.formState.errors.fullName && (
                      <p className="text-xs text-error">{accountForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm text-text">
                      Fecha de nacimiento <span className="text-error">*</span>
                    </label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...accountForm.register("birthDate")}
                      className="w-full"
                      error={!!accountForm.formState.errors.birthDate}
                    />
                    {accountForm.formState.errors.birthDate && (
                      <p className="text-xs text-error">{accountForm.formState.errors.birthDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm text-text">
                      Sexo <span className="text-error">*</span>
                    </label>
                    <select
                      id="gender"
                      {...accountForm.register("gender")}
                      className={cn(
                        "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-body text-text transition-all focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2",
                        accountForm.formState.errors.gender ? "border-error" : "border-border"
                      )}
                    >
                      <option value="">Seleccionar</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                    {accountForm.formState.errors.gender && (
                      <p className="text-xs text-error">{accountForm.formState.errors.gender.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm text-text">
                      Correo electrónico <span className="text-error">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...accountForm.register("email")}
                      className="w-full"
                      error={!!accountForm.formState.errors.email}
                    />
                    {accountForm.formState.errors.email && (
                      <p className="text-xs text-error">{accountForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm text-text">
                      Número telefónico (opcional)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...accountForm.register("phone")}
                      className="w-full"
                    />
                  </div>
                </form>
              </m.div>
            )}

            {/* Step 3: Password Creation */}
            {step === 3 && (
              <m.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl space-y-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-8">
                  Crea tu contraseña
                </h1>

                <form className="max-w-xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm text-text">
                      Contraseña <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...passwordForm.register("password")}
                        className="w-full pr-10"
                        error={!!passwordForm.formState.errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.password && (
                      <p className="text-xs text-error">{passwordForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm text-text">
                      Confirmar contraseña <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        className="w-full pr-10"
                        error={!!passwordForm.formState.errors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-error">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </form>
              </m.div>
            )}

            {/* Step 4: Identity Verification */}
            {step === 4 && (
              <m.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl space-y-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-8">
                  Verifica tu identidad
                </h1>

                <div className="max-w-md mx-auto space-y-6">
                  {/* File Upload */}
                  <DocumentUpload
                    document={idDocument}
                    onUpload={(file) => {
                      setIdDocument({
                        name: file.name,
                        size: formatFileSize(file.size),
                      });
                    }}
                    onRemove={() => setIdDocument(undefined)}
                    accept=".pdf"
                    pendingTitle="Sube tu INE o Pasaporte"
                    pendingDescription="Identificación oficial en PDF para mexicanos y pasaporte para extranjeros"
                  />

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer justify-center">
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span className="text-sm text-text">
                      Acepto los{" "}
                      <Link href="/terms" className="font-semibold underline">
                        Términos y Condiciones
                      </Link>
                    </span>
                  </label>
                </div>
              </m.div>
            )}

            {/* Step 5: Email Verification */}
            {step === 5 && (
              <m.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl space-y-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-text text-center">
                  Verifica tu cuenta
                </h1>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {verificationCode.map((code, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={code}
                        onChange={(e) => {
                          const newCode = [...verificationCode];
                          newCode[index] = e.target.value;
                          setVerificationCode(newCode);
                          // Auto-focus next input
                          if (e.target.value && index < 5) {
                            const nextInput = document.getElementById(`code-${index + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        onPaste={index === 0 ? handlePasteOTP : undefined}
                        id={`code-${index}`}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold rounded-md border border-border bg-transparent text-text transition-all focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleResendCode}
                      disabled={!canResend}
                      className={cn(!canResend && "text-muted")}
                    >
                      {canResend ? "Reenviar código" : `Reenviar código (${resendTimer}s)`}
                    </Button>
                  </div>
                </div>
              </m.div>
            )}

            {/* Step 6: Welcome Screen */}
            {step === 6 && (
              <m.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl text-center space-y-8"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-text">
                  Bienvenid@ a Mobius Fly
                </h1>
                <p className="text-base sm:text-lg text-text max-w-md mx-auto">
                  Completaste tu registro. Todo listo<br />
                  para reservar tus vuelos privados
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="mx-auto"
                  icon={<ArrowRight size={18} />}
                  iconPosition="end"
                >
                  Ir a mi perfil
                </Button>
              </m.div>
            )}
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            {step !== 6 && (
              <IconButton
                onClick={step === 5 ? handleSubmit : handleNext}
                disabled={!canProceed()}
                icon={<ChevronRight size={32} strokeWidth={1} style={{ color: "#39424E" }} />}
                tooltip={step === 5 ? "Enviar" : "Siguiente"}
              />
            )}
          </div>
        </div>
      </LazyMotion>
    </div>
  );
}
