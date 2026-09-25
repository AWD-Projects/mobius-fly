/**
 * Root Layout
 * Mobius Fly - Empty Leg Marketplace
 *
 * Global layout with:
 * - Base SEO metadata + viewport (lib/seo/metadata.ts)
 * - Search Console verification via NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
 * - Site-wide JSON-LD is emitted per page (home) to avoid duplicate entities
 */

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../styles/globals.css";
import { baseMetadata, baseViewport } from "@/lib/seo/metadata";
import { ToastProvider } from "@/components/atoms/Toast";
import { AutoSignOutProvider } from "@/components/providers/AutoSignOutProvider";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-C6P3MK533B";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

// ============================================================================
// ROOT LAYOUT
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <ToastProvider position="top-right" />
        <AutoSignOutProvider />

        {/* Google Analytics (gtag.js) — production only */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
