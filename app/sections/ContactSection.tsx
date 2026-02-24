import * as React from "react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, ArrowRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Textarea } from "@/components/atoms/Textarea";
import { Button } from "@/components/atoms/Button";

interface ContactData {
  userType: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactSectionProps {
  sectionPadding: string;
  contactStep: number;
  contactData: ContactData;
  isSubmitting: boolean;
  submitError: string | null;
  onContactDataChange: (data: ContactData) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  onContactTypeSelect: (type: string) => void;
}

export const ContactSection = React.memo<ContactSectionProps>(({
  sectionPadding,
  contactStep,
  contactData,
  isSubmitting,
  submitError,
  onContactDataChange,
  onPrevClick,
  onNextClick,
  onContactTypeSelect,
}) => {
  const handleNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onContactDataChange({ ...contactData, name: e.target.value });
  }, [contactData, onContactDataChange]);

  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onContactDataChange({ ...contactData, email: e.target.value });
  }, [contactData, onContactDataChange]);

  const handlePhoneChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onContactDataChange({ ...contactData, phone: e.target.value });
  }, [contactData, onContactDataChange]);

  const handleMessageChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContactDataChange({ ...contactData, message: e.target.value });
  }, [contactData, onContactDataChange]);

  return (
    <section
      id="contacto"
      className={`snap-start h-screen relative flex flex-col justify-center ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-12">
        {/* Header */}
        {contactStep !== 4 && (
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
          {contactStep !== 4 && (
            <IconButton
              onClick={onPrevClick}
              disabled={contactStep === 1 || isSubmitting}
              icon={<ChevronLeft size={32} strokeWidth={1} style={{ color: "#39424E" }} />}
              tooltip="Anterior"
            />
          )}

          {/* Form Content */}
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center">
            {/* Step 1: User Type Selection */}
            {contactStep === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-8"
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
                    title="Reservar un vuelo"
                    description="Explorar vuelos privados disponibles"
                    isSelected={contactData.userType === "reservar"}
                    onClick={() => onContactTypeSelect("reservar")}
                  />

                  <SelectionCard
                    title="Administrar mis vuelos"
                    description="Soy operador o propietario de aeronaves"
                    isSelected={contactData.userType === "administrar"}
                    onClick={() => onContactTypeSelect("administrar")}
                  />
                </div>
              </m.div>
            )}

            {/* Step 2: Contact Information */}
            {contactStep === 2 && (
              <m.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-8"
              >
                <p
                  className="text-sm sm:text-base font-normal text-center"
                  style={{
                    color: "#39424E",
                    opacity: 0.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ¿Cómo podemos contactarte?
                </p>

                <div className="w-full flex flex-col gap-4">
                  <InputGroup
                    label="Nombre"
                    type="text"
                    value={contactData.name}
                    onChange={handleNameChange}
                    required
                  />

                  <InputGroup
                    label="Correo"
                    type="email"
                    value={contactData.email}
                    onChange={handleEmailChange}
                    required
                  />

                  <InputGroup
                    label="Número telefónico (opcional)"
                    type="tel"
                    value={contactData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </m.div>
            )}

            {/* Step 3: Additional Message */}
            {contactStep === 3 && (
              <m.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-8"
              >
                <p
                  className="text-sm sm:text-base font-normal text-center"
                  style={{
                    color: "#39424E",
                    opacity: 0.8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ¿Hay algo más qué quieras contarnos?
                </p>

                <Textarea
                  value={contactData.message}
                  onChange={handleMessageChange}
                  rows={6}
                  className="resize-none"
                />

                {submitError && (
                  <div
                    className="w-full p-4 rounded-lg text-center"
                    style={{
                      backgroundColor: "#FEE2E2",
                      border: "1px solid #FCA5A5",
                    }}
                  >
                    <p
                      style={{
                        color: "#991B1B",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {submitError}
                    </p>
                  </div>
                )}
              </m.div>
            )}

            {/* Step 4: Success */}
            {contactStep === 4 && (
              <m.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-10"
              >
                {/* Success Icon */}
                <div
                  className="rounded-full flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
                  style={{
                    backgroundColor: "#C4A77D20",
                  }}
                >
                  <Check size={32} className="sm:w-10 sm:h-10" strokeWidth={1} style={{ color: "#C4A77D" }} />
                </div>

                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md px-4">
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-medium leading-tight"
                    style={{
                      color: "#39424E",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Hemos recibido tus datos
                  </h3>
                  <p
                    className="text-sm sm:text-base font-normal leading-relaxed"
                    style={{
                      color: "#39424E",
                      opacity: 0.7,
                    }}
                  >
                    Uno de nuestros asesores te contactará pronto para ayudarte con tu solicitud.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mt-6">
                    <Button
                      variant="link"
                      icon={<ArrowRight size={16} strokeWidth={1} />}
                      iconPosition="end"
                    >
                      Explorar vuelos
                    </Button>

                    <span style={{ color: "#E0E0DE" }}>|</span>

                    <Button
                      variant="link"
                      icon={<ArrowRight size={16} strokeWidth={1} />}
                      iconPosition="end"
                    >
                      Publicar un vuelo
                    </Button>
                  </div>
                </div>
              </m.div>
            )}
          </div>

          {/* Right Arrow */}
          {contactStep !== 4 && (
            <IconButton
              onClick={onNextClick}
              disabled={
                (contactStep === 1 && !contactData.userType) ||
                (contactStep === 2 && (!contactData.name.trim() || !contactData.email.trim())) ||
                (contactStep === 3 && !contactData.message.trim()) ||
                isSubmitting
              }
              icon={
                isSubmitting ? (
                  <div className="animate-spin">
                    <Loader2 size={32} strokeWidth={1} style={{ color: "#C4A77D" }} />
                  </div>
                ) : (
                  <ChevronRight size={32} strokeWidth={1} style={{ color: "#39424E" }} />
                )
              }
              tooltip={contactStep === 3 ? "Enviar" : "Siguiente"}
            />
          )}
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";
