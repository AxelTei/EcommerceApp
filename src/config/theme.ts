// src/config/theme.ts

export const Colors = {
  // Primary
  primary: '#6366F1',      // Indigo moderne
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Accent
  accent: '#EC4899',       // Rose
  accentDark: '#DB2777',
  accentLight: '#F472B6',
  
  // Neutral
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  
  // Text
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Dark mode (on l'utilisera plus tard)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    border: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  tiny: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};