'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as CPPTheme } from '@mui/material/styles';
import { getTheme } from './theme';
import { usePathname } from 'next/navigation';

type ThemeMode = 'light' | 'dark' | 'contrast';
type availableFonts = 'plusJakartaSans' | 'lexend';

const ThemeContext = createContext({
  toggleTheme: () => {},
  toggleFont: () => {},
  mode: 'light' as ThemeMode,
  font: 'plusJakartaSans' as availableFonts,
  fontSize: 16,
  setFontSize: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  const [mode, setMode] = useState<'light' | 'dark' | 'contrast'>('light');
  const [font, setFont] = useState<'plusJakartaSans' | 'lexend'>(
    'plusJakartaSans'
  );
  const [fontSize, setFontSize] = useState(16);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    console.log('Stored mode:', storedMode, isLogin);

    if (
      storedMode === 'light' ||
      storedMode === 'dark' ||
      storedMode === 'contrast'
    ) {
      if (isLogin) {
        setMode('light');
      } else {
        setMode(storedMode);
      }
    } else {
      setMode('light');
    }

    const storedFont = localStorage.getItem('font') as availableFonts | null;
    if (storedFont === 'plusJakartaSans' || storedFont === 'lexend') {
      setFont(storedFont);
    } else {
      setFont('plusJakartaSans');
    }

    const storedFontSizeRaw = localStorage.getItem('fontSize');
    const parsedFontSize = storedFontSizeRaw
      ? parseInt(storedFontSizeRaw, 10)
      : null;
    if (parsedFontSize && !isNaN(parsedFontSize)) {
      setFontSize(parsedFontSize);
    } else {
      setFontSize(16);
    }

    setHasMounted(true);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode =
        prev === 'light' ? 'dark' : prev === 'dark' ? 'contrast' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const toggleFont = () => {
    setFont((prev) => {
      const newFont = prev === 'plusJakartaSans' ? 'lexend' : 'plusJakartaSans';
      localStorage.setItem('font', newFont);
      return newFont;
    });
  };

  const theme = useMemo(
    () => getTheme(mode, font, fontSize),
    [mode, font, fontSize]
  );

  if (!hasMounted) return null;

  return (
    <ThemeContext.Provider
      value={{ toggleTheme, toggleFont, mode, font, fontSize, setFontSize }}
    >
      <CPPTheme theme={theme}>{children}</CPPTheme>
    </ThemeContext.Provider>
  );
};
