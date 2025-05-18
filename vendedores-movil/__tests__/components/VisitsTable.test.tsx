import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Visit } from '../../services/api/clientsService';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import VisitsTable from '../../components/VisitsTable';

const mockVisits: Visit[] = [
  {
    id: 1,
    fecha: '2024-07-18T10:00:00Z',
    estado: 'planeada',
    cliente_id: '1',
    vendedor_id: '1',
    cliente_nombre: 'Cliente Uno',
  },
  {
    id: 2,
    fecha: '2024-07-18T14:30:00Z',
    estado: 'planeada',
    cliente_id: '1',
    vendedor_id: '1',
    cliente_nombre: 'Cliente Dos',
  },
];

const emptyVisits: Visit[] = [];

const renderWithProviders = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

const mockBaseFontSizes = {
  xxxs: 8, xxs: 11, xs: 12, xsPlus: 13, sm: 14, smd: 15, md: 16,
  lg: 18, xl: 20, xxl: 24, xxxl: 32, title: 42,
};
const mockFontSizeMultipliers: Record<'small' | 'medium' | 'large', number> = { small: 0.9, medium: 1.0, large: 1.1 };

const calculateMockFontSizes = (fontSizeMode: 'small' | 'medium' | 'large') => {
  const multiplier = mockFontSizeMultipliers[fontSizeMode];
  const calculated: any = {}; 
  for (const key in mockBaseFontSizes) {
  calculated[key] = mockBaseFontSizes[key as keyof typeof mockBaseFontSizes] * multiplier;
  }
  return calculated;
};

const mockDefaultFontSizeMode = 'medium' as 'small' | 'medium' | 'large';
const mockDefaultFontSizes = calculateMockFontSizes(mockDefaultFontSizeMode);

jest.mock('../../contexts/ThemeContext', () => {
  const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
  return {
      useTheme: jest.fn().mockReturnValue({
          theme: 'light',
          colors: ActualAppColors.light,
          isDark: false,
          toggleTheme: jest.fn(),
          setTheme: jest.fn(),

          fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
      }),
  };
});

describe('VisitsTable', () => {
  beforeAll(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
  });

  it('renders the "Hoy" title for TODAY (Spanish)', () => {
    i18n.changeLanguage('es');
    renderWithProviders(<VisitsTable visits={mockVisits} title="TODAY" />);
    expect(screen.getByTestId('visit-title').props.children).toBe('Hoy');
  });

  it('renders the "Mañana" title for TOMORROW (Spanish)', () => {
    i18n.changeLanguage('es');
    renderWithProviders(<VisitsTable visits={mockVisits} title="TOMORROW" />);
    expect(screen.getByTestId('visit-title').props.children).toBe('Mañana');
  });

  it('renders the empty state message for TODAY with no visits (Spanish)', () => {
    i18n.changeLanguage('es');
    renderWithProviders(<VisitsTable visits={emptyVisits} title="TODAY" />);
    expect(screen.getByTestId('empty-visits')).toBeTruthy();
    expect(
      screen.getByText('No tienes visitas programadas para hoy')
    ).toBeTruthy();
  });

  it('renders the empty state message for TOMORROW with no visits (Spanish)', () => {
    i18n.changeLanguage('es');
    renderWithProviders(<VisitsTable visits={emptyVisits} title="TOMORROW" />);
    expect(screen.getByTestId('empty-visits')).toBeTruthy();
    expect(
      screen.getByText('No tienes visitas programadas para mañana')
    ).toBeTruthy();
  });

  it('renders the list of visits correctly', () => {
    i18n.changeLanguage('es');
    const { getByTestId, getByText } = renderWithProviders(
      <VisitsTable visits={mockVisits} title="TODAY" />
    );
    expect(getByTestId('visit-title')).toBeTruthy();
    expect(getByText('Cliente Uno')).toBeTruthy();
    expect(getByText('Cliente Dos')).toBeTruthy();
  });
});