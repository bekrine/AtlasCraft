import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SEOHead } from '../components/SEOHead';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  Download,
  AlertCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    cartSubtotalMAD,
    cartDiscountMAD,
    cartItemCount,
    formatPrice,
    hasPhysicalInCart,
    hasDigitalInCart,
    createOrder,
    navigate,
    storeSettings,
    language,
    t,
  } = useShop();

  // Customer Contact & Shipping Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [postalCode, setPostalCode] = useState('20000');
  const [country, setCountry] = useState('Maroc');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_simulated' | 'bank_transfer'>(
    country === 'Maroc' && hasPhysicalInCart ? 'cod' : 'card_simulated'
  );

  // Card Simulator State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardSimulationOutcome, setCardSimulationOutcome] = useState<'success' | 'decline'>('success');

  // Processing & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">{t.cartEmpty}</h2>
        <p className="text-sm text-neutral-500">
          Votre panier ne contient aucun produit pour le moment.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          {t.allProducts}
        </button>
      </div>
    );
  }

  // Calculate Shipping Cost
  let shippingCostMAD = 0;
  if (hasPhysicalInCart) {
    const isMorocco = country === 'Maroc';
    const isFreeEligible = isMorocco && cartSubtotalMAD >= storeSettings.freeShippingThresholdMAD;

    if (isMorocco) {
      if (shippingMethod === 'standard') {
        shippingCostMAD = isFreeEligible ? 0 : storeSettings.moroccoStandardShippingMAD;
      } else {
        shippingCostMAD = storeSettings.moroccoExpressShippingMAD;
      }
    } else {
      if (shippingMethod === 'standard') {
        shippingCostMAD = storeSettings.internationalStandardShippingMAD;
      } else {
        shippingCostMAD = storeSettings.internationalExpressShippingMAD;
      }
    }
  }

  const finalTotalMAD = Math.max(0, cartSubtotalMAD + shippingCostMAD - cartDiscountMAD);

  const fillQuickTestCard = () => {
    setCardNumber('4000 1234 5678 9010');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardSimulationOutcome('success');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!fullName.trim() || !email.trim()) {
      setFormError('Veuillez renseigner votre nom complet et votre adresse email.');
      return;
    }

    if (hasPhysicalInCart) {
      if (!phone.trim()) {
        setFormError('Le numéro de téléphone est obligatoire pour coordonner la livraison du colis.');
        return;
      }
      if (!addressLine.trim() || !city.trim()) {
        setFormError('Veuillez préciser votre adresse complète de livraison.');
        return;
      }
    }

    if (paymentMethod === 'card_simulated') {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 15) {
        setFormError('Veuillez saisir un numéro de carte valide à 16 chiffres ou utiliser le bouton Test.');
        return;
      }
      if (cardSimulationOutcome === 'decline') {
        setFormError('Simulation de paiement refusé : La banque émettrice a rejeté la transaction (Fonds insuffisants / 3DS rejeté). Changez le mode de simulation ou utilisez une autre carte.');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate safe server roundtrip
    setTimeout(() => {
      const order = createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: hasPhysicalInCart
          ? {
              fullName,
              line1: addressLine,
              city,
              postalCode,
              country,
              phone,
            }
          : undefined,
        shippingMethod: hasPhysicalInCart
          ? country === 'Maroc'
            ? shippingMethod === 'standard'
              ? t.moroccoStandard
              : t.moroccoExpress
            : shippingMethod === 'standard'
            ? t.intlStandard
            : t.intlExpress
          : 'Livraison numérique immédiate',
        shippingChargedMAD: shippingCostMAD,
        paymentMethod,
      });

      setIsSubmitting(false);
      navigate(`/order-success/${order.orderNumber}`);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Validation de Commande Sécurisée"
        description="Paiement à la livraison au Maroc et paiement international par carte sécurisée pour vos créations physiques et numériques."
        path="/checkout"
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-3xl font-serif font-bold text-neutral-900">{t.checkout}</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Finalisation sécurisée de votre commande · Protection des données bancaires SSL 256 bits
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 Columns: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {formError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              1. Coordonnées de contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Mehdi Tazi"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">Email (pour la facture et le suivi) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  {t.phone} {hasPhysicalInCart && '*'}
                </label>
                <input
                  type="tel"
                  required={hasPhysicalInCart}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +212 6 61 23 45 67 (joignable pour le coursier)"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address & Carrier Options (if Physical products in cart) */}
          {hasPhysicalInCart ? (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                2. {t.shippingDetails}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">{t.country} *</label>
                  <select
                    value={country}
                    onChange={(e) => {
                      const c = e.target.value;
                      setCountry(c);
                      if (c !== 'Maroc' && paymentMethod === 'cod') {
                        setPaymentMethod('card_simulated');
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                  >
                    <option value="Maroc">Maroc (المملكة المغربية)</option>
                    <option value="France">France</option>
                    <option value="Espagne">Espagne</option>
                    <option value="États-Unis">États-Unis</option>
                    <option value="Royaume-Uni">Royaume-Uni</option>
                    <option value="Émirats Arabes Unis">Émirats Arabes Unis</option>
                    <option value="Autre pays">Autre destination internationale</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">{t.city} *</label>
                  {country === 'Maroc' ? (
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                    >
                      <option value="Casablanca">Casablanca (الدار البيضاء)</option>
                      <option value="Rabat">Rabat (الرباط)</option>
                      <option value="Marrakech">Marrakech (مراكش)</option>
                      <option value="Fès">Fès (فاس)</option>
                      <option value="Tanger">Tanger (طنجة)</option>
                      <option value="Agadir">Agadir (أكادير)</option>
                      <option value="Meknès">Meknès (مكناس)</option>
                      <option value="Oujda">Oujda (وجدة)</option>
                      <option value="Kénitra">Kénitra (القنيطرة)</option>
                      <option value="Tétouan">Tétouan (تطوان)</option>
                      <option value="Autre ville">Autre ville du Maroc</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ville de résidence"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1.5">{t.addressLine1} *</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Numéro, rue, nom de résidence, étage ou repère"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">{t.postalCode}</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-700 font-mono"
                  />
                </div>
              </div>

              {/* Carrier Selection */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
                <label className="block font-semibold text-neutral-700 mb-1">{t.shippingMethod} :</label>
                <div className="space-y-2">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-colors ${
                      shippingMethod === 'standard'
                        ? 'border-neutral-900 bg-neutral-50/70 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span>
                          {country === 'Maroc' ? t.moroccoStandard : t.intlStandard}
                        </span>
                        <p className="text-[11px] text-neutral-500 font-normal">
                          {country === 'Maroc'
                            ? 'Amana / Transporteur privé avec suivi SMS'
                            : 'Courrier international suivi'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-neutral-900 tabular-nums">
                      {country === 'Maroc' && cartSubtotalMAD >= storeSettings.freeShippingThresholdMAD
                        ? 'Gratuit'
                        : formatPrice(
                            country === 'Maroc'
                              ? storeSettings.moroccoStandardShippingMAD
                              : storeSettings.internationalStandardShippingMAD
                          )}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-colors ${
                      shippingMethod === 'express'
                        ? 'border-neutral-900 bg-neutral-50/70 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                      <div>
                        <span>
                          {country === 'Maroc' ? t.moroccoExpress : t.intlExpress}
                        </span>
                        <p className="text-[11px] text-neutral-500 font-normal">
                          {country === 'Maroc' ? 'Livraison garantie 24h ouvrées' : 'DHL Express Priority sous 48-72h'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-neutral-900 tabular-nums">
                      {formatPrice(
                        country === 'Maroc'
                          ? storeSettings.moroccoExpressShippingMAD
                          : storeSettings.internationalExpressShippingMAD
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-6 text-xs text-amber-950 flex items-start gap-3">
              <Download className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm mb-1">Panier 100% Numérique</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Votre commande est constituée exclusivement de fichiers et modèles numériques téléchargeables. Aucun frais de livraison ne s’applique et les liens de téléchargement chiffrés seront immédiatement accessibles après confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              3. {t.paymentMethod}
            </h2>

            <div className="space-y-3 text-xs">
              {/* Cash on Delivery option (Available for Morocco physical delivery) */}
              {country === 'Maroc' && hasPhysicalInCart && (
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-amber-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-amber-800 focus:ring-amber-700"
                    />
                    <Banknote className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-900 text-sm">
                        {t.paymentCod}
                      </strong>
                      <p className="text-neutral-500 text-[11px] mt-0.5">{t.paymentCodDesc}</p>
                    </div>
                  </div>
                </label>
              )}

              {/* Card Payment (Simulator / Stripe / CMI Ready) */}
              <label
                onClick={() => setPaymentMethod('card_simulated')}
                className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'card_simulated'
                    ? 'border-neutral-900 bg-neutral-50/70'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'card_simulated'}
                      onChange={() => setPaymentMethod('card_simulated')}
                      className="text-amber-800 focus:ring-amber-700"
                    />
                    <CreditCard className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-900 text-sm">
                        {t.paymentCard}
                      </strong>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {t.paymentCardSimulated}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                    Visa · MC · CMI
                  </span>
                </div>

                {/* Card input fields (shown when active) */}
                {paymentMethod === 'card_simulated' && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 pt-4 border-t border-neutral-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">{t.testCardNotice}</span>
                      <button
                        type="button"
                        onClick={fillQuickTestCard}
                        className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 underline"
                      >
                        {t.fillTestCard}
                      </button>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">{t.cardNumber}</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4000 1234 5678 9010"
                        maxLength={19}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono tracking-wider focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">{t.cardExpiry}</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:outline-none focus:border-amber-700"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">{t.cardCvc}</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          maxLength={4}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:outline-none focus:border-amber-700"
                        />
                      </div>
                    </div>

                    {/* Developer Outcome Simulator Toggle */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 bg-neutral-100 p-2 rounded-lg">
                      <span>Simulateur d'issue de test :</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCardSimulationOutcome('success')}
                          className={`px-2 py-1 rounded ${
                            cardSimulationOutcome === 'success'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-white text-neutral-700'
                          }`}
                        >
                          Succès (200 OK)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardSimulationOutcome('decline')}
                          className={`px-2 py-1 rounded ${
                            cardSimulationOutcome === 'decline'
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-white text-neutral-700'
                          }`}
                        >
                          Refus Banque (402)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Direct Bank Wire */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-neutral-900 bg-neutral-50/70'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="text-amber-800 focus:ring-amber-700"
                  />
                  <Building className="w-5 h-5 text-neutral-700 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 text-sm">
                      {t.paymentBankTransfer}
                    </strong>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      RIB Attijariwafa Bank Maroc & IBAN Swift international.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-3 pt-3 border-t border-neutral-200 text-[11px] text-neutral-700 font-mono bg-white p-3 rounded-lg border border-neutral-200">
                    <p>Banque : Attijariwafa Bank (Agence Casablanca Anfa)</p>
                    <p>Titulaire : ATLAS CRAFT SARL AU</p>
                    <p>RIB Maroc : 007 780 0001234567890123 45</p>
                    <p>IBAN Swift : MA64 0077 8000 0123 4567 8901 2345 (BCMAMAMC)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Sticky Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-base font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Récapitulatif de la commande ({cartItemCount} articles)
            </h2>

            {/* Itemized preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-neutral-100 pr-1">
              {cart.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;
                const variant = item.variantId
                  ? prod.variants?.find((v) => v.id === item.variantId)
                  : undefined;
                const unitPrice =
                  (prod.salePriceMAD ?? prod.basePriceMAD) + (variant?.priceAdjustmentMAD || 0);

                return (
                  <div key={`${item.productId}_${item.variantId || 'base'}`} className="pt-3 flex gap-3 text-xs">
                    <img
                      src={prod.images[0]}
                      alt={prod.name[language] || prod.name.fr}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-md bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {prod.name[language] || prod.name.fr}
                      </p>
                      {variant && (
                        <p className="text-[11px] text-neutral-500">
                          {variant.name[language] || variant.name.fr}
                        </p>
                      )}
                      <p className="text-neutral-500">Qté : {item.quantity}</p>
                    </div>
                    <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                      {formatPrice(unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono text-neutral-900 tabular-nums font-semibold">
                  {formatPrice(cartSubtotalMAD)}
                </span>
              </div>

              {cartDiscountMAD > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.discount}</span>
                  <span className="font-mono tabular-nums">-{formatPrice(cartDiscountMAD)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="font-mono text-neutral-900 tabular-nums">
                  {shippingCostMAD === 0 ? 'Gratuit' : formatPrice(shippingCostMAD)}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                <span>{t.total}</span>
                <span className="font-mono tabular-nums text-lg">{formatPrice(finalTotalMAD)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <span>{t.processingOrder}</span>
              ) : (
                <>
                  <span>{t.placeOrder}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>

            <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantie de satisfaction et droit de rétractation légal</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
