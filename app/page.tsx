import { getHomeMetadata } from "@/lib/seo/metadata";
import { JsonLdMultiple } from "@/components/seo/JsonLd";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServiceSchema,
  getWebPageSchema,
  getFAQSchema,
} from "@/lib/seo/json-ld";
import { faqCompradores, faqPropietarios } from "@/lib/content/faq";
import HomeClient from "./HomeClient";

export const metadata = getHomeMetadata();

export default function HomePage() {
  const meta = getHomeMetadata();

  return (
    <>
      <JsonLdMultiple
        schemas={[
          getOrganizationSchema(),
          getWebSiteSchema(),
          getWebPageSchema({
            path: "/",
            name: String(meta.title),
            description: String(meta.description),
          }),
          getServiceSchema(),
          getFAQSchema([...faqCompradores, ...faqPropietarios]),
        ]}
      />
      <HomeClient />
    </>
  );
}
