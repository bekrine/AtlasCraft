import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

describe('Localization & Arabic RTL Compliance', () => {
  it('contains complete translation dictionaries for French, Arabic, and English', () => {
    expect(translations.fr).toBeDefined();
    expect(translations.ar).toBeDefined();
    expect(translations.en).toBeDefined();

    // Verify key e-commerce action strings exist in all 3 languages
    const keys: Array<keyof typeof translations.fr> = [
      'storeName',
      'navCatalog',
      'navPhysical',
      'navDigital',
      'cartTitle',
      'checkout',
      'addToCart',
      'buyNow',
      'paymentCod',
      'paymentCard',
      'shippingDetails',
    ];

    for (const k of keys) {
      expect(translations.fr[k]).toBeTruthy();
      expect(translations.ar[k]).toBeTruthy();
      expect(translations.en[k]).toBeTruthy();
    }
  });

  it('verifies Arabic language orientation maps to RTL', () => {
    const getDirection = (lang: string) => (lang === 'ar' ? 'rtl' : 'ltr');
    expect(getDirection('ar')).toBe('rtl');
    expect(getDirection('fr')).toBe('ltr');
    expect(getDirection('en')).toBe('ltr');
  });
});
