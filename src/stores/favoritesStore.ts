// src/stores/favoritesStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface FavoritesStore {
  favorites: Product[];
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => Promise<void>;
}

const FAVORITES_KEY = '@favorites';

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  addFavorite: async (product) => {
    const { favorites } = get();
    
    if (favorites.find(p => p.id === product.id)) {
      return;
    }

    const updatedFavorites = [...favorites, product];
    set({ favorites: updatedFavorites });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  },

  removeFavorite: async (productId) => {
    const { favorites } = get();
    const updatedFavorites = favorites.filter(p => p.id !== productId);
    set({ favorites: updatedFavorites });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  },

  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some(p => p.id === productId);
  },

  loadFavorites: async () => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      if (data) {
        set({ favorites: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  },
}));