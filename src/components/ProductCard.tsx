import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ArrowRight, Download, Box } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, addToCart, navigate, t, categories } = useShop();
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const category = categories.find((c) => c.id === product.categoryId);
  const categoryName = category?.name[language] || category?.name.fr || 'Artisanat';
  const productName = product.name[language] || product.name.fr;
  const priceDisplay = formatPrice(product.salePriceMAD ?? product.basePriceMAD);
  const originalPriceDisplay = product.salePriceMAD ? formatPrice(product.basePriceMAD) : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product.id, product.variants?.[0]?.id, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group flex flex-col bg-white border border-neutral-200/90 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Product Image Slot (65%-70% of card visual weight) */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {!imgError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={productName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-neutral-100 text-neutral-400">
            {product.type === 'digital' ? (
              <Download className="w-10 h-10 stroke-1 text-amber-700/60 mb-2" />
            ) : (
              <Box className="w-10 h-10 stroke-1 text-amber-700/60 mb-2" />
            )}
            <span className="text-xs font-serif text-neutral-500 text-center line-clamp-1">
              {productName}
            </span>
          </div>
        )}

        {/* Subtle, unboxed single status indicator (No pill badges) */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none">
          {product.type === 'digital' ? (
            <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
              Digital
            </span>
          ) : product.salePriceMAD ? (
            <span className="text-[11px] font-medium tracking-wide uppercase text-amber-900 bg-amber-50/95 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
              Offre
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content & Hierarchy */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed category label */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1">
            <span>{categoryName}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {productName}
          </h3>
        </div>

        {/* Price Baseline and Add CTA */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-neutral-900 font-mono tabular-nums">
              {priceDisplay}
            </span>
            {originalPriceDisplay && (
              <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                {originalPriceDisplay}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label={`${t.addToCart}: ${productName}`}
            className="p-2 text-neutral-700 hover:text-white hover:bg-neutral-900 border border-neutral-200 hover:border-neutral-900 rounded-lg transition-colors flex items-center justify-center shrink-0"
            title={t.addToCart}
          >
            {isAdding ? (
              <span className="text-xs font-bold px-1 text-emerald-600">✓</span>
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
