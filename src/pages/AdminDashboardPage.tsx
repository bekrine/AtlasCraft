import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import { Product, OrderStatus, ProductType } from '../types/ecommerce';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingBag,
  FileSpreadsheet,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  CheckCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    loginAsDemoAdmin,
    orders,
    products,
    categories,
    storeSettings,
    updateStoreSettings,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    exportProductsCSV,
    importProductsCSV,
    formatPrice,
    language,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'kpi' | 'orders' | 'products' | 'csv' | 'settings'>('kpi');

  // Product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CSV Import state
  const [csvInput, setCsvInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});

  // Orders filter & tracking edit
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [editingOrderTracking, setEditingOrderTracking] = useState<{
    id: string;
    trackingNumber: string;
    carrier: string;
  } | null>(null);

  // If not admin, show login gate
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <SEOHead title="Accès Administrateur Restreint" path="/admin" />
        <div className="w-16 h-16 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-neutral-900">
          Espace d'Administration Protégé
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Cette zone est réservée au gestionnaire de la boutique AtlasCraft pour administrer les commandes, les expéditions, les stocks et les prix.
        </p>
        <button
          onClick={loginAsDemoAdmin}
          className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
        >
          Se connecter avec le compte Administrateur Démo
        </button>
      </div>
    );
  }

  // Analytics KPI calculations
  const totalRevenueMAD = orders.reduce((sum, o) => sum + o.subtotalCharged + o.shippingCharged - o.discountCharged, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValueMAD = totalOrdersCount > 0 ? Math.round(totalRevenueMAD / totalOrdersCount) : 0;
  const lowStockProducts = products.filter((p) => p.type === 'physical' && p.stockQuantity < 10);

  // Product modal save handler
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      saveProduct(editingProduct);
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleOpenNewProduct = () => {
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      slug: `nouveau-produit-${Date.now()}`,
      type: 'physical',
      name: { fr: 'Nouveau Produit Artisanal', ar: 'منتج تقليدي جديد', en: 'New Artisan Craft' },
      description: {
        fr: 'Description détaillée du produit...',
        ar: 'وصف تفصيلي للمنتج...',
        en: 'Detailed product description...',
      },
      specifications: {
        fr: ['Fait main au Maroc', 'Garantie d’authenticité'],
        ar: ['صنع يدوي في المغرب'],
        en: ['Handmade in Morocco'],
      },
      basePriceMAD: 490,
      sku: `AC-NEW-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: categories[0]?.id || 'cat_leather',
      images: ['/src/assets/images/product_leather_bag_1792442852513.jpg'],
      stockQuantity: 15,
      inStock: true,
      weightKg: 1.0,
      rating: 5.0,
      reviewCount: 0,
    };
    setEditingProduct(newProd);
    setIsModalOpen(true);
  };

  const handleDownloadCsv = () => {
    const csvData = exportProductsCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlascraft-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCsv = () => {
    if (!csvInput.trim()) return;
    const res = importProductsCSV(csvInput);
    if (res.success) {
      setImportStatus({ success: true, message: `${res.count} produits importés ou mis à jour avec succès !` });
      setCsvInput('');
    } else {
      setImportStatus({ success: false, message: res.errors?.join(', ') || 'Erreur lors de l’importation' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead title="Tableau de Bord Administrateur" path="/admin" />

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-800 font-semibold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>AtlasCraft Administration</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">
            {t.adminDashboard}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewProduct}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.actionAddProduct}</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'kpi' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Vue d'ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t.tabOrders}</span>
          <span className="font-mono opacity-80 tabular-nums">({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t.tabProducts}</span>
          <span className="font-mono opacity-80 tabular-nums">({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'csv' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{t.tabExportImport}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t.tabSettings}</span>
        </button>
      </div>

      {/* Tab 1: KPI Analytics Overview */}
      {activeTab === 'kpi' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-xs text-neutral-500 font-medium">{t.kpiTotalSales}</span>
              <p className="text-2xl font-bold font-mono text-neutral-900 mt-2 tabular-nums">
                {formatPrice(totalRevenueMAD)}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
                Maroc (COD) & International
              </span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-xs text-neutral-500 font-medium">{t.kpiOrdersCount}</span>
              <p className="text-2xl font-bold font-mono text-neutral-900 mt-2 tabular-nums">
                {totalOrdersCount}
              </p>
              <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
                Total transactions traitées
              </span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-xs text-neutral-500 font-medium">{t.kpiAverageOrder}</span>
              <p className="text-2xl font-bold font-mono text-neutral-900 mt-2 tabular-nums">
                {formatPrice(averageOrderValueMAD)}
              </p>
              <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
                Valeur moyenne par commande
              </span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-xs text-neutral-500 font-medium">{t.kpiLowStock}</span>
              <p className="text-2xl font-bold font-mono text-amber-700 mt-2 tabular-nums">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-amber-800 font-medium mt-1 inline-block">
                Produits à réapprovisionner
              </span>
            </div>
          </div>

          {/* Low Stock Warning List */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Alertes de stock physique</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="bg-white p-3 rounded-lg border border-amber-200 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-neutral-900 truncate">{p.name.fr}</p>
                      <span className="text-neutral-500 font-mono">{p.sku}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {p.stockQuantity} restants
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-serif font-bold text-neutral-900">
              Gestion & Suivi des Commandes
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Filtrer par état :</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="all">Toutes les commandes</option>
                <option value="pending">En attente (Pending)</option>
                <option value="processing">En préparation (Processing)</option>
                <option value="shipped">Expédiées (Shipped)</option>
                <option value="delivered">Livrées (Delivered)</option>
                <option value="refunded">Remboursées (Refunded)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Articles</th>
                  <th className="py-3 px-4">Paiement</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Actions & Suivi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-neutral-400 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-neutral-900">{ord.customerName}</p>
                      <p className="text-neutral-500 text-[11px] font-mono">{ord.customerEmail}</p>
                      {ord.customerPhone && (
                        <p className="text-neutral-500 text-[11px] font-mono">{ord.customerPhone}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="truncate text-neutral-700">
                            {it.productName} ({it.quantity}x)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-medium text-neutral-800">
                        {ord.paymentMethod === 'cod'
                          ? 'Espèces (COD)'
                          : ord.paymentMethod === 'card_simulated'
                          ? 'Carte bancaire'
                          : 'Virement'}
                      </span>
                      <span
                        className={`block text-[10px] uppercase font-mono ${
                          ord.paymentStatus === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                      {formatPrice(ord.totalCharged)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-xs font-medium"
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                        <option value="refunded">Remboursée</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap space-y-1">
                      {ord.trackingNumber ? (
                        <div className="font-mono text-[11px] text-neutral-600">
                          {ord.shippingCarrier}: {ord.trackingNumber}
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            updateOrderStatus(
                              ord.id,
                              'shipped',
                              `MA${Math.floor(10000000 + Math.random() * 90000000)}`,
                              'Amana Express'
                            )
                          }
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] font-semibold"
                        >
                          + Expédier Amana
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Products Catalog Management */}
      {activeTab === 'products' && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs space-y-4">
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-neutral-900">
              Catalogue Produits ({products.length})
            </h2>
            <button
              onClick={handleOpenNewProduct}
              className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Aperçu</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Nom (FR / AR)</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Prix de base</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.images[0]}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-md bg-neutral-100"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-800">{p.sku}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-neutral-900 truncate">{p.name.fr}</p>
                      <p className="text-neutral-500 font-arabic truncate text-[11px]">{p.name.ar}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono uppercase text-[10px] bg-neutral-100 px-2 py-0.5 rounded">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                      {p.basePriceMAD} DH
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {p.type === 'physical' ? p.stockQuantity : 'Illimité'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: CSV Import and Export */}
      {activeTab === 'csv' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Box */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-lg">
              <Download className="w-5 h-5 text-amber-700" />
              <h3>{t.exportCsv}</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Téléchargez un export CSV conforme avec les identifiants, SKU, traductions, prix en dirhams marocains et niveaux de stock pour modification dans Excel ou Google Sheets.
            </p>
            <button
              onClick={handleDownloadCsv}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Générer et télécharger le CSV</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-lg">
              <Upload className="w-5 h-5 text-amber-700" />
              <h3>{t.importCsv}</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Collez vos données CSV ci-dessous pour importer de nouveaux produits ou mettre à jour les stocks en masse.
            </p>

            {importStatus.message && (
              <div
                className={`p-3 rounded-lg text-xs font-medium ${
                  importStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {importStatus.message}
              </div>
            )}

            <textarea
              rows={4}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder='ID,SKU,Type,Category,Name_FR,Name_AR,Name_EN,BasePriceMAD,SalePriceMAD,Stock,WeightKg&#10;"prod_99","POT-SAF-09","physical","cat_ceramics","Tajine de Safi Émaillé","طاجين آسفي","Safi Tagine",290,,20,2.5'
              className="w-full p-3 font-mono text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-700"
            />

            <button
              onClick={handleImportCsv}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Valider et importer le CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Store Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <h2 className="text-xl font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            Paramètres Généraux & Expédition
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Nom de la boutique</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => updateStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email de contact</label>
              <input
                type="email"
                value={storeSettings.contactEmail}
                onChange={(e) => updateStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Seuil livraison gratuite Maroc (DH)</label>
              <input
                type="number"
                value={storeSettings.freeShippingThresholdMAD}
                onChange={(e) =>
                  updateStoreSettings({
                    ...storeSettings,
                    freeShippingThresholdMAD: parseInt(e.target.value, 10) || 600,
                  })
                }
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Tarif Standard Maroc (DH)</label>
              <input
                type="number"
                value={storeSettings.moroccoStandardShippingMAD}
                onChange={(e) =>
                  updateStoreSettings({
                    ...storeSettings,
                    moroccoStandardShippingMAD: parseInt(e.target.value, 10) || 35,
                  })
                }
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 space-y-3 text-xs">
            <h3 className="font-semibold text-neutral-900">Moyens de paiement acceptés :</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeSettings.enableCod}
                  onChange={(e) => updateStoreSettings({ ...storeSettings, enableCod: e.target.checked })}
                  className="rounded text-amber-700"
                />
                <span>Paiement à la livraison Maroc (COD)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeSettings.enableCard}
                  onChange={(e) => updateStoreSettings({ ...storeSettings, enableCard: e.target.checked })}
                  className="rounded text-amber-700"
                />
                <span>Carte bancaire (CMI / Visa / MC)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeSettings.enableBankTransfer}
                  onChange={(e) => updateStoreSettings({ ...storeSettings, enableBankTransfer: e.target.checked })}
                  className="rounded text-amber-700"
                />
                <span>Virement bancaire (RIB Maroc & IBAN)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-neutral-900">
              Modifier le Produit ({editingProduct.sku})
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Nom (Français)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name.fr}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: { ...editingProduct.name, fr: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 font-arabic">الاسم (العربية)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name.ar}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: { ...editingProduct.name, ar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-arabic"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Prix de base (MAD)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePriceMAD}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        basePriceMAD: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Type de produit</label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        type: e.target.value as ProductType,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                  >
                    <option value="physical">Produit Physique (Artisanat)</option>
                    <option value="digital">Produit Numérique (Téléchargement direct)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stock disponible</label>
                  <input
                    type="number"
                    value={editingProduct.stockQuantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockQuantity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Description (FR)</label>
                <textarea
                  rows={3}
                  value={editingProduct.description.fr}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: { ...editingProduct.description, fr: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 font-semibold hover:bg-neutral-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
