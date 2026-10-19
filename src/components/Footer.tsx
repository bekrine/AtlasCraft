import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Download, Award, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, navigate, language } = useShop();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip (Adjacent to footer proof) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-800 text-xs">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">{t.trustArtisanship}</h4>
              <p className="text-neutral-400 leading-relaxed">{t.trustArtisanshipDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">{t.trustCod}</h4>
              <p className="text-neutral-400 leading-relaxed">{t.trustCodDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">{t.trustDigital}</h4>
              <p className="text-neutral-400 leading-relaxed">{t.trustDigitalDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">{t.trustWorldwide}</h4>
              <p className="text-neutral-400 leading-relaxed">{t.trustWorldwideDesc}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-serif font-bold text-white tracking-tight">AtlasCraft</span>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Maison d’artisanat d’art et studio de création numérique. Nous relions l’héritage ancestral marocain de Fès et Marrakech aux standards du design contemporain mondial.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="text-neutral-300 font-medium">Ateliers : Fès Médina · Casablanca Anfa</p>
              <p>Email : contact@atlascraft.ma · Tél : +212 5 22 45 88 90</p>
            </div>
          </div>

          {/* Boutique Navigation */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-white">Boutique</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => navigate('/catalog')} className="hover:text-white transition-colors">
                  {t.allProducts}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/catalog')} className="hover:text-white transition-colors">
                  {t.physicalOnly}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/catalog')} className="hover:text-white transition-colors">
                  {t.digitalOnly}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/guides')} className="hover:text-white transition-colors">
                  {t.navGuides}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Information */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-white">Informations</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => navigate('/info/shipping')} className="hover:text-white transition-colors">
                  {t.shippingInfoTitle}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/info/returns')} className="hover:text-white transition-colors">
                  {t.refundPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/info/digital-license')} className="hover:text-white transition-colors">
                  {t.digitalLicensePolicy}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  {t.faq}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Administration */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-white">Légal & Accès</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => navigate('/info/terms')} className="hover:text-white transition-colors">
                  {t.legalNotice}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/info/privacy')} className="hover:text-white transition-colors">
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/account')} className="hover:text-white transition-colors">
                  {t.account}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
                  <span>{t.adminDashboard}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Paiement à la Livraison (Maroc)</span>
            <span>·</span>
            <span>Cartes Bancaires CMI / Visa / MC</span>
            <span>·</span>
            <span>Virement Bancaire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
