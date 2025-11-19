// src/stores/themeStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

const THEME_KEY = '@theme';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',

  toggleTheme: async () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        set({ theme: savedTheme });
      }
    } catch (error) {
      console.error('Load theme error:', error);
    }
  },
}));