import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, ArrowRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Textarea } from "@/components/atoms/Textarea";
import { Button } from "@/components/atoms/Button";

// ─── Schema ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  userType: z.string().min(1, "Selecciona una opción"),
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().min(1, "Correo requerido").refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    { message: "Correo no válido" }
  ),
  phone: z.string().optional(),
  message: z.string().min(1, "Mensaje requerido"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

const stepFields: Record<number, (keyof ContactFormData)[]> = {
  1: ["userType"],
  2: ["name", "email"],
  3: ["message"],
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ContactSectionProps {
  sectionPadding: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ContactSection = React.memo<ContactSectionProps>(({
  sectionPadding,
  onSubmit,
}) => {
  const [step, setStep] = React.useState(1);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { userType: "", name: "", email: "", phone: "", message: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const userType = watch("userType");

  const handleNext = React.useCallback(async () => {
    setSubmitError(null);
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    setStep((s) => s + 1);
  }, [step, trigger]);

  const handlePrev = React.useCallback(() => {
    setSubmitError(null);
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const handleTypeSelect = React.useCallback((type: string) => {
    setValue("userType", type, { shouldValidate: true });
    setStep(2);
  }, [setValue]);

  const onFormSubmit = React.useCallback(async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      await onSubmit?.(data);
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al enviar el formulario. Por favor, intenta de nuevo.");
    }
  }, [onSubmit]);

  return (
    <section
      id="contacto"
      className={`snap-start h-screen relative flex flex-col justify-center ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-12">

          {/* Header */}
          {step !== 4 && (
            <SectionHeader
              title="Hablemos"
              subtitle="Cuéntanos qué necesitas y te contactamos personalmente"
              align="center"
              size="page"
            />
          )}

          {/* Form Container */}
          <div className="w-full relative flex items-center gap-8">

            {/* Left Arrow */}
            {step !== 4 && (
              <IconButton
                type="button"
                onClick={handlePrev}
                disabled={step === 1 || isSubmitting}
                icon={<ChevronLeft size={32} strokeWidth={1} style={{ color: "#39424E" }} />}
                tooltip="Anterior"
              />
            )}

            {/* Form Content */}
            <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center">

              {/* Step 1: User Type Selection */}
              {step === 1 && (
                <m.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p className="text-sm sm:text-base font-normal text-center"
                    style={{ color: "#39424E", opacity: 0.8, letterSpacing: "-0.01em" }}
                  >
                    ¿Qué te gustaría hacer en Mobius Fly?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                    <SelectionCard
                      title="Reservar un vuelo"
                      description="Explorar vuelos privados disponibles"
                      isSelected={userType === "reservar"}
                      onClick={() => handleTypeSelect("reservar")}
                    />
                    <SelectionCard
                      title="Administrar mis vuelos"
                      description="Soy operador o propietario de aeronaves"
                      isSelected={userType === "administrar"}
                      onClick={() => handleTypeSelect("administrar")}
                    />
                  </div>
                </m.div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <m.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p className="text-sm sm:text-base font-normal text-center"
                    style={{ color: "#39424E", opacity: 0.8, letterSpacing: "-0.01em" }}
                  >
                    ¿Cómo podemos contactarte?
                  </p>
                  <div className="w-full flex flex-col gap-4">
                    <InputGroup
                      label="Nombre"
                      type="text"
                      required
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <InputGroup
                      label="Correo"
                      type="email"
                      required
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <InputGroup
                      label="Número telefónico (opcional)"
                      type="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                </m.div>
              )}

              {/* Step 3: Message */}
              {step === 3 && (
                <m.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p className="text-sm sm:text-base font-normal text-center"
                    style={{ color: "#39424E", opacity: 0.8, letterSpacing: "-0.01em" }}
                  >
                    ¿Hay algo más qué quieras contarnos?
                  </p>
                  <Textarea
                    rows={6}
                    className="resize-none w-full"
                    error={!!errors.message}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-small text-error self-start">{errors.message.message}</p>
                  )}
                  {submitError && (
                    <div className="w-full p-4 rounded-sm bg-error/10 border border-error/30 text-center">
                      <p className="text-small text-error font-medium">{submitError}</p>
                    </div>
                  )}
                </m.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <m.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center gap-10"
                >
                  <div
                    className="rounded-full flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
                    style={{ backgroundColor: "#C4A77D20" }}
                  >
                    <Check size={32} className="sm:w-10 sm:h-10" strokeWidth={1} style={{ color: "#C4A77D" }} />
                  </div>
                  <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md px-4">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-medium leading-tight"
                      style={{ color: "#39424E", letterSpacing: "-0.02em" }}
                    >
                      Hemos recibido tus datos
                    </h3>
                    <p
                      className="text-sm sm:text-base font-normal leading-relaxed"
                      style={{ color: "#39424E", opacity: 0.7 }}
                    >
                      Uno de nuestros asesores te contactará pronto para ayudarte con tu solicitud.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mt-6">
                      <Button variant="link" icon={<ArrowRight size={16} strokeWidth={1} />} iconPosition="end">
                        Explorar vuelos
                      </Button>
                      <span style={{ color: "#E0E0DE" }}>|</span>
                      <Button variant="link" icon={<ArrowRight size={16} strokeWidth={1} />} iconPosition="end">
                        Publicar un vuelo
                      </Button>
                    </div>
                  </div>
                </m.div>
              )}
            </div>

            {/* Right Arrow */}
            {step !== 4 && (
              <IconButton
                type={step === 3 ? "submit" : "button"}
                onClick={step < 3 ? handleNext : undefined}
                disabled={step === 1 && !userType}
                icon={
                  isSubmitting ? (
                    <div className="animate-spin">
                      <Loader2 size={32} strokeWidth={1} style={{ color: "#C4A77D" }} />
                    </div>
                  ) : (
                    <ChevronRight size={32} strokeWidth={1} style={{ color: "#39424E" }} />
                  )
                }
                tooltip={step === 3 ? "Enviar" : "Siguiente"}
              />
            )}
          </div>
        </div>
      </form>
    </section>
  );
});

ContactSection.displayName = "ContactSection";
