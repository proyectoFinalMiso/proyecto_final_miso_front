import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Colors, ThemeColors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeMode>(systemColorScheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (storedTheme) {
          setThemeState(storedTheme);
        } else {
          setThemeState(systemColorScheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
        setThemeState(systemColorScheme);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    });
    return () => subscription.remove();
  }, []);


  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  const colors = useMemo(() => Colors[theme], [theme]);
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
