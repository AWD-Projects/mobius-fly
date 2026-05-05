/**
 * Root Layout
 * Mobius Fly - Empty Leg Marketplace
 *
 * Global layout with:
 * - Base SEO metadata
 * - Organization & Website structured data
 * - Font optimization
 * - Google Search Console verification
 */

import type { Metadata } from "next";
import "../styles/globals.css";
import { baseMetadata } from "@/lib/seo/metadata";
import { JsonLdMultiple } from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/json-ld";
import { ToastProvider } from "@/components/atoms/Toast";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = baseMetadata;

// ============================================================================
// ROOT LAYOUT
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />

        {/* Organization & Website Structured Data */}
        <JsonLdMultiple
          schemas={[
            getOrganizationSchema(),
            getWebSiteSchema(),
          ]}
        />
      </head>
      <body className="antialiased">
        {children}
        <ToastProvider position="top-right" />
      </body>
    </html>
  );
}
