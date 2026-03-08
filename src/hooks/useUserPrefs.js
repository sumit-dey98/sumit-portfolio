import { useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-prefs';

export function useUserPrefs() {
  const [prefs, setPrefsState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const savePrefs = useCallback((newPrefs) => {
    const merged = { ...prefs, ...newPrefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setPrefsState(merged);
  }, [prefs]);

  const clearPrefs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPrefsState(null);
  }, []);

  return { prefs, savePrefs, clearPrefs };
}