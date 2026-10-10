import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STUDENT } from '@constants/student';
import { productPrice } from '@utils/format';
import type { CartItem, Product } from '@models/product';

type CartState = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  changeQty: (productId: number, quantity: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: product =>
        set(state => {
          const existingItem = state.items.find(item => item.id === product.id);

          return {
            items: existingItem
              ? state.items.map(item =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [...state.items, { ...product, quantity: 1 }],
          };
        }),
      remove: productId =>
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
        })),
      changeQty: (productId, quantity) =>
        set(state => ({
          items:
            quantity <= 0
              ? state.items.filter(item => item.id !== productId)
              : state.items.map(item =>
                  item.id === productId ? { ...item, quantity } : item,
                ),
        })),
      totalQuantity: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: () =>
        get().items.reduce(
          (total, item) => total + productPrice(item.price) * item.quantity,
          0,
        ),
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      version: 1,
      migrate: () => ({ items: [] }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ items: state.items }),
    },
  ),
);
