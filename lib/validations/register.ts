import { z } from "zod";

/**
 * Register Form Validation Schemas
 */

// Step 1: User Type Selection
export const userTypeSchema = z.object({
  userType: z.enum(["buyer", "owner"], {
    message: "Debes seleccionar un tipo de usuario",
  }),
});

// Step 2: Account Creation
export const accountSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),
  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "Debes ser mayor de 18 años"),
  gender: z.enum(["male", "female", "other"], {
    message: "Debes seleccionar un sexo",
  }),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico inválido"),
  phone: z.string().optional(),
});

// Step 3: Identity Verification
export const identitySchema = z.object({
  idDocument: z
    .instanceof(File, { message: "Debes subir un documento de identidad" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "El archivo debe ser menor a 5MB")
    .refine(
      (file) => ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
      "Solo se permiten archivos PNG, JPG o PDF"
    ),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
});

// Step 5: Email Verification
export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código solo puede contener números"),
});

// Step 6: Password Creation
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Types
export type UserTypeFormData = z.infer<typeof userTypeSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type IdentityFormData = z.infer<typeof identitySchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
