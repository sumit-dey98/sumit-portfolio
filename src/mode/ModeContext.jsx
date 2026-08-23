import { createContext, useContext, useMemo } from 'react';

const ModeContext = createContext(null);

export function ModeProvider({ mode = 'full', children }) {
  const value = useMemo(
    () => ({ mode, isLite: mode === 'lite' }),
    [mode]
  );
  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside ModeProvider');
  return ctx;
}
