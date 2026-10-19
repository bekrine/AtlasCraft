import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import {
  Truck,
  ShieldCheck,
  Download,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { products, categories, formatPrice, addToCart, navigate, language, t } = useShop();

  const product = products.find((p) => p.slug === slug) || products[0];
  const category = categories.find((c) => c.id === product.categoryId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [copiedLink, setCopiedLink] = useState(false);

  // Variant calculations
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const effectiveBasePriceMAD =
    (product.salePriceMAD ?? product.basePriceMAD) + (selectedVariant?.priceAdjustmentMAD || 0);

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariantId, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, selectedVariantId, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.type === product.type))
    .slice(0, 3);

  const productName = product.name[language] || product.name.fr;
  const productDesc = product.description[language] || product.description.fr;
  const specsList = product.specifications[language] || product.specifications.fr || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <SEOHead
        title={productName}
        description={productDesc.slice(0, 160)}
        product={product}
        path={`/product/${product.slug}`}
      />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 transition-colors">
          Accueil
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigate('/catalog')} className="hover:text-neutral-900 transition-colors">
          Boutique
        </button>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <button
              onClick={() => navigate('/catalog')}
              className="hover:text-neutral-900 transition-colors"
            >
              {category.name[language] || category.name.fr}
            </button>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-neutral-900 font-medium truncate max-w-xs">{productName}</span>
      </nav>

      {/* Main PDP 2-Column Split: Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={productName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.type === 'digital' && (
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-neutral-900/90 text-amber-300 text-xs px-3 py-1 rounded-md font-mono flex items-center gap-1.5 backdrop-blur-xs">
                <Download className="w-3.5 h-3.5" />
                <span>Format Numérique Téléchargeable</span>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Vue ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-medium">{category?.name[language] || category?.name.fr}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono">{t.sku}: {product.sku}</span>
                <button
                  onClick={handleShare}
                  title="Partager ce produit"
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-snug">
              {productName}
            </h1>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
                {formatPrice(effectiveBasePriceMAD)}
              </span>
              {product.salePriceMAD && (
                <span className="text-base text-neutral-400 line-through font-mono tabular-nums">
                  {formatPrice(product.basePriceMAD)}
                </span>
              )}
              <span className="text-xs text-neutral-500 font-medium">{t.taxIncluded}</span>
            </div>

            {copiedLink && (
              <p className="text-xs text-emerald-600 font-medium mt-1">Lien copié dans le presse-papiers !</p>
            )}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="block text-xs font-semibold text-neutral-700">
                Variante / Modèle :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left rtl:text-right transition-colors ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <span className="block truncate">{v.name[language] || v.name.fr}</span>
                      {v.priceAdjustmentMAD > 0 && (
                        <span className="text-[10px] opacity-80 font-mono">
                          +{formatPrice(v.priceAdjustmentMAD)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Digital File Details Badge */}
          {product.type === 'digital' && product.digitalFile && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2 text-amber-950">
              <div className="flex items-center gap-2 font-semibold">
                <Download className="w-4 h-4 text-amber-800" />
                <span>Téléchargement numérique immédiat</span>
              </div>
              <p className="text-neutral-700 text-[11px] leading-relaxed">
                Fichier : <strong>{product.digitalFile.fileName}</strong> ({product.digitalFile.fileSize}) · Format : {product.digitalFile.fileFormat}
              </p>
              <p className="text-[11px] text-neutral-600">
                Licence incluse : {product.digitalFile.licenseType}
              </p>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            {product.type === 'physical' && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-700">Quantité :</span>
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-neutral-100 text-neutral-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-neutral-100 text-neutral-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} en stock` : 'Sur commande'}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                {t.addToCart}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                {t.buyNow}
              </button>
            </div>
          </div>

          {/* Delivery & Trust reassurance in PDP */}
          <div className="pt-4 border-t border-neutral-100 space-y-3 text-xs text-neutral-600">
            {product.type === 'physical' ? (
              <>
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-medium">Livraison au Maroc & Paiement à la réception</strong>
                    <span>Expédié en 24h-48h avec option de paiement en espèces au livreur.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-medium">Garantie d'authenticité artisanale</strong>
                    <span>Chaque pièce est estampillée et vérifiée dans nos ateliers de Fès.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2.5">
                  <Download className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-medium">Accès instantané sécurisé</strong>
                    <span>Téléchargement immédiat après confirmation de commande ou dans votre espace client.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-medium">Licence Commerciale Perpétuelle</strong>
                    <span>Utilisation autorisée sur projets physiques, numériques et commandes clients.</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Shipping & COD */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-8 border-b border-neutral-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition-colors ${
              activeTab === 'desc'
                ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Description de l'œuvre
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors ${
              activeTab === 'specs'
                ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {t.specifications}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 transition-colors ${
              activeTab === 'delivery'
                ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {t.shippingInfoTitle}
          </button>
        </div>

        <div className="text-sm text-neutral-700 leading-relaxed max-w-3xl">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{productDesc}</p>
              {product.type === 'digital' && product.digitalFile && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <h4 className="font-bold text-neutral-900 mb-1">Instructions d'utilisation numérique :</h4>
                  <p>{product.digitalFile.instructions[language] || product.digitalFile.instructions.fr}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <ul className="space-y-2.5">
              {specsList.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">·</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                <h4 className="font-bold text-amber-950 mb-1">Livraison au Maroc & Paiement à la Livraison (COD) :</h4>
                <p className="text-neutral-700">{t.shippingMoroccoNote}</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">Expédition Internationale :</h4>
                <p className="text-neutral-700">{t.shippingIntlNote}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Vous aimerez également</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
