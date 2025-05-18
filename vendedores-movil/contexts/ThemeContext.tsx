import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Colors, ThemeColors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';
type FontSizeMode = 'small' | 'medium' | 'large';

const fontSizeMultipliers = {
  small: 0.85,
  medium: 1.0,
  large: 1.1,
};

const baseFontSizes = {
  xxxs: 8,
  xxs: 11,
  xs: 12,
  xsPlus: 13,
  sm: 14,
  smd: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxlPlus: 28,
  xxxl: 32,
  title: 42,
};

interface FontSizes {
  xxxs: number;
  xxs: number;
  xs: number;
  xsPlus: number;
  sm: number;
  smd: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxlPlus: number;
  xxxl: number;
  title: number;
}

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  fontSize: FontSizeMode;
  fontSizes: FontSizes;
  setFontSize: (size: FontSizeMode) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';
const FONT_SIZE_STORAGE_KEY = 'app_font_size';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeMode>(systemColorScheme);
  const [fontSize, setFontSizeState] = useState<FontSizeMode>('medium');

  const fontSizes = useMemo<FontSizes>(() => {
    const multiplier = fontSizeMultipliers[fontSize];
    return {
      xxxs: baseFontSizes.xxxs * multiplier,
      xxs: baseFontSizes.xxs * multiplier,
      xs: baseFontSizes.xs * multiplier,
      xsPlus: baseFontSizes.xsPlus * multiplier,
      sm: baseFontSizes.sm * multiplier,
      smd: baseFontSizes.smd * multiplier,
      md: baseFontSizes.md * multiplier,
      lg: baseFontSizes.lg * multiplier,
      xl: baseFontSizes.xl * multiplier,
      xxl: baseFontSizes.xxl * multiplier,
      xxlPlus: baseFontSizes.xxlPlus * multiplier,
      xxxl: baseFontSizes.xxxl * multiplier,
      title: baseFontSizes.title * multiplier,
    };
  }, [fontSize]);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const [storedTheme, storedFontSize] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY),
        ]);
        if (storedTheme) {
          setThemeState(storedTheme as ThemeMode);
        } else {
          setThemeState(systemColorScheme);
        }

        if (storedFontSize) {
          setFontSizeState(storedFontSize as FontSizeMode);
        }
      } catch (error) {
        console.error("Failed to load theme preferences from storage", error);
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
  
  const setFontSize = async (newSize: FontSizeMode) => {
    setFontSizeState(newSize);
    try {
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, newSize);
    } catch (error) {
      console.error("Failed to save font size to storage", error);
    }
  };
  
  const increaseFontSize = () => {
    if (fontSize === 'small') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('large');
  };
  
  const decreaseFontSize = () => {
    if (fontSize === 'large') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('small');
  };
  
  const colors = useMemo(() => Colors[theme], [theme]);
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors, 
      isDark, 
      toggleTheme, 
      setTheme,
      fontSize,
      fontSizes,
      setFontSize,
      increaseFontSize,
      decreaseFontSize
    }}>
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
