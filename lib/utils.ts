import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fontFamily as interFontFamily } from "./fonts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Default font family for the application.
 * Uses next/font optimized Inter font
 */
export const fontFamily = interFontFamily;
