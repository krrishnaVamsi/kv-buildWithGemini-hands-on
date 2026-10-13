import { Platform } from 'react-native';

const headingFont = Platform.select({
  web: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  default: 'System',
});

const bodyFont = Platform.select({
  web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  default: 'System',
});

export interface ColorTokens {
  primary: string;
  primaryDark: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;

  outline: string;
  outlineVariant: string;

  success: string;
  onSuccess: string;
  successContainer: string;
  onSuccessContainer: string;

  warning: string;
  onWarning: string;
  warningContainer: string;
  onWarningContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  cardBg: string;
  cardBorder: string;
  subtleBg: string;
}

export const lightColors: ColorTokens = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EEF2FF',
  onPrimaryContainer: '#312E81',

  secondary: '#0EA5E9',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E0F2FE',
  onSecondaryContainer: '#0369A1',

  tertiary: '#F43F5E',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFE4E6',
  onTertiaryContainer: '#881337',

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

  outline: '#94A3B8',
  outlineVariant: '#E2E8F0',

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

  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  subtleBg: '#F8FAFC',
};

export const darkColors: ColorTokens = {
  primary: '#818CF8', // Bright electric violet for OLED dark mode
  primaryDark: '#6366F1',
  onPrimary: '#0B0F19',
  primaryContainer: '#1E1B4B',
  onPrimaryContainer: '#C7D2FE',

  secondary: '#38BDF8',
  onSecondary: '#0B0F19',
  secondaryContainer: '#082F49',
  onSecondaryContainer: '#BAE6FD',

  tertiary: '#FB7185',
  onTertiary: '#0B0F19',
  tertiaryContainer: '#4C0519',
  onTertiaryContainer: '#FECDD3',

  surface: '#0B0F19', // Deep OLED obsidian
  surfaceDim: '#060911',
  surfaceBright: '#131B2E',
  surfaceContainerLowest: '#070A12',
  surfaceContainerLow: '#0E1526',
  surfaceContainer: '#131B2E',
  surfaceContainerHigh: '#1E293B',
  surfaceContainerHighest: '#334155',
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#94A3B8',

  outline: '#475569',
  outlineVariant: '#1E293B',

  success: '#34D399',
  onSuccess: '#064E3B',
  successContainer: '#064E3B',
  onSuccessContainer: '#A7F3D0',

  warning: '#FBBF24',
  onWarning: '#451A03',
  warningContainer: '#451A03',
  onWarningContainer: '#FDE68A',

  error: '#F87171',
  onError: '#450A0A',
  errorContainer: '#450A0A',
  onErrorContainer: '#FECACA',

  cardBg: '#0E1526',
  cardBorder: '#1E293B',
  subtleBg: '#131B2E',
};

export const getM3Theme = (isDark: boolean) => ({
  isDark,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  colors: isDark ? darkColors : lightColors,
  shapes: {
    none: 0,
    extraSmall: 6,
    small: 10,
    medium: 14,
    large: 20,
    extraLarge: 28,
    full: 9999,
  },
  elevation: {
    level0: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    level1: {
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.4 : 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    level2: {
      shadowColor: isDark ? '#818CF8' : '#6366F1',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.25 : 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    level3: {
      shadowColor: isDark ? '#818CF8' : '#6366F1',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.35 : 0.18,
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
});

export const M3 = getM3Theme(false);
