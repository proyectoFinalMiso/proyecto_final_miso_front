'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material/';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { auth } from '../../firebase-utils/config';

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.includes('/login');

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const loggedIn = !!user;
      setIsAuthenticated(loggedIn);
      setIsLoading(false);

      if (!loggedIn && !isAuthPage) {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container sx={{ flex: 1, minHeight: '100vh' }}>
          <Grid
            size={2}
            sx={{
              minWidth: '20rem',
              minHeight: '100vh',
              overflow: 'auto',
              alignItems: 'stretch',
            }}
          >
            <Sidebar />
          </Grid>

          <Grid
            direction="column"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: '100vh',
            }}
          >
            <Grid size="grow" sx={{ flex: 1, overflow: 'auto' }}>
              {children}
            </Grid>
            <Grid sx={{ width: '100%', alignItems: 'flex-end' }}>
              <Footer />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
