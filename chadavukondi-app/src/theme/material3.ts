/**
 * Google Material Design 3 (Material You / M3) Design System Tokens
 * Expresses dynamic tonal palettes, elevation, shapes, and typography.
 */

export const M3 = {
  colors: {
    // Primary tonal family
    primary: '#3F51B5',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DEE0FF',
    onPrimaryContainer: '#00105C',

    // Secondary tonal family
    secondary: '#5B5D72',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E0E1F9',
    onSecondaryContainer: '#181A2C',

    // Tertiary tonal family (Telugu warmth / meme accents)
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',

    // Neutral / Surface tonal tiers
    surface: '#FEF7FF',
    surfaceDim: '#DED8E1',
    surfaceBright: '#FEF7FF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F8F2FA',
    surfaceContainer: '#F2ECF4',
    surfaceContainerHigh: '#ECE6EE',
    surfaceContainerHighest: '#E6E0E8',
    onSurface: '#1D1B20',
    onSurfaceVariant: '#49454F',

    // Outlines & Dividers
    outline: '#79747E',
    outlineVariant: '#CAC4D0',

    // Semantic States
    success: '#1B6E36',
    onSuccess: '#FFFFFF',
    successContainer: '#A6F5B2',
    onSuccessContainer: '#00210A',

    warning: '#8C5000',
    onWarning: '#FFFFFF',
    warningContainer: '#FFDDB4',
    onWarningContainer: '#2E1500',

    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    // Tonal overlay / Scrim
    scrim: '#000000',
    shadow: '#000000',
  },

  shapes: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 9999, // Pill shapes
  },

  elevation: {
    level0: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    level1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 1,
    },
    level2: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    },
    level3: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 10,
      elevation: 6,
    },
    level4: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 14,
      elevation: 8,
    },
  },

  typography: {
    displayLarge: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40,
      letterSpacing: -0.25,
    },
    headlineMedium: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    headlineSmall: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    titleLarge: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    titleSmall: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    bodyLarge: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    labelLarge: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
};
