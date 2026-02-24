/**
 * JSON-LD Component
 * Mobius Fly - Empty Leg Marketplace
 *
 * Safe rendering of JSON-LD structured data
 * Prevents XSS and ensures valid schema output
 */

import React from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[] | null;
}

/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data in a script tag
 * Handles both single schemas and arrays of schemas
 *
 * @example
 * ```tsx
 * import { JsonLd } from '@/components/seo/JsonLd';
 * import { getOrganizationSchema } from '@/lib/seo/json-ld';
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <JsonLd data={getOrganizationSchema()} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  // Safely serialize data
  const jsonString = JSON.stringify(data, null, 0);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
      // Suppress hydration warning since this is static data
      suppressHydrationWarning
    />
  );
}

/**
 * Multiple JSON-LD schemas component
 *
 * @example
 * ```tsx
 * <JsonLdMultiple
 *   schemas={[
 *     getOrganizationSchema(),
 *     getWebSiteSchema(),
 *     getFlightSchema(flight)
 *   ]}
 * />
 * ```
 */
export function JsonLdMultiple({
  schemas,
}: {
  schemas: (Record<string, unknown> | null)[];
}) {
  const validSchemas = schemas.filter((s) => s !== null);

  if (validSchemas.length === 0) return null;

  // If single schema, render directly
  if (validSchemas.length === 1) {
    return <JsonLd data={validSchemas[0]} />;
  }

  // Multiple schemas: wrap in @graph
  const graphData = {
    "@context": "https://schema.org",
    "@graph": validSchemas,
  };

  return <JsonLd data={graphData} />;
}
