import {
  BASE_SHIP_FEE,
  DEBOUNCE_MS,
  examStamp,
  LAST_DIGIT,
  PRICE_MULTIPLIER,
  ROOM_LABEL,
  STALE_TIME_MS,
  STUDENT_SEED,
  VARIANT,
} from '../src/constants/student';
import { estimateShippingFee, haversineKm } from '../src/utils/delivery';
import { formatProductPrice } from '../src/utils/format';
import { PRODUCT_CATALOG } from '../src/services/productCatalog';

describe('student-specific KTXGo settings', () => {
  it('derives all values from the student seed and last digit', () => {
    expect(STUDENT_SEED).toBe(711);
    expect(LAST_DIGIT).toBe(1);
    expect(DEBOUNCE_MS).toBe(400);
    expect(STALE_TIME_MS).toBe(21_000);
    expect(PRICE_MULTIPLIER).toBe(30_500);
    expect(BASE_SHIP_FEE).toBe(9_000);
    expect(ROOM_LABEL).toBe('P.411');
    expect(VARIANT).toEqual({
      watermarkAtTop: false,
      authField: 'phone',
      tabOrder: 'shopFirst',
      hapticOnAdd: 'selection',
      shipFormula: 'B',
      detailPresentation: 'card',
    });
  });

  it('formats product prices with the exam multiplier', () => {
    expect(formatProductPrice(1)).toBe('30.500 đ');
  });

  it('shows the four requested products with their matching frame colors and prices', () => {
    expect(PRODUCT_CATALOG.map(product => product.title)).toEqual([
      'Cơm tấm',
      'Trà sữa',
      'Bút bi',
      'Mì ly',
    ]);
    expect(PRODUCT_CATALOG.map(product => formatProductPrice(product.price))).toEqual([
      '28.500 đ',
      '35.000 đ',
      '12.000 đ',
      '18.000 đ',
    ]);
    expect(PRODUCT_CATALOG.map(product => product.artwork.backgroundColor)).toEqual([
      '#FEF3C7',
      '#E0F2FE',
      '#DCFCE7',
      '#FEE2E2',
    ]);
  });

  it('calculates Haversine distance and formula B delivery fee', () => {
    expect(haversineKm(
      { latitude: 10.8231, longitude: 106.689 },
      { latitude: 10.8231, longitude: 106.689 },
    )).toBe(0);
    expect(estimateShippingFee(1)).toBe(12_500);
  });

  it('rejects invalid delivery distances', () => {
    expect(() => estimateShippingFee(-1)).toThrow(RangeError);
  });

  it('creates a six-digit deterministic exam stamp', () => {
    expect(examStamp()).toMatch(/^\d{6}$/);
    expect(examStamp()).toBe(examStamp());
  });
});
