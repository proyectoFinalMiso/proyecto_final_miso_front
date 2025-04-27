'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    sidebar: string;
    dropzone: string;
    tableHeader: string;
  }

  interface TypeText {
    sidebar: string;
  } 
}

export const getDesignTokens = (
  mode: 'light' | 'dark' | 'contrast',
  font: 'plusJakartaSans' | 'lexend',
  fontSize: number
) => {

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
      ...(mode === 'light' && {
        background: {
          default: '#F8F8F8',
          paper: '#FFFFFF',
          dropzone: '#F8F8F8',
          sidebar: '#496348',
          tableHeader: '#496348'
        },
        text: {
          primary: '#2E2E2E',
          sidebar: '#FFFFFF'
        }
      }),
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1E1E1E',
          dropzone: '#262626',
          sidebar: '#496348',
          tableHeader: '#496348'
        },
      }),
      ...(mode === 'contrast' && {
        background: {
          default: "#000000",
          paper: "#000000",
          dropzone: '#111111',
          sidebar: "#000000",
          tableHeader: '#000000'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#FFD700',
        }
      })
    },
    typography: {
      fontFamily: font === 'plusJakartaSans' ? 'Plus Jakarta Sans' : 'Lexend Deca',
      fontSize,
      fontWeight: font === 'plusJakartaSans' ? 500 : 500,
    },
  };
};

export const getTheme = (
  mode: 'light' | 'dark' | 'contrast',
  font: 'plusJakartaSans' | 'lexend',
  fontSize: number
) => createTheme(getDesignTokens(mode, font, fontSize))