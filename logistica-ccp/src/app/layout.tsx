import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles"
import theme from "../theme";

// MUI components for building the base layout
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

// Calling the components that are the base for the rest of the views
import Footer from "../../globalComponents/Footer"
import Sidebar from "../../globalComponents/Sidebar"

// Translation wrapper
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from "next-intl/server";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Logística CPP",
  description: "Aplicación web para la gestión de bodegas de CPP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale() || 'es';
  const messages = await getMessages({locale});
  return (
    <html lang={locale}>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container sx={{ flex: 1, minHeight: "100vh" }}>
                <Grid size={2} sx={{ minWidth: "20rem", minHeight: "100vh", overflow: "auto", alignItems: "stretch" }}>
                  <Sidebar />
                </Grid>

                <Grid direction="column" sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "100vh" }}>

                  <Grid size="grow" sx={{ flex: 1, overflow: "auto" }}>
                    <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
                  </Grid>

                  <Grid sx={{ width: "100%", alignItems: "flex-end" }}>
                    <Footer />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
