import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  category: 'cakes' | 'breads' | 'pastries' | 'cookies';
  price: number;
  image: string;
  description: string;
  isEggless: boolean;
  prepTime: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  addItem: (product) => {
    const current = get().items;
    const existing = current.find((item) => item.id === product.id);

    if (existing) {
      set({
        items: current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ items: [...current, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) });
  },

  updateQuantity: (id, delta) => {
    const current = get().items;
    const updated = current
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  getTotalCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  getTotalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));