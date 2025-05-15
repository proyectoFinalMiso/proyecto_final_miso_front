import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClientsTable from '../../components/ClientsTable';
import { Cliente } from '../../services/api/clientsService';
import { Colors } from '../../constants/Colors';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string, options?: any) => {
            const translations: Record<string, string> = {
                'clientsModal.clients': 'Clientes',
                'clientsModal.empty': 'No tienes clientes asignados'
            };
            return translations[key] || key;
        }
    })
}));

jest.mock('../../contexts/ThemeContext', () => {
    const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
    return {
        useTheme: jest.fn().mockReturnValue({
            theme: 'light',
            colors: ActualAppColors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),
        }),
    };
});

describe('ClientsTable Component', () => {
    const mockClients: Cliente[] = [
        { id: '1', nombre: 'Cliente 1', correo: 'cliente1@example.com' },
        { id: '2', nombre: 'Cliente 2', correo: 'cliente2@example.com' }
    ];

    const mockOnClientPress = jest.fn();
    const mockRefreshControl = <></>;

    beforeEach(() => {
        jest.clearAllMocks();
        const mockUseTheme = require('../../contexts/ThemeContext').useTheme;
                mockUseTheme.mockReturnValue({
                    theme: 'light',
                    colors: Colors.light,
                    isDark: false,
                    toggleTheme: jest.fn(),
                    setTheme: jest.fn(),
                });
    });

    it('renders correctly with clients', () => {
        const { getByText, getByTestId, getAllByTestId } = render(
            <ClientsTable 
                clients={mockClients} 
                onClientPress={mockOnClientPress} 
                refreshControl={mockRefreshControl}
            />
        );

        expect(getByTestId('clients-title')).toBeTruthy();
        expect(getByText('Clientes')).toBeTruthy();
        expect(getByText('Cliente 1')).toBeTruthy();
        expect(getByText('Cliente 2')).toBeTruthy();
        
        // Should render the client rows correctly
        const clientElements = getAllByTestId(/^client-/);
        expect(clientElements.length).toBe(2);
    });

    it('displays empty state message when no clients', () => {
        const { getByText, queryByText, getByTestId } = render(
            <ClientsTable 
                clients={[]} 
                onClientPress={mockOnClientPress} 
                refreshControl={mockRefreshControl}
            />
        );

        expect(getByText('Clientes')).toBeTruthy();
        expect(getByTestId('empty-clients')).toBeTruthy();
        expect(getByText('No tienes clientes asignados')).toBeTruthy();
        expect(queryByText('Cliente 1')).toBeNull();
    });

    it('calls onClientPress when a client is pressed', () => {
        const { getByTestId } = render(
            <ClientsTable 
                clients={mockClients} 
                onClientPress={mockOnClientPress} 
                refreshControl={mockRefreshControl}
            />
        );

        fireEvent.press(getByTestId('client-1'));

        expect(mockOnClientPress).toHaveBeenCalledTimes(1);
        expect(mockOnClientPress).toHaveBeenCalledWith(mockClients[0]);
    });

    it('renders correctly without onClientPress handler', () => {
        // This test ensures the component doesn't crash if no handler is provided
        const { getByText } = render(
            <ClientsTable 
                clients={mockClients} 
                refreshControl={mockRefreshControl}
            />
        );

        expect(getByText('Cliente 1')).toBeTruthy();
        // pressing should not cause errors
        fireEvent.press(getByText('Cliente 1'));
        // no assertion needed, just checking it doesn't throw
    });

});
