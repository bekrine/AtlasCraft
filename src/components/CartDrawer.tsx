import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    cartSubtotalMAD,
    cartDiscountMAD,
    cartItemCount,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
    language,
    t,
    storeSettings,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const netTotalMAD = Math.max(0, cartSubtotalMAD - cartDiscountMAD);
  const isFreeDeliveryEligible = cartSubtotalMAD >= storeSettings.freeShippingThresholdMAD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10 rtl:right-auto rtl:left-0">
        <aside
          aria-label={t.cartTitle}
          className="w-screen max-w-md bg-white border-l border-neutral-200 rtl:border-l-0 rtl:border-r shadow-2xl flex flex-col"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-neutral-900">{t.cartTitle}</h2>
              {cartItemCount > 0 && (
                <span className="text-xs font-mono font-medium text-neutral-500 tabular-nums">
                  ({cartItemCount})
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <p className="text-neutral-500 text-sm mb-4">{t.cartEmpty}</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {t.allProducts}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;
                const variant = item.variantId
                  ? prod.variants?.find((v) => v.id === item.variantId)
                  : undefined;
                const unitPrice =
                  (prod.salePriceMAD ?? prod.basePriceMAD) + (variant?.priceAdjustmentMAD || 0);

                return (
                  <div key={`${item.productId}_${item.variantId || 'base'}`} className="py-4 flex gap-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name[language] || prod.name.fr}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 object-cover rounded-lg bg-neutral-100 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                          {prod.name[language] || prod.name.fr}
                        </h4>
                        {variant && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {variant.name[language] || variant.name.fr}
                          </p>
                        )}
                        <p className="text-xs font-mono font-medium text-neutral-800 mt-1 tabular-nums">
                          {formatPrice(unitPrice)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-neutral-100 text-neutral-600 rounded-l"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-neutral-100 text-neutral-600 rounded-r"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Totals & Coupon */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50/70 space-y-4">
              {/* Free delivery threshold bar */}
              <div className="text-xs text-neutral-600 bg-white p-2.5 rounded-lg border border-neutral-200/80">
                {isFreeDeliveryEligible ? (
                  <span className="text-emerald-700 font-medium">✓ {t.freeDeliveryAbove}</span>
                ) : (
                  <span>
                    Plus que <strong className="font-mono">{formatPrice(storeSettings.freeShippingThresholdMAD - cartSubtotalMAD)}</strong> pour profiter de la livraison gratuite au Maroc !
                  </span>
                )}
              </div>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-lg text-xs text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    <span className="font-semibold uppercase tracking-wider">{appliedCoupon.code}</span>
                    <span>
                      (-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.amount}%` : formatPrice(appliedCoupon.amount)})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-neutral-500 hover:text-neutral-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t.couponCode}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-700 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    {t.applyCoupon}
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono tabular-nums text-neutral-900 font-medium">
                    {formatPrice(cartSubtotalMAD)}
                  </span>
                </div>
                {cartDiscountMAD > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>{t.discount}</span>
                    <span className="font-mono tabular-nums">-{formatPrice(cartDiscountMAD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>{t.total}</span>
                  <span className="font-mono tabular-nums text-base">{formatPrice(netTotalMAD)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement à la livraison au Maroc & transaction internationale sécurisée</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
