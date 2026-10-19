import { describe, it, expect } from 'vitest';
import { EXCHANGE_RATES } from '../context/ShopContext';
import { INITIAL_COUPONS, INITIAL_STORE_SETTINGS } from '../data/mockData';

describe('Ecommerce Cart, Currency & Pricing Engine', () => {
  it('handles exact currency exchange rates without NaN or undefined', () => {
    expect(EXCHANGE_RATES.MAD).toBe(1.0);
    expect(EXCHANGE_RATES.EUR).toBeCloseTo(0.093, 3);
    expect(EXCHANGE_RATES.USD).toBeCloseTo(0.10, 2);
  });

  it('calculates coupon discounts correctly for percentage coupons', () => {
    const coupon10 = INITIAL_COUPONS.find((c) => c.code === 'MAROC2026')!;
    expect(coupon10).toBeDefined();
    expect(coupon10.discountType).toBe('percentage');

    const subtotalMAD = 1290;
    const discount = Math.round((subtotalMAD * coupon10.amount) / 100);
    expect(discount).toBe(129);
    expect(subtotalMAD - discount).toBe(1161);
  });

  it('calculates fixed coupon discounts correctly', () => {
    const couponFixed = INITIAL_COUPONS.find((c) => c.code === 'BIENVENUE50')!;
    expect(couponFixed).toBeDefined();
    expect(couponFixed.discountType).toBe('fixed_mad');

    const subtotalMAD = 500;
    const discount = Math.min(subtotalMAD, couponFixed.amount);
    expect(discount).toBe(50);
    expect(subtotalMAD - discount).toBe(450);
  });

  it('evaluates Morocco free shipping threshold correctly', () => {
    const threshold = INITIAL_STORE_SETTINGS.freeShippingThresholdMAD;
    expect(threshold).toBe(600);

    const qualifyingSubtotal = 1290;
    const nonQualifyingSubtotal = 450;

    const isFreeEligible1 = qualifyingSubtotal >= threshold;
    const isFreeEligible2 = nonQualifyingSubtotal >= threshold;

    expect(isFreeEligible1).toBe(true);
    expect(isFreeEligible2).toBe(false);
  });
});
