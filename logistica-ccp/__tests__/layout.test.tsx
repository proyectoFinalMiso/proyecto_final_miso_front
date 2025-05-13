import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LocaleLayout from '@/app/[locale]/layout';
import userEvent from '@testing-library/user-event';

jest.mock('firebase/auth');

describe('Layout base', () => {
  const renderWithLayout = async () => {
    const layout = await LocaleLayout({
      children: <div>Dummy</div>,
      params: Promise.resolve({ locale: 'es' }),
    });

    render(layout);
  };

  it('Renderizado de sidebar', async () => {
    await renderWithLayout();
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('Renderizado de footer', async () => {
    await renderWithLayout();
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(screen.getByTestId('copyright-title')).toBeInTheDocument();
  });

  it('Validar selector de cambio de idioma', async () => {
    await renderWithLayout();
    const user = userEvent.setup();
    const languageSelector = screen.getByTitle('language-selector');
    expect(languageSelector).toBeInTheDocument();
  });
});
