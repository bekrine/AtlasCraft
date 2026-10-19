import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { ArrowRight, Sparkles, Download, ShieldCheck, Compass, BookOpen } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, navigate, language, t, setSelectedTypeFilter, setSelectedCategoryFilter } = useShop();

  const featuredPhysical = products.filter((p) => p.type === 'physical' && p.featured).slice(0, 3);
  const featuredDigital = products.filter((p) => p.type === 'digital').slice(0, 2);

  return (
    <div className="space-y-20 pb-16">
      <SEOHead
        title="Artisanat Marocain & Créations Numériques"
        description="Boutique d’excellence marocaine : maroquinerie d’art de Fès, zellige traditionnel taillé main et ressources de design vectoriel islamique."
        path="/"
      />

      {/* 1. Hero Section (Domain-specific architectural design) */}
      <section className="relative overflow-hidden bg-[#f4f1ea] border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-900 tracking-wider uppercase">
                <span>Héritage Fès & Marrakech</span>
                <span aria-hidden="true" className="text-amber-700/60">·</span>
                <span>Design Contemporain</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 tracking-tight leading-[1.12] text-balance">
                L’Élégance de l’Artisanat Marocain & des Créations Numériques.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                Des créations physiques faites main par des maîtres artisans à Fès et Marrakech, associées à des ressources vectorielles et typographiques de haute précision pour designers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedTypeFilter('all');
                    setSelectedCategoryFilter(null);
                    navigate('/catalog');
                  }}
                  className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <span>{t.navCatalog}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => {
                    setSelectedTypeFilter('digital');
                    navigate('/catalog');
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-amber-700" />
                  <span>{t.navDigital}</span>
                </button>
              </div>

              {/* Quick Trust Strip */}
              <div className="pt-6 border-t border-neutral-300/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
                <div>
                  <strong className="block text-neutral-900 font-semibold">Paiement à la livraison</strong>
                  <span>Partout au Maroc</span>
                </div>
                <div>
                  <strong className="block text-neutral-900 font-semibold">Fichiers Numériques</strong>
                  <span>Téléchargement immédiat</span>
                </div>
                <div>
                  <strong className="block text-neutral-900 font-semibold">Expédition Mondiale</strong>
                  <span>Livraison express assurée</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100 aspect-[4/5] max-h-[540px]">
                <img
                  src="/src/assets/images/hero_moroccan_craft_1792442852128.jpg"
                  alt="Cour intérieure d'un riad contemporain marocain avec finitions artisanales"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                    Collection Printemps-Été 2026
                  </span>
                  <p className="text-lg font-serif font-semibold mt-1">
                    Authenticité millénaire, finition intemporelle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Physical Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-800 uppercase tracking-wider mb-1">
              <span>Façonné Main au Maroc</span>
              <span aria-hidden="true">·</span>
              <span>Éditions Limitées</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              {t.navPhysical}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedTypeFilter('physical');
              navigate('/catalog');
            }}
            className="text-xs font-semibold text-neutral-900 hover:text-amber-800 flex items-center gap-1.5 transition-colors group"
          >
            <span>Voir toute la collection artisanale</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPhysical.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Digital Asset Spotlight Section */}
      <section className="bg-neutral-950 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 uppercase">
                <span>Accès Numérique Sécurisé</span>
                <span aria-hidden="true">·</span>
                <span>Licence Commerciale</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                Motifs Islamiques Vectoriels & Typographie Arabe Contemporaine.
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Conçus pour architectes, designers graphiques et créateurs de produits. Fichiers SVG, AI, DXF prêts pour la découpe CNC et modèles 3D avec licence commerciale sans redevance.
              </p>

              <div className="space-y-3 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Plus de 120 tracés vectoriels à symétries 8-fold et 16-fold précises</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Formats ouverts pour découpe laser, gravure sur plâtre, et web</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Génération immédiate d’un lien de téléchargement chiffré</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setSelectedTypeFilter('digital');
                    navigate('/catalog');
                  }}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Explorer les collections numériques</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredDigital.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigate(`/product/${prod.slug}`)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 cursor-pointer transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-800 mb-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name[language] || prod.name.fr}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-amber-400 font-mono mb-1">{prod.sku}</div>
                  <h3 className="font-semibold text-white text-sm line-clamp-1 mb-2">
                    {prod.name[language] || prod.name.fr}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-800">
                    <span className="font-mono text-neutral-300 font-semibold">
                      {prod.salePriceMAD ? `${prod.salePriceMAD} DH` : `${prod.basePriceMAD} DH`}
                    </span>
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <span>Détails & Licence</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship Stories / Editorial Guides Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-800 uppercase tracking-wider mb-1">
              <span>Savoir-Faire & Culture</span>
              <span aria-hidden="true">·</span>
              <span>Carnets d’Atelier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              {t.navGuides}
            </h2>
          </div>
          <button
            onClick={() => navigate('/guides')}
            className="text-xs font-semibold text-neutral-900 hover:text-amber-800 flex items-center gap-1.5 transition-colors group"
          >
            <span>Lire tous nos guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => navigate('/guides')}
            className="group cursor-pointer bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-md hover:border-amber-700/40"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-3">
              <span>Maroquinerie & Héritage</span>
              <span aria-hidden="true">·</span>
              <span>4 min de lecture</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3 group-hover:text-amber-800 transition-colors">
              Les Secrets Millénaires du Tannage Végétal à Fès
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
              Plongez au cœur des bassins de Chouara où les maîtres tanneurs perpétuent des gestes préservés depuis le XIe siècle avec des extraits d’écorce de grenade et de chêne.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-neutral-900 group-hover:text-amber-800">
              <span>Lire l’article complet</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </div>
          </div>

          <div
            onClick={() => navigate('/guides')}
            className="group cursor-pointer bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-md hover:border-amber-700/40"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-3">
              <span>Architecture & Savoir-faire</span>
              <span aria-hidden="true">·</span>
              <span>6 min de lecture</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3 group-hover:text-amber-800 transition-colors">
              Comprendre la Géométrie Sacrée du Zellige Marocain
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
              Comment les artisans traduisent des équations géométriques complexes en étoiles d’argile émaillée taillées une par une au marteau traditionnel menqach.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-neutral-900 group-hover:text-amber-800">
              <span>Lire l’article complet</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
