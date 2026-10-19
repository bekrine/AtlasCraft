# AtlasCraft - AI-Ready Moroccan & Global Ecommerce Store

AtlasCraft is an online store selling handcrafted artisanal physical goods (Moroccan leather, zellige ceramics) and digital design assets (Islamic geometric patterns, CAD models, typography) to customers in Morocco and worldwide.

## Key Features

1. **Trilingual & Native RTL**: French, Arabic (with full right-to-left layout and Noto Sans Arabic typography), and English.
2. **Multi-Currency Support**: Moroccan Dirhams (MAD), Euros (EUR), and US Dollars (USD) with exact decimal conversion and tabular numerals.
3. **Moroccan Domestic & Worldwide Fulfillment**:
   - Cash on Delivery (COD) for Moroccan cities (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, etc.).
   - Standard and express overnight courier shipping.
   - Worldwide tracked international express (DHL / FedEx).
   - Free shipping in Morocco on orders exceeding 600 MAD.
4. **Digital Goods Entitlement Engine**:
   - Protected download links with tokens and expiry.
   - Instant license grants and manifest files upon checkout.
   - Digital library in customer account.
5. **Administration Dashboard**:
   - Sales KPI overview (Total revenue, order count, average order value, low stock alerts).
   - Order management with fulfillment status transitions (`pending`, `processing`, `shipped`, `delivered`, `refunded`) and tracking number assignment.
   - Catalog management (Add/edit physical and digital products, variants, SKUs, and stock).
   - Bulk CSV export and import.
   - Store settings editor (Shipping rates, free shipping threshold, payment toggles).
6. **SEO & AI Search Discovery**:
   - Dynamic Schema.org JSON-LD structured data (`Product`, `Offer`, `BreadcrumbList`, `Organization`, `WebSite`).
   - XML sitemap at `/sitemap.xml`.
   - Dynamic `robots.txt` explicitly welcoming `OAI-SearchBot` and `PerplexityBot`.
   - Google Merchant Center XML feed at `/api/feed/products.xml`.
   - OpenAI / ChatGPT product discovery JSON feed at `/api/feed/products.json`.
   - Editorial craftsmanship guides and carnet d'atelier articles.

---

## Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Server
```bash
npm run dev
```
The server runs on `http://0.0.0.0:3000` with Express handling API routes (`/api/*`, `/sitemap.xml`, `/robots.txt`) and mounting Vite dev middleware.

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Demo Accounts
- **Customer Account**: Kenza Benjelloun (`kenza.b@example.com` - Casablanca, Morocco)
- **Administrator Account**: Youssef El Amrani (`admin@atlascraft.ma`)
(Available with 1-click login on the Account page `/account` or Admin Portal `/admin`).

---

## Test Payment Scenarios
- **Cash on Delivery (COD)**: Available when selecting "Maroc" as the delivery country with physical items in cart.
- **Credit / Debit Card (Simulator)**:
  - Click **"Remplir carte de test"** to populate `4000 1234 5678 9010` (Exp: `12/28`, CVC: `888`).
  - Toggle between **"Succès (200 OK)"** and **"Refus Banque (402)"** to verify error handling.
- **Test Promo Codes**:
  - `MAROC2026`: 10% discount on entire cart.
  - `BIENVENUE50`: 50 MAD discount on orders over 400 MAD.

---

## Production Deployment & External Accounts Checklist
1. **Morocco Payment Gateway**: Contract with CMI (Centre Monétique Interbancaire) or Moroccan fintech partner (e.g., Payzone, Flouci, Chari) for national card processing.
2. **International Payment Gateway**: Stripe account configured with webhook secret and restricted API keys.
3. **Moroccan Domestic Courier**: Corporate business account with Amana (Poste Maroc) or CTM Messagerie for automated shipping label generation and Cash on Delivery remittance reconciliation.
4. **International Courier**: DHL Express or FedEx corporate account for international airway bill (AWB) generation.
5. **Private Object Storage**: S3 or Google Cloud Storage bucket for digital downloads with signed URL generation.
