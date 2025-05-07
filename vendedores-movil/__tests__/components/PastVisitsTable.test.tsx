import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PastVisitsTable from '../../components/PastVisitsTable';
import { Visit } from '../../services/api/clientsService';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';

const mockVisits: Visit[] = [
  { id: 1, fecha: '2024-01-15T10:00:00Z', estado: 'completada', cliente_id: '1', vendedor_id: '1' },
  { id: 2, fecha: '2024-01-20T14:30:00Z', estado: 'completada', cliente_id: '1', vendedor_id: '1' },
];

const emptyVisits: Visit[] = [];

const renderWithProviders = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('PastVisitsTable', () => {
  beforeAll(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
    i18n.changeLanguage('es'); 
  });

  it('renders correctly with a list of visits (default to Spanish)', () => {
    renderWithProviders(<PastVisitsTable visits={mockVisits} />);
    expect(screen.getByTestId('planned-visits-title')).toBeTruthy();
    expect(screen.getByText(/15 de enero de 2024, 05:00/)).toBeTruthy();
    expect(screen.getByText(/20 de enero de 2024, 09:30/)).toBeTruthy();
  });

  it('renders correctly with an empty list of visits (default to Spanish)', () => {
    renderWithProviders(<PastVisitsTable visits={emptyVisits} />);
    expect(screen.getByTestId('planned-visits-title')).toBeTruthy();
    expect(screen.getByTestId('empty-planned-visits')).toBeTruthy();
    expect(screen.getByText('No se encontraron visitas completadas para este cliente')).toBeTruthy();
  });

  it('displays the correct title (default to Spanish)', () => {
    renderWithProviders(<PastVisitsTable visits={mockVisits} />);
    expect(screen.getByText('Visitas')).toBeTruthy(); 
  });

  it('displays the correct empty message when no visits are provided (default to Spanish)', () => {
    renderWithProviders(<PastVisitsTable visits={emptyVisits} />);
    expect(screen.getByText('No se encontraron visitas completadas para este cliente')).toBeTruthy();
  });

  it('formats and displays visit dates correctly for es locale', () => {
    i18n.changeLanguage('es');
    renderWithProviders(<PastVisitsTable visits={mockVisits} />);
    expect(screen.getByText(/15 de enero de 2024, 05:00/)).toBeTruthy();
    expect(screen.getByText(/20 de enero de 2024, 09:30/)).toBeTruthy();
  });

  it('formats and displays visit dates correctly for en locale', () => {
    i18n.changeLanguage('en');
    renderWithProviders(<PastVisitsTable visits={mockVisits} />);
    expect(screen.getByText(/January 15, 2024 at 05:00/)).toBeTruthy(); 
    expect(screen.getByText(/January 20, 2024 at 09:30/)).toBeTruthy();
    expect(screen.getByText('Visits')).toBeTruthy();
    renderWithProviders(<PastVisitsTable visits={emptyVisits} />);
    expect(screen.getByText('No completed visits found for this client')).toBeTruthy();
  });
});
