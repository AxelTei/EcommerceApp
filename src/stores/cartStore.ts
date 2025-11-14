// src/stores/cartStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product, PromoCode } from '../types';

interface CartStore {
  items: CartItem[];
  promoCode: PromoCode | null;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  loadCart: () => Promise<void>;
}

const CART_KEY = '@cart_items';
const PROMO_KEY = '@promo_code';

// Mock promo codes
const PROMO_CODES: Record<string, PromoCode> = {
  'SAVE20': {
    code: 'SAVE20',
    discount: 20,
    type: 'percentage',
    minAmount: 50,
  },
  'FIRST10': {
    code: 'FIRST10',
    discount: 10,
    type: 'fixed',
  },
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  promoCode: null,

  addItem: (product, quantity = 1, size, color) => {
    const { items } = get();
    
    // Vérifier si le produit existe déjà (même taille/couleur)
    const existingItemIndex = items.findIndex(
      item => 
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    let newItems: CartItem[];

    if (existingItemIndex > -1) {
      // Augmenter la quantité
      newItems = [...items];
      newItems[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter nouveau item
      const newItem: CartItem = {
        id: `${product.id}_${size || ''}_${color || ''}_${Date.now()}`,
        product,
        quantity,
        selectedSize: size,
        selectedColor: color,
      };
      newItems = [...items, newItem];
    }

    set({ items: newItems });
    AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
  },

  removeItem: (itemId) => {
    const { items } = get();
    const newItems = items.filter(item => item.id !== itemId);
    set({ items: newItems });
    AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
  },

  updateQuantity: (itemId, quantity) => {
    const { items } = get();
    
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const newItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    set({ items: newItems });
    AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
  },

  clearCart: () => {
    set({ items: [], promoCode: null });
    AsyncStorage.removeItem(CART_KEY);
    AsyncStorage.removeItem(PROMO_KEY);
  },

  applyPromoCode: async (code) => {
    const promo = PROMO_CODES[code.toUpperCase()];
    
    if (!promo) {
      return false;
    }

    const subtotal = get().getSubtotal();
    
    // Vérifier montant minimum
    if (promo.minAmount && subtotal < promo.minAmount) {
      return false;
    }

    set({ promoCode: promo });
    await AsyncStorage.setItem(PROMO_KEY, JSON.stringify(promo));
    return true;
  },

  removePromoCode: () => {
    set({ promoCode: null });
    AsyncStorage.removeItem(PROMO_KEY);
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  },

  getDiscount: () => {
    const { promoCode } = get();
    if (!promoCode) return 0;

    const subtotal = get().getSubtotal();

    if (promoCode.type === 'percentage') {
      return (subtotal * promoCode.discount) / 100;
    }

    return promoCode.discount;
  },

  getTotal: () => {
    const { items } = get();
  
    // Si panier vide, retourner 0
    if (items.length === 0) return 0;
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const shipping = 5.99; // Frais de port fixes
    return Math.max(0, subtotal - discount + shipping);
  },

  loadCart: async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_KEY);
      const promoData = await AsyncStorage.getItem(PROMO_KEY);

      if (cartData) {
        set({ items: JSON.parse(cartData) });
      }

      if (promoData) {
        set({ promoCode: JSON.parse(promoData) });
      }
    } catch (error) {
      console.error('Load cart error:', error);
    }
  },
}));