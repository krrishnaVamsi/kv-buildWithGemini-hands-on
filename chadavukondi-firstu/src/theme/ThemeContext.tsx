import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getM3Theme } from './material3';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: ReturnType<typeof getM3Theme>;
}

const THEME_STORAGE_KEY = '@app_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: getM3Theme(false),
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) {
          setIsDark(stored === 'dark');
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const bgColor = isDark ? '#0B0F19' : '#F8FAFC';
      document.body.style.backgroundColor = bgColor;
    }
  }, [isDark]);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const theme = getM3Theme(isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
