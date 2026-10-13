import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontLinkId = 'google-fonts-genz';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap';
        document.head.appendChild(link);

        // Inject global css to reset and set default font family
        const style = document.createElement('style');
        style.innerHTML = `
          * {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .font-heading {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return <HomeScreen />;
}
