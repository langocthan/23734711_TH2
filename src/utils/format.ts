import { PRICE_MULTIPLIER } from '@constants/student';

export function productPrice(price: number): number {
  return Math.round(price * PRICE_MULTIPLIER);
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} đ`;
}

export function formatProductPrice(price: number): string {
  return formatVnd(productPrice(price));
}
