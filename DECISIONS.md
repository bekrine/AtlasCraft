# Architecture & Technical Decisions (DECISIONS.md)

## Decision 1: Full-Stack Architecture on Vite + React 19 + Express
- **Context**: The AI Studio runtime environment runs on port 3000 with Vite frontend and Express server capabilities.
- **Decision**: Provide a unified full-stack architecture where `server.ts` handles API endpoints (`/api/*`), sitemap (`/sitemap.xml`), robots (`/robots.txt`), Google Merchant / AI Search product feeds (`/api/feed/products.xml`), secure time-limited token-based digital downloads (`/api/download/:token`), and mounts Vite middleware in development. In production, Vite compiles client assets to `dist/`, served statically by Express.
- **Benefits**: Seamless local preview in AI Studio, zero external billing dependencies for core store operations, fully deterministic and fast execution.

## Decision 2: Currency & Exact Decimal / Minor Units Handling
- **Context**: The store caters to Morocco (primary currency: MAD - Moroccan Dirham) and international buyers (EUR, USD).
- **Decision**: All product prices are stored with explicit currency and integer minor units (or exact 2-decimal rounded cents/centimes: 1 MAD = 100 centimes, 1 USD = 100 cents). Exchange rates are maintained with explicit refresh rates and never use unsafe raw floating-point operations for money calculations.

## Decision 3: Cash on Delivery (COD) & Payment Provider Abstraction
- **Context**: In Morocco, over 70% of ecommerce transactions utilize Cash on Delivery (Amana, CTM Messagerie, local couriers), while international and digital buyers use cards.
- **Decision**: Built-in Payment Provider Abstraction (`PaymentGateway` interface). Includes:
  1. `cod`: Cash on Delivery (enabled for Morocco physical delivery, validates phone number & delivery address).
  2. `simulated_card`: Development card payment simulator with test card scenarios (success, 3D Secure simulation, card decline, insufficient funds).
  3. `stripe_ready`: Adapter contract ready for production Stripe / CMI (Centre Monétique Interbancaire) credentials.

## Decision 4: Digital Product Security & Entitlements
- **Context**: The store sells digital vector graphic bundles, typography kits, and architectural guides alongside physical ceramics and leather goods.
- **Decision**: Digital asset files are protected from direct public URL access. Downloads require verified purchase entitlements that yield time-limited (24h) signed download tokens with rate limiting and download counters.

## Decision 5: Tri-lingual Support & First-Class Arabic RTL
- **Context**: Morocco's official languages are Arabic and Amazigh, with French widely used in business and commerce, and English essential for international sales.
- **Decision**: Implement a native reactive i18n engine with French (`fr`), Arabic (`ar` with `dir="rtl"` layout orchestration), and English (`en`). Product catalog records include localized names, descriptions, and specifications.

## Decision 6: SEO & AI Crawler Visibility
- **Context**: Store needs to be discoverable by Google, Bing, ChatGPT Search (`OAI-SearchBot`), Perplexity, and Google Merchant Center.
- **Decision**:
  - Valid `sitemap.xml` and `robots.txt` explicitly allowing respectful search discovery bots while disallowing private checkout and account routes.
  - Dynamic JSON-LD structured data (`Product`, `Offer`, `BreadcrumbList`, `Organization`).
  - Google Merchant Center XML feed and OpenAI Product Catalog JSON endpoint.
