import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    // Surfaces
    bgPage: '#f4f4f0',
    surface0: '#f4f4f0',
    surface1: '#fafaf8',
    surface2: '#ffffff',
    // Text
    textPrimary: '#1a1a18',
    textSecondary: '#5a5a55',
    textMuted: '#8a8a85',
    textAccent: '#1a5fb4',
    textSuccess: '#2d7d46',
    textDanger: '#c01c28',
    textWarning: '#8a5a00',
    // Borders
    border: 'rgba(0,0,0,0.10)',
    borderStrong: 'rgba(0,0,0,0.18)',
    borderAccent: '#1a5fb4',
    // Role backgrounds
    bgAccent: '#dbeafe',
    bgSuccess: '#dcfce7',
    bgDanger: '#fee2e2',
    bgWarning: '#fef9c3',
    // Fill
    fillAccent: '#1a5fb4',
    // Tab bar
    tabBarBg: '#ffffff',
    tabBarBorder: 'rgba(0,0,0,0.10)',
  },
  dark: {
    bgPage: '#1a1a18',
    surface0: '#1a1a18',
    surface1: '#242420',
    surface2: '#2e2e2a',
    textPrimary: '#e8e8e0',
    textSecondary: '#a0a09a',
    textMuted: '#6a6a64',
    textAccent: '#7ec8e3',
    textSuccess: '#6ee7a0',
    textDanger: '#f87171',
    textWarning: '#fcd34d',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    borderAccent: '#7ec8e3',
    bgAccent: 'rgba(126,200,227,0.12)',
    bgSuccess: 'rgba(110,231,160,0.10)',
    bgDanger: 'rgba(248,113,113,0.12)',
    bgWarning: 'rgba(252,211,77,0.10)',
    fillAccent: '#3b82f6',
    tabBarBg: '#242420',
    tabBarBorder: 'rgba(255,255,255,0.08)',
  },
};

export type ColorScheme = typeof Colors.light;

export function useColors(): ColorScheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 20,
};

export const FontSize = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
};
