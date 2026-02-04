"use client";

import * as React from "react";
import { InputGroup } from "./InputGroup";
import { SelectGroup } from "./SelectGroup";
import { DocumentUpload, UploadedDocument } from "./DocumentUpload";
import { cn } from "@/lib/utils";

export interface PassengerFormData {
  fullName: string;
  sex: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  document?: UploadedDocument;
  // For minors
  responsibleName?: string;
  responsibleRelationship?: string;
  responsiblePhone?: string;
}

export interface PassengerFormProps {
  title: string;
  passengerType?: "adult" | "minor";
  data?: Partial<PassengerFormData>;
  onChange?: (data: Partial<PassengerFormData>) => void;
  onDocumentUpload?: (file: File) => void;
  onDocumentRemove?: () => void;
  className?: string;
}

const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-body font-semibold text-text">{title}</h4>
    {children}
  </div>
);

const FormRow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex gap-4", className)}>{children}</div>
);

const PassengerForm = React.forwardRef<HTMLDivElement, PassengerFormProps>(
  (
    {
      title,
      passengerType = "adult",
      data = {},
      onChange,
      onDocumentUpload,
      onDocumentRemove,
      className,
    },
    ref
  ) => {
    const handleChange = (field: keyof PassengerFormData, value: string) => {
      onChange?.({ ...data, [field]: value });
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 p-8 rounded-2xl",
          "bg-surface border border-border",
          className
        )}
      >
        {/* Title */}
        <h3 className="text-h4 font-semibold text-text">{title}</h3>

        {/* Section 1: Personal Data */}
        <FormSection title="Datos personales">
          <FormRow>
            <InputGroup
              label="Nombre completo"
              value={data.fullName ?? ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nombre completo"
              className="flex-1"
            />
            <SelectGroup
              label="Sexo"
              value={data.sex ?? ""}
              onChange={(e) => handleChange("sex", e.target.value)}
              className="flex-1"
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
            value={data.dateOfBirth ?? ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </FormSection>

        {/* Section 2: Contact */}
        <FormSection title="Contacto">
          <InputGroup
            label="Correo electronico"
            type="email"
            value={data.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
          />
          <InputGroup
            label="Numero de contacto"
            type="tel"
            value={data.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+52 55 1234 5678"
          />
        </FormSection>

        {/* Section 3: ID Document */}
        <FormSection title="Documento de identificacion">
          <DocumentUpload
            document={data.document}
            onUpload={onDocumentUpload}
            onRemove={onDocumentRemove}
            pendingTitle="Sube tu documento"
            pendingDescription="Haz clic o arrastra tu archivo aqui"
            variant="compact"
          />
        </FormSection>

        {/* Section 4: Responsible Adult (only for minors) */}
        {passengerType === "minor" && (
          <FormSection title="Adulto responsable">
            <InputGroup
              label="Nombre del responsable"
              value={data.responsibleName ?? ""}
              onChange={(e) => handleChange("responsibleName", e.target.value)}
              placeholder="Nombre completo"
            />
            <FormRow>
              <SelectGroup
                label="Relacion"
                value={data.responsibleRelationship ?? ""}
                onChange={(e) =>
                  handleChange("responsibleRelationship", e.target.value)
                }
                className="flex-1"
              >
                <option value="">Seleccionar</option>
                <option value="parent">Padre/Madre</option>
                <option value="guardian">Tutor legal</option>
                <option value="grandparent">Abuelo/a</option>
                <option value="other">Otro</option>
              </SelectGroup>
              <InputGroup
                label="Telefono de contacto"
                type="tel"
                value={data.responsiblePhone ?? ""}
                onChange={(e) =>
                  handleChange("responsiblePhone", e.target.value)
                }
                placeholder="+52 55 1234 5678"
                className="flex-1"
              />
            </FormRow>
          </FormSection>
        )}
      </div>
    );
  }
);

PassengerForm.displayName = "PassengerForm";

export { PassengerForm, FormSection, FormRow };
