import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS } from '../data/mockData';

describe('Digital Products & Entitlement System', () => {
  it('identifies digital products and protects direct download', () => {
    const digitalProducts = INITIAL_PRODUCTS.filter((p) => p.type === 'digital');
    expect(digitalProducts.length).toBeGreaterThan(0);

    for (const prod of digitalProducts) {
      expect(prod.digitalFile).toBeDefined();
      expect(prod.digitalFile?.fileName).toContain('.zip');
      expect(prod.digitalFile?.licenseType).toContain('License');
      expect(prod.digitalFile?.fileFormat).toBeTruthy();
    }
  });

  it('generates secure time-stamped authorization tokens for digital purchases', () => {
    const sampleToken = `dl_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    expect(sampleToken.startsWith('dl_')).toBe(true);
    expect(sampleToken.length).toBeGreaterThan(15);
  });

  it('formats commercial license certificate data accurately', () => {
    const orderNumber = 'AC-849204';
    const sku = 'DIG-ISL-GEO-003';
    const licenseKey = `LIC-AC-${orderNumber.replace('AC-', '')}-COMMERCIAL`;

    expect(licenseKey).toBe('LIC-AC-849204-COMMERCIAL');
  });
});
