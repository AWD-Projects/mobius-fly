import { z } from "zod";

/**
 * Contact Form Validation Schemas
 */

// Step 1: User Type Selection
export const contactUserTypeSchema = z.object({
  userType: z.enum(["reservar", "administrar"], {
    message: "Debes seleccionar una opción",
  }),
});

// Step 2: Contact Information
export const contactInfoSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico inválido"),
  phone: z.string().optional(),
});

// Step 3: Message
export const contactMessageSchema = z.object({
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje es demasiado largo"),
});

// Complete contact form
export const contactFormSchema = z.object({
  userType: z.enum(["reservar", "administrar"]),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(1000),
});

// Types
export type ContactUserTypeFormData = z.infer<typeof contactUserTypeSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type ContactMessageFormData = z.infer<typeof contactMessageSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
