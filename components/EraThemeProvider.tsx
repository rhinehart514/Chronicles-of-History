import React, { useEffect } from 'react';
import { Era } from '../types';
import { getEraCSSVariables, getEraStyle } from '../data/eraStyles';

interface EraThemeProviderProps {
  era: Era;
  children: React.ReactNode;
}

const EraThemeProvider: React.FC<EraThemeProviderProps> = ({ era, children }) => {
  useEffect(() => {
    // Apply CSS variables to root
    const cssVariables = getEraCSSVariables(era);
    const root = document.documentElement;

    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Load era-specific fonts
    const style = getEraStyle(era);
    loadFonts(style.fonts);

    // Clean up on unmount
    return () => {
      Object.keys(cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [era]);

  return <>{children}</>;
};

// Load Google Fonts for the era
function loadFonts(fonts: { heading: string; body: string; accent: string }) {
  const fontFamilies = new Set<string>();

  // Extract font family names
  [fonts.heading, fonts.body, fonts.accent].forEach(fontString => {
    const match = fontString.match(/'([^']+)'/);
    if (match) {
      fontFamilies.add(match[1]);
    }
  });

  // Check if fonts are already loaded
  const existingLinks = document.querySelectorAll('link[data-era-font]');
  existingLinks.forEach(link => link.remove());

  // Create Google Fonts link
  if (fontFamilies.size > 0) {
    const families = Array.from(fontFamilies)
      .map(f => f.replace(/ /g, '+') + ':wght@400;600;700')
      .join('&family=');

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    link.rel = 'stylesheet';
    link.setAttribute('data-era-font', 'true');
    document.head.appendChild(link);
  }
}

export default EraThemeProvider;
