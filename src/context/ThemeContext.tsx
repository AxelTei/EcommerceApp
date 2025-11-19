// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { getColors, LightColors, DarkColors } from '../config/theme';

type ThemeContextType = {
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: typeof LightColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, loadTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const colors = getColors(isDark);

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};