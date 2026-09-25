/**
 * JSON-LD component — safe rendering of structured data.
 */

import { serializeJsonLd } from "@/lib/seo/json-ld";

type Schema = Record<string, unknown>;

export function JsonLd({ data }: { data: Schema | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

/** Several schemas in one @graph (their own @context is stripped). */
export function JsonLdMultiple({ schemas }: { schemas: (Schema | null)[] }) {
  const valid = schemas.filter((s): s is Schema => s !== null);
  if (valid.length === 0) return null;
  if (valid.length === 1) return <JsonLd data={valid[0]} />;

  const graph = valid.flatMap((s) => {
    if (Array.isArray(s["@graph"])) return s["@graph"] as Schema[];
    const { "@context": _ctx, ...rest } = s;
    return [rest];
  });

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
