import { PRICE_MULTIPLIER } from '@constants/student';
import type { Product } from '@models/product';

function priceAtStudentRate(priceVnd: number): number {
  return priceVnd / PRICE_MULTIPLIER;
}

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 1,
    title: 'Cơm tấm',
    description: 'Cơm tấm nóng, ăn kèm sườn nướng và nước mắm.',
    category: 'Món ăn',
    price: priceAtStudentRate(28_500),
    artwork: { emoji: '🍱', backgroundColor: '#FEF3C7' },
  },
  {
    id: 2,
    title: 'Trà sữa',
    description: 'Trà sữa mát lạnh, thơm vị trà và sữa.',
    category: 'Đồ uống',
    price: priceAtStudentRate(35_000),
    artwork: { emoji: '🧋', backgroundColor: '#E0F2FE' },
  },
  {
    id: 3,
    title: 'Bút bi',
    description: 'Bút bi viết êm, phù hợp ghi chép và học tập.',
    category: 'Văn phòng phẩm',
    price: priceAtStudentRate(12_000),
    artwork: { emoji: '🖊️', backgroundColor: '#DCFCE7' },
  },
  {
    id: 4,
    title: 'Mì ly',
    description: 'Mì ly tiện lợi, sẵn sàng cho bữa ăn nhanh.',
    category: 'Món ăn',
    price: priceAtStudentRate(18_000),
    artwork: { emoji: '🍜', backgroundColor: '#FEE2E2' },
  },
];
