import React from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import { CheckCircle2, Download, Truck, ArrowRight, ShieldCheck, FileText, Key } from 'lucide-react';

interface OrderSuccessPageProps {
  orderNumber: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { orders, products, formatPrice, navigate, language, t } = useShop();

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  const digitalItems = order?.items.filter((item) => item.type === 'digital') || [];
  const physicalItems = order?.items.filter((item) => item.type === 'physical') || [];

  const handleDownload = (item: any) => {
    const prod = products.find((p) => p.id === item.productId);
    const fileName = prod?.digitalFile?.fileName || `${item.sku}-bundle.zip`;

    // Create a real mock download blob containing the license and sample manifest
    const manifestContent = `=== ATLAS CRAFT DIGITAL LICENSE & MANIFEST ===
Product: ${item.productName}
SKU: ${item.sku}
Order Reference: ${order.orderNumber}
Licensee: ${order.customerName} (${order.customerEmail})
License Type: Perpetual Commercial Extended License
Authorization Token: ${item.downloadToken || 'auth_token_verified'}
Date Issued: ${new Date().toISOString()}

INSTRUCTIONS:
1. All vector assets (SVG, AI, DXF) and OpenType fonts (.otf) are cleared for commercial client projects.
2. Direct redistribution or resale of the source vectors is strictly prohibited.
3. For support or updates, contact support@atlascraft.ma with your order reference.
==============================================`;

    const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.zip', '-MANIFEST-LICENSE.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title={`${t.orderSuccessTitle} – ${order.orderNumber}`}
        description="Votre commande a été enregistrée avec succès auprès d'AtlasCraft."
        path={`/order-success/${order.orderNumber}`}
      />

      {/* Confirmation Header Banner */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-neutral-900">
          {t.orderSuccessTitle}
        </h1>

        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          {t.orderConfirmationNote}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl text-xs font-mono font-bold text-neutral-900">
          <span>{t.orderNumberPrefix}</span>
          <span className="text-amber-800">{order.orderNumber}</span>
        </div>
      </div>

      {/* Digital Entitlements Download Section (if order includes digital products) */}
      {digitalItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-200/80 pb-4">
            <Download className="w-6 h-6 text-amber-800" />
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-950">
                {t.downloadPurchasedFiles}
              </h2>
              <p className="text-xs text-amber-900/80">
                Vos droits de licence sont enregistrés. Cliquez pour télécharger immédiatement votre archive et certificat.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {digitalItems.map((item, idx) => {
              const prod = products.find((p) => p.id === item.productId);
              return (
                <div
                  key={idx}
                  className="bg-white border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-800">{item.sku}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">
                        {prod?.digitalFile?.fileFormat || 'Archive ZIP Vectorielle'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{item.productName}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
                      <Key className="w-3.5 h-3.5 text-amber-700" />
                      <span>Licence : LIC-AC-{order.orderNumber.replace('AC-', '')}-COMMERCIAL</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(item)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadButton}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Physical Delivery Summary (if order includes physical products) */}
      {physicalItems.length > 0 && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <Truck className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-serif font-bold text-neutral-900">
              Expédition & Préparation du Colis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600">
            <div>
              <strong className="block text-neutral-900 font-semibold mb-1">Adresse de livraison :</strong>
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.line1}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-1 font-mono">{order.shippingAddress?.phone}</p>
            </div>

            <div>
              <strong className="block text-neutral-900 font-semibold mb-1">Modalité de paiement :</strong>
              <p className="text-neutral-900 font-medium">
                {order.paymentMethod === 'cod'
                  ? 'Paiement en espèces à la livraison (COD)'
                  : order.paymentMethod === 'card_simulated'
                  ? 'Carte bancaire (Payé avec succès)'
                  : 'Virement bancaire'}
              </p>
              {order.paymentMethod === 'cod' && (
                <p className="mt-2 text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  Veuillez préparer le montant exact de <strong>{formatPrice(order.totalCharged)}</strong> lors de la remise du colis par le livreur.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
        >
          {t.backToStore}
        </button>

        <button
          onClick={() => navigate('/account')}
          className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <span>Accéder à mon espace client</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
