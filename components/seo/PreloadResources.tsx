/**
 * Preload Resources Component
 * Mobius Fly - Empty Leg Marketplace
 *
 * Optimizes Core Web Vitals by preloading critical resources
 * Should be included in pages with hero images or above-the-fold content
 */

import React from "react";

interface PreloadResourcesProps {
  /**
   * Critical images to preload (e.g., hero image)
   */
  images?: Array<{
    href: string;
    as?: "image";
    type?: string;
    imageSrcSet?: string;
    imageSizes?: string;
  }>;

  /**
   * Critical fonts to preload
   */
  fonts?: Array<{
    href: string;
    type?: string;
    crossOrigin?: "anonymous" | "use-credentials";
  }>;

  /**
   * Critical scripts to preload
   */
  scripts?: Array<{
    href: string;
    as?: "script";
  }>;
}

/**
 * PreloadResources Component
 *
 * Renders link preload tags for critical resources
 * Improves LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift)
 *
 * @example
 * ```tsx
 * // In your page component
 * export default function Page() {
 *   return (
 *     <>
 *       <PreloadResources
 *         images={[
 *           {
 *             href: "/hero-image.jpg",
 *             imageSrcSet: "/hero-image-mobile.jpg 640w, /hero-image.jpg 1920w",
 *             imageSizes: "(max-width: 640px) 640px, 1920px"
 *           }
 *         ]}
 *         fonts={[
 *           { href: "/fonts/inter-var.woff2", type: "font/woff2" }
 *         ]}
 *       />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
export function PreloadResources({
  images = [],
  fonts = [],
  scripts = [],
}: PreloadResourcesProps) {
  return (
    <>
      {/* Preload Images */}
      {images.map((image, index) => (
        <link
          key={`image-${index}`}
          rel="preload"
          as={image.as || "image"}
          href={image.href}
          type={image.type}
          imageSrcSet={image.imageSrcSet}
          imageSizes={image.imageSizes}
        />
      ))}

      {/* Preload Fonts */}
      {fonts.map((font, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          as="font"
          href={font.href}
          type={font.type || "font/woff2"}
          crossOrigin={font.crossOrigin || "anonymous"}
        />
      ))}

      {/* Preload Scripts */}
      {scripts.map((script, index) => (
        <link
          key={`script-${index}`}
          rel="preload"
          as={script.as || "script"}
          href={script.href}
        />
      ))}
    </>
  );
}

/**
 * Critical CSS Inline Component
 *
 * Inlines critical CSS for above-the-fold content
 * Improves FCP (First Contentful Paint)
 *
 * @example
 * ```tsx
 * <CriticalCSS css={`
 *   .hero { background: #000; height: 100vh; }
 * `} />
 * ```
 */
export function CriticalCSS({ css }: { css: string }) {
  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      // Suppress hydration warning for critical CSS
      suppressHydrationWarning
    />
  );
}
