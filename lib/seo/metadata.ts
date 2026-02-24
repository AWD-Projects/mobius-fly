/**
 * SEO Metadata Configuration
 * Mobius Fly - Empty Leg Marketplace
 *
 * Centralized metadata generation for all public pages
 * Supports dynamic content and multi-language (prepared for i18n)
 */

import type { Metadata } from "next";

// ============================================================================
// CONFIGURATION
// ============================================================================

export const SITE_CONFIG = {
  name: "Mobius Fly",
  url: "https://mobiusfly.com",
  ogImage: "/og-image.jpg",
  description: "Book verified private jet empty legs at exclusive rates. Travel privately with unmatched simplicity and confidence.",
  keywords: [
    "empty leg flights",
    "private jet",
    "charter flights",
    "luxury travel",
    "private aviation",
    "empty legs",
    "discounted private jets",
    "jet charter",
    "private jet booking",
    "empty leg marketplace",
  ],
  twitterHandle: "@mobiusfly",
  locale: "en_US",
  alternateLocales: ["es_ES", "es_MX"],
};

// ============================================================================
// BASE METADATA
// ============================================================================

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: "Mobius Fly Team" }],
  creator: "Mobius Fly",
  publisher: "Mobius Fly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    alternateLocale: SITE_CONFIG.alternateLocales,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Empty Leg Flights`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/main-logo.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/logo/main-logo.svg",
  },
  manifest: "/site.webmanifest",
};

// ============================================================================
// NOINDEX METADATA (Private Routes)
// ============================================================================

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// ============================================================================
// PAGE-SPECIFIC METADATA GENERATORS
// ============================================================================

/**
 * Landing Page Metadata
 */
export function getLandingMetadata(): Metadata {
  return {
    title: "Empty Leg Flights | Private Jet Seats at Reduced Rates",
    description: "Book verified private jet empty legs at exclusive rates. Travel privately with unmatched simplicity and confidence.",
    openGraph: {
      title: "Empty Leg Flights | Private Jet Seats at Reduced Rates | Mobius Fly",
      description: "Book verified private jet empty legs at exclusive rates. Travel privately with unmatched simplicity and confidence.",
      url: SITE_CONFIG.url,
      type: "website",
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Mobius Fly - Empty Leg Flights",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Empty Leg Flights | Private Jet Seats at Reduced Rates",
      description: "Book verified private jet empty legs at exclusive rates.",
      images: [`${SITE_CONFIG.url}/og-image.jpg`],
    },
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: {
        "en-US": `${SITE_CONFIG.url}`,
        "es-ES": `${SITE_CONFIG.url}/es`,
        "es-MX": `${SITE_CONFIG.url}/es-mx`,
      },
    },
  };
}

/**
 * Flight Detail Page Metadata
 */
export function getFlightMetadata(params: {
  origin: string;
  destination: string;
  date: string;
  flightId: string;
  price?: string;
  aircraft?: string;
  seats?: number;
}): Metadata {
  const { origin, destination, date, flightId, price, aircraft, seats } = params;

  const title = `Private Flight ${origin} to ${destination} | Empty Leg`;
  const description = `Reserve a seat on a private jet from ${origin} to ${destination} on ${date}. ${seats ? `${seats} seats available.` : ""} ${price ? `From ${price}.` : ""} Verified operator.`;
  const ogImageUrl = `${SITE_CONFIG.url}/api/og?origin=${origin}&destination=${destination}&date=${date}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Mobius Fly`,
      description,
      url: `${SITE_CONFIG.url}/flights/${flightId}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Flight ${origin} to ${destination}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/flights/${flightId}`,
    },
  };
}

/**
 * Search Results Metadata
 */
export function getSearchMetadata(params?: {
  origin?: string;
  destination?: string;
  date?: string;
}): Metadata {
  const { origin, destination, date } = params || {};

  let title = "Available Private Flights | Empty Legs";
  let description = "Explore available empty leg flights. Filter by origin, destination and date.";

  if (origin && destination) {
    title = `Private Flights from ${origin} to ${destination} | Empty Legs`;
    description = `Find available empty leg flights from ${origin} to ${destination}. ${date ? `Departing ${date}.` : ""} Book verified private jets.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Mobius Fly`,
      description,
      url: `${SITE_CONFIG.url}/search`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/search`,
    },
    robots: {
      index: true,
      follow: true,
      // Prevent indexing of paginated/filtered results to avoid duplicate content
      noarchive: !!(origin || destination || date),
    },
  };
}

/**
 * FAQ Page Metadata
 */
export function getFAQMetadata(): Metadata {
  return {
    title: "Frequently Asked Questions | Empty Leg Flights",
    description: "Get answers about booking empty leg flights, payment process, cancellations, and how Mobius Fly works.",
    openGraph: {
      title: "Frequently Asked Questions | Mobius Fly",
      description: "Get answers about booking empty leg flights, payment process, cancellations, and how Mobius Fly works.",
      url: `${SITE_CONFIG.url}/faq`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "FAQ | Mobius Fly",
      description: "Get answers about booking empty leg flights.",
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/faq`,
    },
  };
}

/**
 * How It Works Page Metadata
 */
export function getHowItWorksMetadata(): Metadata {
  return {
    title: "How It Works | Book Empty Leg Flights",
    description: "Learn how to book empty leg flights on Mobius Fly. Simple, secure, and transparent private jet booking.",
    openGraph: {
      title: "How It Works | Mobius Fly",
      description: "Learn how to book empty leg flights on Mobius Fly.",
      url: `${SITE_CONFIG.url}/how-it-works`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/how-it-works`,
    },
  };
}

/**
 * Benefits Page Metadata
 */
export function getBenefitsMetadata(): Metadata {
  return {
    title: "Benefits | Why Choose Mobius Fly",
    description: "Discover the benefits of booking empty leg flights. Verified operators, secure payments, no memberships required.",
    openGraph: {
      title: "Benefits | Why Choose Mobius Fly",
      description: "Discover the benefits of booking empty leg flights.",
      url: `${SITE_CONFIG.url}/benefits`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/benefits`,
    },
  };
}

/**
 * Contact Page Metadata
 */
export function getContactMetadata(): Metadata {
  return {
    title: "Contact Us | Get in Touch",
    description: "Contact Mobius Fly for questions about empty leg flights, partnerships, or support.",
    openGraph: {
      title: "Contact Us | Mobius Fly",
      description: "Get in touch with our team.",
      url: `${SITE_CONFIG.url}/contact`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/contact`,
    },
  };
}

/**
 * Legal Pages Metadata
 */
export function getLegalMetadata(type: "terms" | "privacy"): Metadata {
  const titles = {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  };

  const descriptions = {
    terms: "Read the terms of service for using Mobius Fly empty leg marketplace.",
    privacy: "Learn how Mobius Fly protects your privacy and handles your data.",
  };

  return {
    title: titles[type],
    description: descriptions[type],
    openGraph: {
      title: `${titles[type]} | Mobius Fly`,
      description: descriptions[type],
      url: `${SITE_CONFIG.url}/${type}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${type}`,
    },
  };
}
