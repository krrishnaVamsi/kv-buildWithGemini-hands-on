import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  useEffect(() => {
    // Explicitly preload vector icon fonts so web never displays missing glyphs
    Font.loadAsync(Ionicons.font).catch((err) => {
      console.warn('Error preloading Ionicons:', err);
    });

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontLinkId = 'google-fonts-genz';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
          body, input, textarea, select, button {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          * {
            box-sizing: border-box;
          }
          body, html, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            transition: background-color 0.2s ease;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
