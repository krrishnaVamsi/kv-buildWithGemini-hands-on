import { Platform } from 'react-native';

/**
 * Gen-Z Inspired Material You 3.0 Design Tokens
 * Combination:
 * - Display / Titles / Numbers: 'Space Grotesk' (Funky, geometric, sharp)
 * - Body / Labels / Chips: 'Plus Jakarta Sans' (Clean, ultra-smooth, modern)
 * - Color Palette: Electric Violet, Mint, Neon Coral, and Deep Slate
 */

const headingFont = Platform.select({
  web: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  default: 'System',
});

const bodyFont = Platform.select({
  web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  default: 'System',
});

export const M3 = {
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },

  colors: {
    // Electric Violet primary
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EEF2FF',
    onPrimaryContainer: '#312E81',

    // Cyber Sky secondary
    secondary: '#0EA5E9',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E0F2FE',
    onSecondaryContainer: '#0369A1',

    // Punchy Neon Coral tertiary
    tertiary: '#F43F5E',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFE4E6',
    onTertiaryContainer: '#881337',

    // Surface & Glass tiers
    surface: '#F8FAFC',
    surfaceDim: '#E2E8F0',
    surfaceBright: '#FFFFFF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FFFFFF',
    surfaceContainer: '#F1F5F9',
    surfaceContainerHigh: '#E2E8F0',
    surfaceContainerHighest: '#CBD5E1',
    onSurface: '#0F172A',
    onSurfaceVariant: '#475569',

    // Borders & Glass outlines
    outline: '#94A3B8',
    outlineVariant: '#E2E8F0',

    // Semantic Highlights
    success: '#10B981',
    onSuccess: '#FFFFFF',
    successContainer: '#D1FAE5',
    onSuccessContainer: '#065F46',

    warning: '#F59E0B',
    onWarning: '#FFFFFF',
    warningContainer: '#FEF3C7',
    onWarningContainer: '#92400E',

    error: '#EF4444',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#991B1B',

    scrim: '#000000',
    shadow: '#0F172A',
  },

  shapes: {
    none: 0,
    extraSmall: 6,
    small: 10,
    medium: 14,
    large: 20,
    extraLarge: 28,
    full: 9999, // Pill chips
  },

  elevation: {
    level0: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    level1: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    level2: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    level3: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 22,
      elevation: 8,
    },
  },

  typography: {
    displayLarge: {
      fontFamily: headingFont,
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    headlineMedium: {
      fontFamily: headingFont,
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 30,
      letterSpacing: -0.3,
    },
    headlineSmall: {
      fontFamily: headingFont,
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 26,
    },
    titleLarge: {
      fontFamily: headingFont,
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
    },
    titleMedium: {
      fontFamily: headingFont,
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    titleSmall: {
      fontFamily: bodyFont,
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: bodyFont,
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontFamily: bodyFont,
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: bodyFont,
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: bodyFont,
      fontSize: 14,
      fontWeight: '700' as const,
      lineHeight: 18,
    },
    labelMedium: {
      fontFamily: bodyFont,
      fontSize: 12,
      fontWeight: '700' as const,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    labelSmall: {
      fontFamily: bodyFont,
      fontSize: 11,
      fontWeight: '700' as const,
      lineHeight: 15,
      letterSpacing: 0.3,
    },
  },
};
