/**
 * Font Configuration
 * Mobius Fly - Empty Leg Marketplace
 *
 * Self-hosted fonts using next/font
 * Zero layout shift, no render-blocking requests
 */

import { Inter } from "next/font/google";

// ============================================================================
// GOOGLE FONTS
// ============================================================================

/**
 * Inter Font
 * Used as primary font throughout the application
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  adjustFontFallback: true,
});

// ============================================================================
// FONT UTILITIES
// ============================================================================

/**
 * Font family utility for inline styles
 * Use when you need to apply font-family directly
 */
export const fontFamily = inter.style.fontFamily;

/**
 * Font className for components
 * Use in className prop: className={cn(inter.className, "...")}
 */
export const fontClassName = inter.className;

/**
 * CSS variable for font
 * Use in Tailwind: font-sans or font-[var(--font-inter)]
 */
export const fontVariable = inter.variable;
