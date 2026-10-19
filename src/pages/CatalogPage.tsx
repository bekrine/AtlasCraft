import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { Search, X, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    selectedSort,
    setSelectedSort,
    language,
    t,
  } = useShop();

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Type filter
        if (selectedTypeFilter !== 'all' && p.type !== selectedTypeFilter) return false;

        // 2. Category filter
        if (selectedCategoryFilter && p.categoryId !== selectedCategoryFilter) return false;

        // 3. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName =
            p.name.fr.toLowerCase().includes(q) ||
            p.name.ar.toLowerCase().includes(q) ||
            p.name.en.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchDesc =
            p.description.fr.toLowerCase().includes(q) ||
            p.description.en.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePriceMAD ?? a.basePriceMAD;
        const priceB = b.salePriceMAD ?? b.basePriceMAD;

        if (selectedSort === 'price-asc') return priceA - priceB;
        if (selectedSort === 'price-desc') return priceB - priceA;
        if (selectedSort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedTypeFilter, selectedCategoryFilter, searchQuery, selectedSort]);

  const resetFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedTypeFilter('all');
    setSearchQuery('');
    setSelectedSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={t.navCatalog}
        description="Parcourez notre collection complète d’artisanat d’art marocain (cuir, céramique, zellige) et de créations vectorielles numériques."
        path="/catalog"
      />

      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">{t.navCatalog}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Artisanat marocain d’exception & créations numériques authentifiées
          </p>
        </div>

        {/* Search input inside catalog */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-700 rtl:pl-9 rtl:pr-9"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 rtl:right-auto rtl:left-3 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar: Segmented Controls for Type, Category Tabs & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedTypeFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.allTypes}
          </button>
          <button
            onClick={() => setSelectedTypeFilter('physical')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedTypeFilter === 'physical'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.physicalOnly}
          </button>
          <button
            onClick={() => setSelectedTypeFilter('digital')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedTypeFilter === 'digital'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t.digitalOnly}
          </button>
        </div>

        {/* Category Filter Chips / Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              selectedCategoryFilter === null
                ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.id)}
                className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {cat.name[language] || cat.name.fr}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-neutral-500 font-mono tabular-nums">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produit' : 'produits'}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">{t.sortBy}:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-neutral-800 text-xs font-medium focus:outline-none focus:border-amber-700"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="newest">{t.sortNewest}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-4 max-w-lg mx-auto">
          <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-neutral-900">Aucun produit ne correspond à ces critères</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Essayez d’élargir vos filtres ou de rechercher d’autres mots-clés (cuir, zellige, géométrie, riad).
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      )}
    </div>
  );
};
