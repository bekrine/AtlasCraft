import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import { BookOpen, Clock, ArrowRight, ArrowLeft, Share2, Tag } from 'lucide-react';

export const EditorialGuidesPage: React.FC = () => {
  const { articles, navigate, language, t } = useShop();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const activeArticle = selectedArticleId
    ? articles.find((a) => a.id === selectedArticleId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEOHead
        title={activeArticle ? activeArticle.title[language] || activeArticle.title.fr : t.navGuides}
        description="Carnets d'atelier et guides d'experts sur l'artisanat marocain : maroquinerie de Fès, taille du zellige et patrimoine architectural."
        path="/guides"
      />

      {activeArticle ? (
        <article className="max-w-3xl mx-auto space-y-8 bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-12 shadow-xs">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>Retour aux carnets d'atelier</span>
          </button>

          <header className="space-y-4 border-b border-neutral-100 pb-6">
            <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
              <span>{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-neutral-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500 font-mono">{activeArticle.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              {activeArticle.title[language] || activeArticle.title.fr}
            </h1>

            <p className="text-base text-neutral-600 font-serif italic">
              {activeArticle.excerpt[language] || activeArticle.excerpt.fr}
            </p>
          </header>

          <div className="prose prose-neutral text-sm leading-relaxed text-neutral-700 space-y-4">
            <p>{activeArticle.content[language] || activeArticle.content.fr}</p>
            <p>
              Dans nos ateliers, chaque pièce requiert l'intervention de plusieurs artisans qualifiés (Maâllem). La sélection des matières premières, le respect des temps de séchage naturel au soleil et le soin apporté aux assemblages garantissent des créations conçues pour traverser les générations.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => navigate('/catalog')}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Découvrir les créations associées</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </article>
      ) : (
        <div className="space-y-8">
          <div className="border-b border-neutral-200 pb-6 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Savoir-Faire & Documentation</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-neutral-900">{t.navGuides}</h1>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              Explorez l'histoire vivante, les secrets techniques et les protocoles de fabrication des artisans de Fès, Marrakech et Safi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className="group cursor-pointer bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-md hover:border-amber-700/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-3">
                    <span className="text-amber-800 font-semibold">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{art.readTime}</span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-neutral-900 mb-3 group-hover:text-amber-800 transition-colors">
                    {art.title[language] || art.title.fr}
                  </h2>

                  <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                    {art.excerpt[language] || art.excerpt.fr}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-amber-800">
                  <span>Lire le carnet d'atelier</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
