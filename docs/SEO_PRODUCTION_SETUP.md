# SEO Production Setup Guide
## Mobius Fly - Empty Leg Marketplace

Complete guide for deploying SEO infrastructure to production.

---

## 🚀 **DEPLOYMENT STEPS**

### 1. Environment Variables

Create `.env.production` file:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mobiusfly.com
NEXT_PUBLIC_SITE_NAME="Mobius Fly"

# Google Search Console
NEXT_PUBLIC_GSC_VERIFICATION=your_verification_code_here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Update Site Configuration

Edit `/lib/seo/metadata.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Mobius Fly",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mobiusfly.com",
  // ... rest of config
};
```

### 3. Configure Next.js

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production URL
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Headers for SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4. Google Search Console Setup

#### A. Verify Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://mobiusfly.com`
3. Choose verification method: **HTML tag**
4. Copy verification code
5. Update `/app/layout.tsx`:

```tsx
<meta name="google-site-verification" content="YOUR_CODE_HERE" />
```

6. Deploy to production
7. Click "Verify" in GSC

#### B. Submit Sitemap

1. In GSC, go to **Sitemaps**
2. Add sitemap URL: `https://mobiusfly.com/sitemap.xml`
3. Click "Submit"
4. Wait 24-48h for processing

#### C. Request Indexing

For critical pages:
1. Go to **URL Inspection**
2. Enter URL
3. Click "Request Indexing"

---

## 🔧 **DATABASE INTEGRATION**

### Sitemap with Real Data

Update `/app/sitemap.ts`:

```typescript
import { db } from '@/lib/db'; // Your database client

async function getActiveFlights() {
  return await db.flights.findMany({
    where: {
      status: 'active',
      departureTime: { gte: new Date() }
    },
    select: {
      id: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' }
  });
}
```

### Flight Detail Page

Update `/app/flights/[id]/page.tsx`:

```typescript
async function getFlight(id: string) {
  return await db.flights.findUnique({
    where: { id },
    include: {
      origin: true,
      destination: true,
      aircraft: true,
      operator: true,
    }
  });
}
```

---

## 📊 **ANALYTICS INTEGRATION**

### Google Analytics 4

Create `/lib/analytics/gtag.ts`:

```typescript
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

Add to `/app/layout.tsx`:

```tsx
import Script from 'next/script';

<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_path: window.location.pathname,
    });
  `}
</Script>
```

---

## 🎨 **SOCIAL MEDIA ASSETS**

### Required Images

Create these in `/public/`:

- `og-image.jpg` - 1200x630px (Open Graph default)
- `twitter-image.jpg` - 1200x600px (Twitter Card)
- `apple-touch-icon.png` - 180x180px (iOS home screen)
- `favicon.ico` - 32x32px (Browser tab)
- `favicon-16x16.png` - 16x16px
- `favicon-32x32.png` - 32x32px

### Generate Dynamic OG Images

The `/api/og` route generates flight-specific images:

```
https://mobiusfly.com/api/og?origin=LAX&destination=JFK&date=2025-03-15&price=$2500
```

Test locally:
```bash
curl http://localhost:3000/api/og?origin=LAX&destination=JFK
```

---

## 🔐 **SECURITY HEADERS**

### Vercel Configuration

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

## 📱 **PROGRESSIVE WEB APP (PWA)**

### Service Worker (Optional)

For offline support, create `/public/sw.js`:

```javascript
// Basic service worker for caching
const CACHE_NAME = 'mobius-fly-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/search',
        '/logo/main-logo.svg',
      ]);
    })
  );
});
```

Register in `/app/layout.tsx`:

```tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

---

## 🧪 **TESTING IN PRODUCTION**

### Post-Deployment Checks

```bash
# Test robots.txt
curl https://mobiusfly.com/robots.txt

# Test sitemap
curl https://mobiusfly.com/sitemap.xml

# Test OG image
curl https://mobiusfly.com/api/og?origin=LAX&destination=JFK

# Check metadata
curl -I https://mobiusfly.com
```

### Validation Tools

1. **Google Rich Results Test**
   ```
   https://search.google.com/test/rich-results
   ```

2. **PageSpeed Insights**
   ```
   https://pagespeed.web.dev/
   ```

3. **Mobile-Friendly Test**
   ```
   https://search.google.com/test/mobile-friendly
   ```

4. **Schema Validator**
   ```
   https://validator.schema.org/
   ```

---

## 📈 **MONITORING**

### Google Search Console Alerts

Set up email alerts for:
- Critical coverage issues
- Security issues
- Manual actions
- AMP issues (if applicable)

### Performance Monitoring

Use Lighthouse CI for continuous monitoring:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://mobiusfly.com
            https://mobiusfly.com/search
          uploadArtifacts: true
```

---

## 🐛 **TROUBLESHOOTING**

### Issue: Pages not indexed

**Solution:**
1. Check `robots.txt` - ensure not blocked
2. Check `X-Robots-Tag` headers
3. Submit URL for indexing in GSC
4. Verify sitemap includes URL

### Issue: Schema errors

**Solution:**
1. Validate with Google Rich Results Test
2. Check JSON-LD syntax
3. Ensure required fields present
4. Test with Schema.org validator

### Issue: Slow LCP

**Solution:**
1. Preload hero image
2. Use next/image with priority
3. Optimize image sizes
4. Enable CDN caching

### Issue: Duplicate content

**Solution:**
1. Add canonical tags
2. Use robots noindex on duplicates
3. Implement 301 redirects
4. Check URL parameters

---

## 📞 **SUPPORT RESOURCES**

- **Google Search Central**: https://developers.google.com/search
- **Next.js SEO**: https://nextjs.org/learn/seo/introduction-to-seo
- **Schema.org**: https://schema.org/
- **Web.dev**: https://web.dev/

---

## 🔄 **MAINTENANCE SCHEDULE**

### Daily
- Monitor GSC for critical errors

### Weekly
- Review Core Web Vitals
- Check new crawl errors
- Review top queries

### Monthly
- Update sitemap
- Optimize underperforming pages
- Review schema markup
- Update meta descriptions

### Quarterly
- Full SEO audit
- Competitor analysis
- Content strategy review
- Technical debt cleanup

---

**Last Updated:** 2025-02-23
**Version:** 1.0
**Maintained by:** Engineering Team
