"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputGroup } from "./InputGroup";
import { SelectGroup } from "./SelectGroup";
import { DocumentUpload, UploadedDocument } from "./DocumentUpload";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const createSchema = (passengerType: "adult" | "minor") =>
  z
    .object({
      fullName: z.string().min(1, "Nombre requerido"),
      sex: z.string().min(1, "Sexo requerido"),
      dateOfBirth: z.string().min(1, "Fecha de nacimiento requerida"),
      email: z.string().min(1, "Correo requerido").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Correo no válido" }),
      phone: z.string().min(7, "Teléfono requerido"),
      responsibleName: z.string().optional(),
      responsibleRelationship: z.string().optional(),
      responsiblePhone: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (passengerType === "minor") {
        if (!data.responsibleName)
          ctx.addIssue({ code: "custom", path: ["responsibleName"], message: "Nombre del responsable requerido" });
        if (!data.responsibleRelationship)
          ctx.addIssue({ code: "custom", path: ["responsibleRelationship"], message: "Relación requerida" });
        if (!data.responsiblePhone || data.responsiblePhone.length < 7)
          ctx.addIssue({ code: "custom", path: ["responsiblePhone"], message: "Teléfono requerido" });
      }
    });

export type PassengerFormData = z.infer<ReturnType<typeof createSchema>>;

// ─── Props ───────────────────────────────────────────────────────────────────

export interface PassengerFormProps {
  title: string;
  passengerType?: "adult" | "minor";
  defaultValues?: Partial<PassengerFormData>;
  document?: UploadedDocument;
  onSubmit?: (data: PassengerFormData) => void;
  onDocumentUpload?: (file: File) => void;
  onDocumentRemove?: () => void;
  submitLabel?: string;
  className?: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-body font-semibold text-text">{title}</h4>
    {children}
  </div>
);

const FormRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn("flex gap-4", className)}>{children}</div>;

// ─── Component ───────────────────────────────────────────────────────────────

const PassengerForm = React.forwardRef<HTMLDivElement, PassengerFormProps>(
  (
    {
      title,
      passengerType = "adult",
      defaultValues,
      document,
      onSubmit,
      onDocumentUpload,
      onDocumentRemove,
      submitLabel = "Guardar pasajero",
      className,
    },
    ref
  ) => {
    const schema = React.useMemo(() => createSchema(passengerType), [passengerType]);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<PassengerFormData>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues ?? {},
    });

    const [documentError, setDocumentError] = React.useState<string | null>(null);

    const handleFormSubmit = (data: PassengerFormData) => {
      if (!document) {
        setDocumentError("Documento de identificación requerido");
        return;
      }
      setDocumentError(null);
      onSubmit?.(data);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 p-8 rounded-md bg-surface border border-border",
          className
        )}
      >
        <h3 className="text-h4 font-semibold text-text">{title}</h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-6">

          {/* Section 1: Personal Data */}
          <FormSection title="Datos personales">
            <FormRow>
              <InputGroup
                label="Nombre completo"
                placeholder="Nombre completo"
                required
                className="flex-1"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <SelectGroup
                label="Sexo"
                required
                className="flex-1"
                error={errors.sex?.message}
                {...register("sex")}
              >
                <option value="">Seleccionar</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </SelectGroup>
            </FormRow>
            <InputGroup
              label="Fecha de nacimiento"
              type="date"
              required
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
          </FormSection>

          {/* Section 2: Contact */}
          <FormSection title="Contacto">
            <InputGroup
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />
            <InputGroup
              label="Número de contacto"
              type="tel"
              placeholder="+52 55 1234 5678"
              required
              error={errors.phone?.message}
              {...register("phone")}
            />
          </FormSection>

          {/* Section 3: ID Document */}
          <FormSection title="Documento de identificación">
            <div className="flex flex-col gap-1">
              <p className="text-small font-medium tracking-[0.01em] text-secondary">
                Identificación oficial <span className="text-error ml-1">*</span>
              </p>
              <DocumentUpload
                document={document}
                onUpload={(file) => { setDocumentError(null); onDocumentUpload?.(file); }}
                onRemove={onDocumentRemove}
                accept=".pdf,image/jpeg,image/png"
                pendingTitle="Sube tu documento"
                pendingDescription="Haz clic o arrastra tu archivo aquí"
                variant="compact"
              />
              {documentError && (
                <p className="mt-2 text-small text-error">{documentError}</p>
              )}
            </div>
          </FormSection>

          {/* Section 4: Responsible Adult (minors only) */}
          {passengerType === "minor" && (
            <FormSection title="Adulto responsable">
              <InputGroup
                label="Nombre del responsable"
                placeholder="Nombre completo"
                required
                error={errors.responsibleName?.message}
                {...register("responsibleName")}
              />
              <FormRow>
                <SelectGroup
                  label="Relación"
                  required
                  className="flex-1"
                  error={errors.responsibleRelationship?.message}
                  {...register("responsibleRelationship")}
                >
                  <option value="">Seleccionar</option>
                  <option value="parent">Padre/Madre</option>
                  <option value="guardian">Tutor legal</option>
                  <option value="grandparent">Abuelo/a</option>
                  <option value="other">Otro</option>
                </SelectGroup>
                <InputGroup
                  label="Teléfono de contacto"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  required
                  className="flex-1"
                  error={errors.responsiblePhone?.message}
                  {...register("responsiblePhone")}
                />
              </FormRow>
            </FormSection>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full"
          >
            {submitLabel}
          </Button>

        </form>
      </div>
    );
  }
);

PassengerForm.displayName = "PassengerForm";

export { PassengerForm, FormSection, FormRow };
