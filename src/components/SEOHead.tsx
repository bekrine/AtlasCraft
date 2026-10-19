import React, { useEffect } from 'react';
import { Product } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  product?: Product;
  path?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, product, path = '/' }) => {
  const { language, storeSettings } = useShop();

  const siteName = storeSettings.storeName || 'AtlasCraft';
  const pageTitle = title ? `${title} | ${siteName}` : 'AtlasCraft – Moroccan Craftsmanship & Digital Design Goods';
  const metaDescription =
    description ||
    'Discover authentic Moroccan handcrafted leather, zellige ceramics, and premium digital design assets. Shipping across Morocco and internationally.';

  useEffect(() => {
    // 1. Update Title and Meta Description
    document.title = pageTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', metaDescription);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metaDescription);

    // 2. Generate or Update JSON-LD Script
    let jsonLdScript = document.getElementById('atlascraft-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'atlascraft-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${path}` : `https://atlascraft.ma${path}`;

    if (product) {
      // Product Structured Data
      const priceMAD = product.salePriceMAD ?? product.basePriceMAD;
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name[language] || product.name.fr,
        description: product.description[language] || product.description.fr,
        image: product.images,
        sku: product.sku,
        offers: {
          '@type': 'Offer',
          url: currentUrl,
          priceCurrency: 'MAD',
          price: priceMAD.toString(),
          availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: siteName,
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
        },
      };
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else {
      // Organization & WebSite Structured Data
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: currentUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/catalog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };
      jsonLdScript.textContent = JSON.stringify(structuredData);
    }
  }, [pageTitle, metaDescription, product, path, language, siteName]);

  return null;
};
