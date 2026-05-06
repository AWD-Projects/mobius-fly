"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { InputGroup } from "./InputGroup";
import { SelectGroup } from "./SelectGroup";
import { DocumentUpload, UploadedDocument } from "./DocumentUpload";
import { DateOfBirthPicker } from "./DateOfBirthPicker";
import { PhoneInput } from "./PhoneInput";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const computeAge = (isoDate: string): number => {
  const birth = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const createSchema = (passengerType: "adult" | "minor") =>
  z
    .object({
      fullName: z.string().min(1, "Nombre requerido"),
      sex: z.string().min(1, "Sexo requerido"),
      dateOfBirth: z
        .string()
        .min(1, "Fecha de nacimiento requerida")
        .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), "Fecha de nacimiento no válida")
        .refine((date) => {
          const d = new Date(date);
          if (isNaN(d.getTime())) return false;
          const year = d.getUTCFullYear();
          const currentYear = new Date().getUTCFullYear();
          return year >= 1900 && year <= currentYear && d.getTime() <= Date.now();
        }, "Fecha de nacimiento no válida")
        .refine(
          (date) =>
            passengerType === "adult" ? computeAge(date) >= 18 : computeAge(date) < 18,
          passengerType === "adult"
            ? "El pasajero adulto debe ser mayor de 18 años"
            : "El pasajero menor debe tener menos de 18 años"
        ),
      email: z.string().min(1, "Correo requerido").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Correo no válido" }),
      phone: z
        .string()
        .min(1, "Teléfono requerido")
        .refine((v) => isValidPhoneNumber(v), "Número telefónico no válido"),
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
        if (!data.responsiblePhone) {
          ctx.addIssue({ code: "custom", path: ["responsiblePhone"], message: "Teléfono requerido" });
        } else if (!isValidPhoneNumber(data.responsiblePhone)) {
          ctx.addIssue({ code: "custom", path: ["responsiblePhone"], message: "Número telefónico no válido" });
        }
      }
    });

export type PassengerFormData = z.infer<ReturnType<typeof createSchema>>;

// ─── Handle ──────────────────────────────────────────────────────────────────

export interface PassengerFormHandle {
  submit: () => Promise<boolean>;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface PassengerFormProps {
  title: string;
  passengerType?: "adult" | "minor";
  defaultValues?: Partial<PassengerFormData>;
  document?: UploadedDocument;
  isDocumentLoading?: boolean;
  onSubmit?: (data: PassengerFormData) => void;
  onDocumentUpload?: (file: File) => void;
  onDocumentRemove?: () => void;
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

const PassengerForm = React.forwardRef<PassengerFormHandle, PassengerFormProps>(
  (
    {
      title,
      passengerType = "adult",
      defaultValues,
      document,
      isDocumentLoading = false,
      onSubmit,
      onDocumentUpload,
      onDocumentRemove,
      className,
    },
    ref
  ) => {
    const schema = React.useMemo(() => createSchema(passengerType), [passengerType]);

    const { dobMin, dobMax } = React.useMemo(() => {
      const today = new Date();
      const toIso = (d: Date) => {
        const y = d.getFullYear().toString().padStart(4, "0");
        const m = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${y}-${m}-${day}`;
      };
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      if (passengerType === "adult") {
        return { dobMin: "1900-01-01", dobMax: toIso(eighteenYearsAgo) };
      }
      const minorMin = new Date(eighteenYearsAgo);
      minorMin.setDate(minorMin.getDate() + 1);
      return { dobMin: toIso(minorMin), dobMax: toIso(today) };
    }, [passengerType]);

    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<PassengerFormData>({
      resolver: zodResolver(schema),
      mode: "onBlur",
      reValidateMode: "onChange",
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

    React.useImperativeHandle(ref, () => ({
      submit: () =>
        new Promise<boolean>((resolve) => {
          handleSubmit(
            (data) => {
              if (!document) {
                setDocumentError("Documento de identificación requerido");
                resolve(false);
                return;
              }
              setDocumentError(null);
              onSubmit?.(data);
              resolve(true);
            },
            () => resolve(false),
          )();
        }),
    }));

    return (
      <div
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
            <div>
              <label className="block text-small font-medium tracking-[0.01em] text-secondary mb-2">
                Fecha de nacimiento <span className="text-error ml-1">*</span>
              </label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DateOfBirthPicker
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    min={dobMin}
                    max={dobMax}
                    error={!!errors.dateOfBirth}
                  />
                )}
              />
              {errors.dateOfBirth?.message && (
                <p className="mt-2 text-small text-error">{errors.dateOfBirth.message}</p>
              )}
            </div>
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
            <div>
              <label className="block text-small font-medium tracking-[0.01em] text-secondary mb-2">
                Número de contacto <span className="text-error ml-1">*</span>
              </label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!errors.phone}
                  />
                )}
              />
              {errors.phone?.message && (
                <p className="mt-2 text-small text-error">{errors.phone.message}</p>
              )}
            </div>
          </FormSection>

          {/* Section 3: ID Document */}
          <FormSection title="Documento de identificación">
            <div className="flex flex-col gap-1">
              <p className="text-small font-medium tracking-[0.01em] text-secondary">
                Identificación oficial <span className="text-error ml-1">*</span>
              </p>
              <DocumentUpload
                document={document}
                isLoading={isDocumentLoading}
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
                <div className="flex-1">
                  <label className="block text-small font-medium tracking-[0.01em] text-secondary mb-2">
                    Teléfono de contacto <span className="text-error ml-1">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="responsiblePhone"
                    render={({ field }) => (
                      <PhoneInput
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={!!errors.responsiblePhone}
                      />
                    )}
                  />
                  {errors.responsiblePhone?.message && (
                    <p className="mt-2 text-small text-error">{errors.responsiblePhone.message}</p>
                  )}
                </div>
              </FormRow>
            </FormSection>
          )}

        </form>
      </div>
    );
  }
);

PassengerForm.displayName = "PassengerForm";

export { PassengerForm, FormSection, FormRow };
