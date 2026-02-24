/**
 * JSON-LD Structured Data Schemas
 * Mobius Fly - Empty Leg Marketplace
 *
 * Type-safe JSON-LD generators for SEO
 * Follows schema.org standards
 */

import { SITE_CONFIG } from "./metadata";

// ============================================================================
// TYPES
// ============================================================================

interface Airport {
  code: string;
  name: string;
  city: string;
  country?: string;
}

interface Flight {
  id: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime?: string;
  aircraft?: string;
  price?: {
    amount: number;
    currency: string;
  };
  seats?: number;
  operator?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// ORGANIZATION SCHEMA
// ============================================================================

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mobius Fly",
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo/main-logo.svg`,
    description: SITE_CONFIG.description,
    sameAs: [
      "https://twitter.com/mobiusfly",
      "https://linkedin.com/company/mobiusfly",
      "https://instagram.com/mobiusfly",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@mobiusfly.com",
      availableLanguage: ["English", "Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };
}

// ============================================================================
// WEBSITE + SEARCH ACTION SCHEMA
// ============================================================================

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mobius Fly",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}&origin={origin}&destination={destination}`,
      },
      "query-input": [
        {
          "@type": "PropertyValueSpecification",
          valueRequired: false,
          valueName: "search_term_string",
        },
        {
          "@type": "PropertyValueSpecification",
          valueRequired: false,
          valueName: "origin",
        },
        {
          "@type": "PropertyValueSpecification",
          valueRequired: false,
          valueName: "destination",
        },
      ],
    },
  };
}

// ============================================================================
// FLIGHT SCHEMA
// ============================================================================

export function getFlightSchema(flight: Flight) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Flight",
    flightNumber: flight.id,
    departureAirport: {
      "@type": "Airport",
      iataCode: flight.origin.code,
      name: flight.origin.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: flight.origin.city,
        addressCountry: flight.origin.country || "Unknown",
      },
    },
    arrivalAirport: {
      "@type": "Airport",
      iataCode: flight.destination.code,
      name: flight.destination.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: flight.destination.city,
        addressCountry: flight.destination.country || "Unknown",
      },
    },
    departureTime: flight.departureTime,
    provider: {
      "@type": "Organization",
      name: flight.operator || "Mobius Fly",
    },
  };

  if (flight.arrivalTime) {
    schema.arrivalTime = flight.arrivalTime;
  }

  if (flight.aircraft) {
    schema.aircraft = {
      "@type": "Vehicle",
      name: flight.aircraft,
    };
  }

  return schema;
}

// ============================================================================
// PRODUCT/OFFER SCHEMA (For Flight as Product)
// ============================================================================

export function getFlightOfferSchema(flight: Flight) {
  if (!flight.price) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Private Jet Flight from ${flight.origin.code} to ${flight.destination.code}`,
    description: `Empty leg flight from ${flight.origin.city} to ${flight.destination.city}. ${flight.seats ? `${flight.seats} seats available.` : ""} ${flight.aircraft ? `Aircraft: ${flight.aircraft}.` : ""}`,
    offers: {
      "@type": "Offer",
      price: flight.price.amount,
      priceCurrency: flight.price.currency,
      availability: flight.seats && flight.seats > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_CONFIG.url}/flights/${flight.id}`,
      seller: {
        "@type": "Organization",
        name: "Mobius Fly",
      },
      priceValidUntil: flight.departureTime,
    },
    category: "Private Aviation",
  };
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

// ============================================================================
// SERVICE SCHEMA
// ============================================================================

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Empty Leg Flight Booking",
    provider: {
      "@type": "Organization",
      name: "Mobius Fly",
      url: SITE_CONFIG.url,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Empty Leg Flights",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Private Jet Empty Legs",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Empty Leg Flight Booking",
                description: "Book individual seats on private jet empty leg flights",
              },
            },
          ],
        },
      ],
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "500",
      highPrice: "5000",
    },
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Safely stringify JSON-LD for use in script tags
 */
export function jsonLdToString(data: Record<string, unknown> | null): string {
  if (!data) return "";
  return JSON.stringify(data, null, 0);
}

/**
 * Generate multiple schemas for a page
 */
export function combineSchemas(...schemas: (Record<string, unknown> | null)[]): string {
  const validSchemas = schemas.filter((s) => s !== null);
  if (validSchemas.length === 0) return "";
  if (validSchemas.length === 1) return jsonLdToString(validSchemas[0]);

  // Multiple schemas: use @graph
  return jsonLdToString({
    "@context": "https://schema.org",
    "@graph": validSchemas,
  });
}
