/**
 * Landing Page Layout
 * Mobius Fly - Empty Leg Marketplace
 *
 * Specific layout for landing page with SEO metadata
 */

import { getLandingMetadata } from "@/lib/seo/metadata";
import { JsonLdMultiple } from "@/components/seo/JsonLd";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServiceSchema,
} from "@/lib/seo/json-ld";

// ============================================================================
// METADATA
// ============================================================================

export const metadata = getLandingMetadata();

// ============================================================================
// LAYOUT
// ============================================================================

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for Landing Page */}
      <JsonLdMultiple
        schemas={[
          getOrganizationSchema(),
          getWebSiteSchema(),
          getServiceSchema(),
        ]}
      />

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/assets/window.jpg"
        as="image"
        type="image/jpeg"
      />

      {children}
    </>
  );
}
