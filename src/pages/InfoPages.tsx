import React from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import { Truck, RotateCcw, ShieldCheck, FileText, Mail, Phone, MapPin, HelpCircle } from 'lucide-react';

interface InfoPagesProps {
  page: 'about' | 'contact' | 'faq' | 'shipping' | 'returns' | 'terms' | 'privacy' | 'digital-license';
}

export const InfoPages: React.FC<InfoPagesProps> = ({ page }) => {
  const { storeSettings, formatPrice, t, language } = useShop();

  if (page === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SEOHead title="À Propos d'AtlasCraft" path="/about" />
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
            Notre Mission & Philosophie
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">À Propos d'AtlasCraft</h1>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-neutral-700 leading-relaxed shadow-xs">
          <p className="text-base text-neutral-900 font-medium">
            Fondée au carrefour de la tradition séculaire marocaine et du design d'avant-garde mondial, AtlasCraft s'est donnée pour mission d'offrir une vitrine internationale aux maîtres artisans de Fès, Marrakech et Safi, tout en créant des ressources numériques d'excellence pour architectes et concepteurs visuels.
          </p>

          <h3 className="text-lg font-serif font-bold text-neutral-900 pt-2">L'Engagement de la Matière et du Geste</h3>
          <p>
            Chaque création physique que nous proposons est confectionnée à la main dans des ateliers indépendants certifiés. Nos cuirs sont tannés végétalement sans chrome à Fès ; nos carreaux de zellige sont façonnés à partir de l'argile naturelle du bassin de Fès et taillés individuellement au marteau d'acier.
          </p>

          <h3 className="text-lg font-serif font-bold text-neutral-900 pt-2">La Précision du Numérique</h3>
          <p>
            Parce que la géométrie sacrée islamique et la calligraphie arabe méritent des standards de vectorisation irréprochables, notre studio numérique digitalise avec une rigueur mathématique les rosaces andalouses et conçoit des fontes typographiques OpenType modernes prêtes pour la production contemporaine.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SEOHead title="Contactez AtlasCraft" path="/contact" />
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
            Service Client & Ateliers
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">Contactez-Nous</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-700">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <Mail className="w-6 h-6 text-amber-800" />
            <h3 className="font-semibold text-sm text-neutral-900">Support Client & Commandes</h3>
            <p className="text-neutral-500">Pour toute question sur votre livraison ou vos téléchargements :</p>
            <p className="font-mono text-neutral-900 font-semibold text-sm">{storeSettings.contactEmail}</p>
            <p className="text-neutral-400">Réponse garantie sous 24 heures ouvrées.</p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <Phone className="w-6 h-6 text-amber-800" />
            <h3 className="font-semibold text-sm text-neutral-900">Téléphone & WhatsApp Pro</h3>
            <p className="text-neutral-500">Joignable du lundi au samedi de 9h à 19h (GMT+1) :</p>
            <p className="font-mono text-neutral-900 font-semibold text-sm">{storeSettings.contactPhone}</p>
            <p className="text-neutral-400">Assistance francophone, arabophone et anglophone.</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs text-xs text-neutral-700">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>Nos Espaces & Ateliers</span>
          </div>
          <p>
            <strong>Siège Commercial :</strong> Boulevard d'Anfa, 20000 Casablanca, Maroc.
          </p>
          <p>
            <strong>Ateliers & Tanneries :</strong> Quartier Chouara, Médina Historique, 30000 Fès, Maroc.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'shipping') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SEOHead title="Politique de Livraison & Expédition" path="/info/shipping" />
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
            Transport & Délais
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">{t.shippingInfoTitle}</h1>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-neutral-700 leading-relaxed shadow-xs">
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-950">
            <strong>Livraison gratuite au Maroc :</strong> Valable sur toutes les commandes de produits physiques supérieures ou égales à {formatPrice(storeSettings.freeShippingThresholdMAD)}.
          </div>

          <h3 className="text-lg font-serif font-bold text-neutral-900">1. Expédition Nationale (Maroc)</h3>
          <p>
            Toutes nos commandes au Maroc sont prises en charge par Amana (Poste Maroc) et des transporteurs privés partenaires avec suivi par SMS.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Standard (2-3 jours ouvrés) :</strong> {formatPrice(storeSettings.moroccoStandardShippingMAD)} (ou Gratuit dès {formatPrice(storeSettings.freeShippingThresholdMAD)}).</li>
            <li><strong>Express 24h :</strong> {formatPrice(storeSettings.moroccoExpressShippingMAD)}.</li>
            <li><strong>Paiement à la livraison (COD) :</strong> Disponible sans supplément sur tout le territoire marocain.</li>
          </ul>

          <h3 className="text-lg font-serif font-bold text-neutral-900 pt-2">2. Expédition Internationale</h3>
          <p>
            Nous expédions vers plus de 45 pays (Europe, Amérique du Nord, Golfe) via DHL Express et FedEx avec assurance tous risques incluse. Les délais varient entre 2 et 5 jours ouvrés.
          </p>

          <h3 className="text-lg font-serif font-bold text-neutral-900 pt-2">3. Livraison des Produits Numériques</h3>
          <p>
            Les produits numériques (vecteurs, kits CAD, polices de caractères) ne font l'objet d'aucun frais de port. Les fichiers sont téléchargeables immédiatement après validation du règlement.
          </p>
        </div>
      </div>
    );
  }

  // Returns, Terms, Privacy, FAQ, Digital License generic layout
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead title="Informations Légales & Conditions" path={`/info/${page}`} />
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 capitalize">
          {page === 'returns' && t.refundPolicy}
          {page === 'terms' && t.legalNotice}
          {page === 'privacy' && t.privacyPolicy}
          {page === 'digital-license' && t.digitalLicensePolicy}
          {page === 'faq' && t.faq}
        </h1>
      </div>

      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-neutral-700 leading-relaxed shadow-xs">
        {page === 'returns' && (
          <>
            <h3 className="text-base font-bold text-neutral-900">Droit de Rétractation de 14 Jours</h3>
            <p>
              Conformément à la loi marocaine n° 31-08 édictant des mesures de protection du consommateur et aux standards internationaux, vous disposez d'un délai de quatorze (14) jours à compter de la réception de vos articles physiques pour exercer votre droit de rétractation sans avoir à justifier de motifs.
            </p>
            <p>
              L'article doit être retourné neuf, dans son emballage d'origine non altéré, accompagné de sa facture. Les frais de retour sont à la charge de l'acheteur sauf en cas de non-conformité avérée du produit.
            </p>
          </>
        )}

        {page === 'digital-license' && (
          <>
            <h3 className="text-base font-bold text-neutral-900">Licence Commerciale Standard des Actifs Numériques</h3>
            <p>
              L'achat de nos fichiers vectoriels islamiques, kits CAD et typographies arabes vous confère une licence commerciale perpétuelle, non exclusive et mondiale :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Autorisé :</strong> Utilisation dans des projets clients (web, identités visuelles, packaging, découpe laser, décoration architecturale, façonnage de zellige ou boiserie).</li>
              <li><strong>Autorisé :</strong> Reproduction physique sur des objets manufacturés destinés à la vente.</li>
              <li><strong>Strictement interdit :</strong> Revente, redistribution gratuite, sous-licence ou partage direct des fichiers sources (.svg, .ai, .dxf, .otf) en tant que bibliothèque ou template téléchargeable.</li>
            </ul>
          </>
        )}

        {page === 'faq' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-neutral-900 mb-1">Comment fonctionne le paiement à la livraison au Maroc ?</h4>
              <p className="text-xs text-neutral-600">
                Vous passez votre commande sans entrer de coordonnées bancaires. Dès expédition, vous recevez un SMS avec le numéro de suivi Amana ou du coursier. À la livraison à votre domicile ou bureau, vous réglez en espèces au livreur.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 mb-1">Puis-je commander à la fois un produit physique et un produit numérique ?</h4>
              <p className="text-xs text-neutral-600">
                Absolument ! Notre panier traite simultanément les deux typologies d'articles. Vous aurez un accès immédiat à vos téléchargements numériques dès confirmation, tandis que votre colis physique sera préparé et expédié par nos ateliers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 mb-1">Les céramiques et le zellige risquent-ils d'être endommagés durant le transport ?</h4>
              <p className="text-xs text-neutral-600">
                Chaque lot de zellige et poterie est emballé dans des caisses en bois capitonnées et film thermo-rétractable renforcé. Si une casse survenait malgré nos précautions, nous remplaçons immédiatement les carreaux concernés à nos frais.
              </p>
            </div>
          </div>
        )}

        {page === 'privacy' && (
          <>
            <p>
              AtlasCraft traite vos données personnelles (nom, email, téléphone, adresse de livraison) dans le strict respect de la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP) et du RGPD européen.
            </p>
            <p>
              Vos données ne sont ni vendues ni cédées à des tiers et servent exclusivement à l'exécution de vos commandes et au suivi de vos livraisons.
            </p>
          </>
        )}

        {page === 'terms' && (
          <>
            <p>
              Les présentes conditions générales régissent l'ensemble des ventes conclues sur le site AtlasCraft. Toute commande passée implique l'adhésion entière et sans réserve du client aux présentes conditions.
            </p>
            <p>
              Les prix sont indiqués en Dirhams Marocains (MAD) toutes taxes comprises pour le Maroc, ou convertis dans la devise sélectionnée (EUR, USD).
            </p>
          </>
        )}
      </div>
    </div>
  );
};
