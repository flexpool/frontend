import React, { useEffect, useContext, useState } from 'react';
import useIsMounted from '@/hooks/useIsMounted';

type Mode = 'dark' | 'light' | 'system';
type Color = 'dark' | 'light';

type ThemeMode = {
  mode: Mode | undefined;
  color: Color | undefined;
  change: (mode: Mode) => void;
};

export const ThemeModeContext = React.createContext<ThemeMode | undefined>(
  undefined
);

type ThemeModeProviderProps = {
  children: React.ReactNode;
};

const ThemeModeProvider = ({ children }: ThemeModeProviderProps) => {
  const isMounted = useIsMounted();
  const [mode, setMode] = useState<Mode | undefined>(
    global.window?.__mode as any
  );

  const [color, setColor] = useState<Color | undefined>(
    global.window?.__color as any
  );

  const change = (mode: Mode) => {
    global.window?.__setPreferredMode(mode);
  };

  // Overwritten theme change callback
  useEffect(() => {
    window.__onColorChange = setColor;
    window.__onThemeChange = setMode;
  }, []);

  return (
    <ThemeModeContext.Provider
      value={{
        mode: !isMounted ? undefined : mode,
        color: !isMounted ? undefined : color,
        change,
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
};

const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }

  return context;
};

export { ThemeModeProvider, useThemeMode };
