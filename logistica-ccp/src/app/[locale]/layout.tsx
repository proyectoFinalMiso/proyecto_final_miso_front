import type { Metadata } from 'next';
import '../globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Lexend_Deca, Plus_Jakarta_Sans } from 'next/font/google';

import { ThemeProvider } from '../../themeContext';

// Translation wrapper
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import GlobalLayout from '../../globalComponents/GlobalLayout';

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const lexend = Lexend_Deca({
  weight: ['500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend-exa',
});

export const metadata: Metadata = {
  title: 'Logística CPP',
  description: 'Aplicación web para la gestión de bodegas de CPP',
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextIntlClientProvider locale={locale}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container sx={{ flex: 1, minHeight: "100vh" }}>

                  <Grid sx={{ minHeight: "100vh", overflow: "auto", alignItems: "stretch" }}>
                    <Sidebar />
                  </Grid>

                  <Grid direction="column" sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "100vh" }}>

                    <Grid size="grow" sx={{ flex: 1, overflow: "auto" }}>
                      {children}
                    </Grid>

                    <Grid sx={{ width: "100%", alignItems: "flex-end" }}>
                      <Footer />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </NextIntlClientProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
