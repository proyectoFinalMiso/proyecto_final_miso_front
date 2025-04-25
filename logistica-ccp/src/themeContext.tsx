'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as CPPTheme } from '@mui/material/styles';
import { getTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'contrast'

const ThemeContext = createContext({
    toggleTheme: () => {},
    mode: 'light' as ThemeMode
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark' | 'contrast'>('light');
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
      if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'contrast') {
        setMode (storedMode)
      } else {
        setMode('light')
      }
      setHasMounted(true);
    })

    const toggleTheme = () => {
        setMode((prev) => {
          const newMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'contrast' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode
    })
  }
    const theme = useMemo(() => mode ? getTheme(mode): getTheme('light'), [mode]);

    if (!hasMounted) return null;

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
          <CPPTheme theme={theme}>
            {children}  
          </CPPTheme>
        </ThemeContext.Provider>
    );
}