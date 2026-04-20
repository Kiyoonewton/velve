import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
  colour?: string;
  size?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, colour?: string, size?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    colour?: string,
    size?: string,
  ) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const key = `${item.id}-${item.colour ?? ""}-${item.size ?? ""}`;
          const existing = state.items.find(
            (i) => `${i.id}-${i.colour ?? ""}-${i.size ?? ""}` === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.id}-${i.colour ?? ""}-${i.size ?? ""}` === key
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
          };
        });
      },

      removeItem: (id, colour, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.colour === colour && i.size === size),
          ),
        }));
      },

      updateQuantity: (id, quantity, colour, size) => {
        if (quantity <= 0) {
          get().removeItem(id, colour, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.colour === colour && i.size === size
              ? { ...i, quantity }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "velve-cart" },
  ),
);
