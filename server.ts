import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent demo store
const PRODUCTS = [
  {
    id: 'prod_1',
    slug: 'sac-voyage-cuir-caramel-atlas',
    sku: 'LEA-WKD-001',
    type: 'physical',
    name: 'Sac Weekender Cuir Pleine Fleur Caravane',
    priceMAD: 1290,
    inStock: true,
    stock: 14,
    category: 'Maroquinerie',
  },
  {
    id: 'prod_2',
    slug: 'panneau-zellige-emeraude-artisanal',
    sku: 'ZEL-EMR-010',
    type: 'physical',
    name: 'Ensemble Carreaux Zellige Émeraude & Ivoire (1 m²)',
    priceMAD: 890,
    inStock: true,
    stock: 28,
    category: 'Céramique & Zellige',
  },
  {
    id: 'prod_3',
    slug: 'pack-vecteurs-geometrie-islamique-arabe',
    sku: 'DIG-ISL-GEO-003',
    type: 'digital',
    name: 'Pack Ultime Géométrie Islamique & Typographie Arabe',
    priceMAD: 380,
    inStock: true,
    stock: 9999,
    category: 'Ressources Numériques',
  },
];

// 1. Products API
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

app.get('/api/products/:slug', (req, res) => {
  const prod = PRODUCTS.find((p) => p.slug === req.params.slug);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, data: prod });
});

// 2. Orders API
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, items, paymentMethod } = req.body;
  if (!customerName || !customerEmail || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
  res.json({
    success: true,
    orderNumber,
    status: paymentMethod === 'card_simulated' ? 'processing' : 'pending',
    paymentStatus: paymentMethod === 'card_simulated' ? 'paid' : 'pending',
  });
});

// 3. Protected Digital Download Endpoint
app.get('/api/download/:token', (req, res) => {
  const { token } = req.params;
  if (!token || token.length < 5) {
    return res.status(403).json({ error: 'Invalid or expired download token.' });
  }

  const sampleFileContent = `=== ATLAS CRAFT DIGITAL LICENSED PRODUCT ===
Token: ${token}
License: Extended Commercial License
Issued: ${new Date().toISOString()}

Thank you for supporting authentic Moroccan digital craftsmanship.
Your master vectors (SVG, DXF, AI) and fonts are authenticated.
============================================`;

  res.setHeader('Content-Disposition', `attachment; filename="AtlasCraft-Digital-Asset-${token.slice(0, 8)}.txt"`);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(sampleFileContent);
});

// 4. Dynamic SEO XML Sitemap
app.get('/sitemap.xml', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  const urls = [
    '',
    '/catalog',
    '/guides',
    '/about',
    '/contact',
    '/info/shipping',
    '/info/returns',
    '/info/digital-license',
    ...PRODUCTS.map((p) => `/product/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${origin}${u}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${u === '' ? '1.0' : u.startsWith('/product') ? '0.8' : '0.6'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// 5. Dynamic robots.txt respecting OAI-SearchBot and standard search engines
app.get('/robots.txt', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  const robots = `# AtlasCraft Robots.txt
User-agent: *
Allow: /
Allow: /catalog
Allow: /product/
Allow: /guides
Allow: /about
Allow: /contact
Allow: /api/feed/
Disallow: /admin
Disallow: /account
Disallow: /checkout
Disallow: /order-success/
Disallow: /api/download/

# Explicit permissions for AI Discovery Crawlers (ChatGPT Search / Perplexity)
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// 6. Google Merchant Center XML Product Feed
app.get('/api/feed/products.xml', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  const itemsXml = PRODUCTS.map(
    (p) => `    <item>
      <g:id>${p.sku}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[Authentic Moroccan artisan craft by AtlasCraft.]]></g:description>
      <g:link>${origin}/product/${p.slug}</g:link>
      <g:price>${p.priceMAD}.00 MAD</g:price>
      <g:availability>${p.inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>AtlasCraft</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`
  ).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AtlasCraft Product Catalog Feed</title>
    <link>${origin}</link>
    <description>Authentic Moroccan Handcrafted and Digital Design Products</description>
${itemsXml}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(feed);
});

// 7. OpenAI / ChatGPT Search Catalog JSON Feed
app.get('/api/feed/products.json', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.json({
    catalog: 'AtlasCraft Official Product Catalog',
    updatedAt: new Date().toISOString(),
    store: {
      name: 'AtlasCraft',
      country: 'Morocco',
      currency: 'MAD',
      languages: ['fr', 'ar', 'en'],
    },
    products: PRODUCTS.map((p) => ({
      sku: p.sku,
      title: p.name,
      type: p.type,
      category: p.category,
      price: {
        currency: 'MAD',
        amount: p.priceMAD,
      },
      url: `${origin}/product/${p.slug}`,
      inStock: p.inStock,
    })),
  });
});

// Start server with Vite middleware in dev or static dist in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AtlasCraft full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
