import { useState, useEffect, useCallback } from 'react';
import { THEMES, DEFAULT_THEME, THEME_KEYS } from '../theme/themes';

export function useTheme() {
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem('portfolio-theme') || DEFAULT_THEME
  );

  useEffect(() => {
    const theme = THEMES[themeKey];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    root.setAttribute('data-theme', themeKey);
    localStorage.setItem('portfolio-theme', themeKey);
  }, [themeKey]);

  const setTheme = useCallback((key) => {
    if (THEMES[key]) setThemeKey(key);
  }, []);

  const nextTheme = useCallback(() => {
    setThemeKey(current => {
      const idx = THEME_KEYS.indexOf(current);
      return THEME_KEYS[(idx + 1) % THEME_KEYS.length];
    });
  }, []);

  const getCssVar = useCallback((name) => {
    return THEMES[themeKey]?.vars[name] ?? '';
  }, [themeKey]);

  return {
    themeKey,
    theme: THEMES[themeKey],
    themes: THEMES,
    themeKeys: THEME_KEYS,
    setTheme,
    nextTheme,
    getCssVar,
  };
}