'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
      cpp: Palette['primary'];
      dark: Palette['secondary'];
    }
  
    interface PaletteOptions {
      cpp?: PaletteOptions['primary'];
      dark?: PaletteOptions['secondary'];
    }
  }

const theme = createTheme({
    palette: {
        cpp: {
            main: '#496348',
            light: '#A7C1A7',
            dark: '#3D503D',
            contrastText: '#FFF'
        },
        dark: {
            main: '#2E2E2E'
        }
    },
    typography: {
        fontFamily: "Plus Jakarta Sans",
    }
})

export default theme