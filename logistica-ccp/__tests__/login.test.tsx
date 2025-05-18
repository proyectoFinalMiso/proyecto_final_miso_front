import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signOutUser, signin } from '../firebase-utils/authentication';
import Login from '@/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';

jest.mock('../firebase-utils/authentication');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockMessages = {
  title: 'Iniciar sesión',
  email_placeholder: 'Correo electrónico',
  password_placeholder: 'Contraseña',
  login_button: 'Entrar',
  auth_invalid_credential: 'Credenciales inválidas',
};

const mockPush = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (signOutUser as jest.Mock).mockClear();
  (signin as jest.Mock).mockClear();
  mockPush.mockClear();
});

const renderLogin = () =>
  render(
    <NextIntlClientProvider locale="es" messages={mockMessages}>
      <Login />
    </NextIntlClientProvider>
  );

describe('Login page', () => {
  it('renderiza correctamente', () => {
    renderLogin();

    expect(screen.getByLabelText('email_placeholder')).toBeInTheDocument();
    expect(screen.getByLabelText('password_placeholder')).toBeInTheDocument();
    expect(screen.getByText('login_button')).toBeInTheDocument();
  });

  it('deslogea automáticamente al renderizar', async () => {
    renderLogin();

    await waitFor(() => {
      expect(signOutUser).toHaveBeenCalled();
    });
  });
  it('muestra un error cuando las credenciales son inválidas', async () => {
    (signin as jest.Mock).mockResolvedValue({
      success: false,
      code: 'auth_invalid_credential',
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText('email_placeholder'), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText('password_placeholder'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByTestId('loginButton'));

    await waitFor(() => {
      expect(screen.getByText('auth_invalid_credential')).toBeInTheDocument();
    });
  });
});
