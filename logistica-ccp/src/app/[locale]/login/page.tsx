'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { signin, signOutUser } from '../../../../firebase-utils/authentication';
import { Button, CircularProgress, TextField } from '@mui/material';
import PageTitle from '@/globalComponents/PageTitle';
import { useTranslations } from 'next-intl';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    cpp: true;
    dark: true;
  }
}

const Login: React.FC = () => {
  const t = useTranslations('Login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const result = await signin(email, password);

    if (!result.success) {
      console.log(result.code);
      setErrorMessage(result.code);
      setLoading(false);
      return;
    }

    router.push('/products');
  };

  useEffect(() => {
    const logout = async () => {
      try {
        await signOutUser();
        console.log('Usuario deslogeado exitosamente.');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };

    logout();
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/login.png')" }}
      ></div>
      <div className="w-[720px] flex items-center justify-center">
        <div className="w-full max-w-md px-8 py-12">
          <div className="mb-[70px]">
            <PageTitle text={t('title')} isCustom customClass="text-center" />
          </div>
          <div className="space-y-6">
            <div>
              <TextField
                id="outlined-basic"
                label={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 mb-1"
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                label={t('password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="mt-6 min-h-[88px] mt-[70px]">
              {loading ? (
                <div className="flex justify-center items-center h-full py-8">
                  <CircularProgress size={30} color="inherit" />
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="cpp"
                    startIcon={<AccountCircleIcon />}
                    data-testid="loginButton"
                    className="w-full"
                    sx={{ textTransform: 'none' }}
                  >
                    {t('login_button')}
                  </Button>
                  {errorMessage && (
                    <div className="text-red-500 text-center mt-4">
                      {t(errorMessage)}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
