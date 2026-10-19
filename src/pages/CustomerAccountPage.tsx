import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import {
  User as UserIcon,
  Package,
  Download,
  MapPin,
  LogOut,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Key,
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const {
    user,
    setUser,
    loginAsDemoCustomer,
    loginAsDemoAdmin,
    logout,
    orders,
    products,
    formatPrice,
    navigate,
    language,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'digital' | 'addresses'>('orders');

  // Customer orders
  const customerOrders = user
    ? orders.filter((o) => o.customerEmail === user.email || !o.customerId)
    : orders;

  // Collect all purchased digital items
  const allDigitalItems: Array<{
    orderNumber: string;
    item: any;
    date: string;
  }> = [];

  for (const ord of customerOrders) {
    for (const it of ord.items) {
      if (it.type === 'digital') {
        allDigitalItems.push({
          orderNumber: ord.orderNumber,
          item: it,
          date: ord.createdAt,
        });
      }
    }
  }

  const handleDownload = (it: any, orderNumber: string) => {
    const prod = products.find((p) => p.id === it.productId);
    const fileName = prod?.digitalFile?.fileName || `${it.sku}-bundle.zip`;

    const manifest = `=== ATLAS CRAFT SECURE DIGITAL ENTITLEMENT ===
Order: ${orderNumber}
Product: ${it.productName}
SKU: ${it.sku}
License Key: LIC-AC-${orderNumber.replace('AC-', '')}-COMMERCIAL
Authorized User: ${user?.name || 'Client AtlasCraft'}
Downloaded At: ${new Date().toISOString()}
==============================================`;

    const blob = new Blob([manifest], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.zip', '-LICENSE-BUNDLE.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
        <SEOHead
          title="Connexion Espace Client"
          description="Accédez à vos commandes, vos licences de créations numériques et vos coordonnées de livraison."
          path="/account"
        />

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 space-y-6 shadow-xs text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-bold text-neutral-900">
              Espace Client & Bibliothèque Numérique
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Connectez-vous pour retrouver l'historique de vos commandes artisanales et télécharger vos fichiers protégés.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginAsDemoCustomer}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Se connecter en tant que Client Démo (Kenza B.)</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={() => {
                loginAsDemoAdmin();
                navigate('/admin');
              }}
              className="w-full py-3 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Accès Administrateur Démo (Youssef E.)</span>
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-400">
            Plateforme conforme aux standards de confidentialité et protection des données personnelles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={t.account}
        description="Gérez vos commandes, téléchargez vos créations numériques et mettez à jour votre carnet d'adresses."
        path="/account"
      />

      {/* Account Profile Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-900 rounded-full flex items-center justify-center text-xl font-bold font-serif shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-neutral-900">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{user.email}</p>
            {user.phone && <p className="text-xs text-neutral-500 font-mono">{user.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {t.adminDashboard}
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* Account Tabs */}
      <div className="flex items-center gap-8 border-b border-neutral-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.myOrders}</span>
          <span className="text-xs font-mono tabular-nums text-neutral-400">({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('digital')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'digital'
              ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{t.myDigitalLibrary}</span>
          <span className="text-xs font-mono tabular-nums text-neutral-400">({allDigitalItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Adresses de livraison</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
              <p className="text-neutral-500 text-sm">{t.noOrdersYet}</p>
              <button
                onClick={() => navigate('/catalog')}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                {t.allProducts}
              </button>
            </div>
          ) : (
            customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-xs text-neutral-400 font-mono">
                      {new Date(ord.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-MA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <h3 className="font-mono font-bold text-neutral-900 text-sm">{ord.orderNumber}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize ${
                        ord.status === 'delivered' || ord.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.status === 'shipped'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ord.status}
                    </span>

                    <span className="font-mono font-bold text-neutral-900 text-sm tabular-nums">
                      {formatPrice(ord.totalCharged)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 text-neutral-700">
                      <div>
                        <span className="font-semibold text-neutral-900">{it.productName}</span>
                        {it.variantName && <span className="text-neutral-500"> ({it.variantName})</span>}
                        <span className="text-neutral-400"> × {it.quantity}</span>
                      </div>
                      <span className="font-mono tabular-nums">{formatPrice(it.unitPriceCharged * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking info if available */}
                {ord.trackingNumber && (
                  <div className="bg-neutral-50 p-3 rounded-lg text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-800">Suivi transporteur :</span>
                      <span className="font-mono text-neutral-600">{ord.shippingCarrier} · {ord.trackingNumber}</span>
                    </div>
                    <span className="text-emerald-700 font-medium">En cours d’acheminement</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Digital Library */}
      {activeTab === 'digital' && (
        <div className="space-y-4">
          {allDigitalItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
              <p className="text-neutral-500 text-sm">{t.noDigitalFiles}</p>
              <button
                onClick={() => navigate('/catalog')}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Explorer les créations numériques
              </button>
            </div>
          ) : (
            allDigitalItems.map((entry, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200/90 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-mono font-bold text-amber-800">{entry.item.sku}</span>
                    <span>·</span>
                    <span>Commande {entry.orderNumber}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base">{entry.item.productName}</h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
                    <Key className="w-3.5 h-3.5 text-amber-700" />
                    <span>Licence Commerciale Perpétuelle</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(entry.item, entry.orderNumber)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadButton}</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
              Adresse Principale (Maroc)
            </span>
            <div className="text-xs text-neutral-700 space-y-1">
              <strong className="block text-sm text-neutral-900">{user.name}</strong>
              <p>14 Boulevard d’Anfa, Résidence Al Mansour, Apt 5</p>
              <p>20000 Casablanca, Maroc</p>
              <p className="font-mono pt-1 text-neutral-500">Tél : {user.phone || '+212 6 65 99 88 77'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
