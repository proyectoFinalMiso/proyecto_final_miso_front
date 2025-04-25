'use client';
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark' | 'contrast') => {
  const baseMode: 'light' | 'dark' = mode === 'contrast' ? 'dark' : mode;

  return {
    palette: {
      mode: baseMode,
      cpp: {
        main: '#496348',
        light: '#A7C1A7',
        dark: '#3D503D',
        dropzone: '#F8F8F8',
        contrastText: '#FFF',
      },
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1E1E1E',
          dropzone: '#262626',
        },
      }),
      ...(mode === 'contrast' && {
        background: {
          default: "#000000",
          paper: "#000000",
          dropzone: '#111111',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#FFD700',
        }
      })
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
    },
  };
};

export const getTheme = (mode: 'light' | 'dark' | 'contrast') => createTheme(getDesignTokens(mode))