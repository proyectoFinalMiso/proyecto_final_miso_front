import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ClientsScreen from '../../../app/(tabs)/clients';
import { useAuth } from '../../../contexts/AuthContext';
import { Cliente } from '../../../services/api/clientsService';
import { useRouter } from 'expo-router';

// Mock services
jest.mock('../../../services/api/clientsService', () => ({
    fetchClients: jest.fn(),
    mapClientesToProducts: jest.fn(),
    Cliente: {}, // Mocking the interface
    ClientesResponse: {} // Mocking the interface
}));

// Mock auth context
jest.mock('../../../contexts/AuthContext', () => ({
    useAuth: jest.fn()
}));

// Mock router
jest.mock('expo-router', () => ({
    useRouter: jest.fn()
}));

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    const MockSafeAreaView = jest.fn(({ children, ...props }) => {
        const ActualView = RN.View;
        return <ActualView {...props}>{children}</ActualView>;
    });
    Object.defineProperty(RN, 'SafeAreaView', { value: MockSafeAreaView });

    const MockRefreshControl = jest.fn(({ children, ...props }) => {
        return <RN.View {...props}>{children}</RN.View>;
    });
    Object.defineProperty(RN, 'RefreshControl', { value: MockRefreshControl });

    return RN;
});

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('../../../components/ClientsTable', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => {
        const onClientPress = (client: Cliente) => props.onClientPress && props.onClientPress(client);
        return (
            <MockView testID="clients-table-mock">
                {props.refreshControl}
                <MockView
                    testID="client-press-button"
                    onPress={() => onClientPress({ id: 'client-id', nombre: 'Test Client', correo: 'client@example.com' })}
                />
            </MockView>
        );
    });
});

jest.mock('../../../components/LoadingIndicator', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => (
        <MockView testID="loading-indicator-mock">{props.message}</MockView>
    ));
});

jest.mock('../../../components/ErrorDisplay', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => (
        <MockView testID="error-display-mock">
            <MockView testID="retry-button" onPress={props.onRetry} />
        </MockView>
    ));
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string, options?: any) => {
            const translations: Record<string, string> = {
                'clients.title': 'Mis clientes',
                'clients.loading': 'Cargando clientes...',
                'clients.loadError': 'No se pudieron cargar los clientes. Por favor intente de nuevo.',
                'clients.search': 'Buscar clientes',
                'clients.searchHint': 'Ingresa el nombre del cliente que buscas'
            };
            return translations[key] || key;
        },
        i18n: { language: 'es', changeLanguage: jest.fn() }
    })
}));

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

describe('ClientsScreen', () => {
    const mockClients: Cliente[] = [
        { id: '1', nombre: 'Cliente 1', correo: 'cliente1@example.com' },
        { id: '2', nombre: 'Cliente 2', correo: 'cliente2@example.com' }
    ];

    const mockVendedorData = {
        id: 'vendor-123',
        nombre: 'Test Vendor',
        correo: 'vendor@example.com'
    };

    const mockClientService = require('../../../services/api/clientsService');
    const mockUseRouter = useRouter as jest.Mock;
    const mockUseAuth = useAuth as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        mockClientService.fetchClients.mockResolvedValue(mockClients);
        mockUseRouter.mockReturnValue({
            push: jest.fn(),
        });
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            vendedorData: mockVendedorData
        });
    });

    it('should show loading indicator while fetching data', async () => {
        mockClientService.fetchClients.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

        const { getByTestId } = render(<ClientsScreen />);
        expect(getByTestId('loading-indicator-mock')).toBeTruthy();
    });

    it('should show error display when fetching fails', async () => {
        mockClientService.fetchClients.mockRejectedValue(new Error('API Error'));

        const { getByTestId } = render(<ClientsScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });
    });

    it('should retry fetching data when retry button is pressed', async () => {
        mockClientService.fetchClients.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(<ClientsScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });

        mockClientService.fetchClients.mockResolvedValueOnce(mockClients);

        act(() => {
            fireEvent.press(getByTestId('retry-button'));
        });

        await waitFor(() => {
            expect(mockClientService.fetchClients).toHaveBeenCalledTimes(2);
        });
    });

    it('should render search input and clients table when data is loaded', async () => {
        const { getByPlaceholderText, getByTestId } = render(<ClientsScreen />);

        await waitFor(() => {
            expect(getByTestId('clients-table-mock')).toBeTruthy();
            expect(getByPlaceholderText('Buscar clientes')).toBeTruthy();
        });

        const ClientsTableMock = require('../../../components/ClientsTable');
        expect(ClientsTableMock).toHaveBeenCalled();
    });

    it('should filter clients when search text changes', async () => {
        const { getByPlaceholderText } = render(<ClientsScreen />);

        await waitFor(() => {
            const searchInput = getByPlaceholderText('Buscar clientes');

            act(() => {
                fireEvent.changeText(searchInput, 'Cliente 1');
            });
        });

        const ClientsTableMock = require('../../../components/ClientsTable');
        expect(ClientsTableMock).toHaveBeenCalled();

        const mockCalls = ClientsTableMock.mock.calls;
        const lastCall = mockCalls[mockCalls.length - 1][0];
        expect(lastCall).toHaveProperty('clients');
        expect(lastCall).toHaveProperty('onClientPress');
        expect(lastCall).toHaveProperty('refreshControl');
    });

    it('should render title correctly', async () => {
        const { getByText } = render(<ClientsScreen />);

        await waitFor(() => {
            expect(getByText('Mis clientes')).toBeTruthy();
        });
    });

    it('should navigate to client detail when client is pressed', async () => {
        const mockPush = jest.fn();
        mockUseRouter.mockReturnValue({ push: mockPush });

        const { getByTestId } = render(<ClientsScreen />);

        await waitFor(() => {
            expect(getByTestId('clients-table-mock')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByTestId('client-press-button'));
        });

        expect(mockPush).toHaveBeenCalledWith('/clients/client-id');
    });

    it('should refresh data when onRefresh is called', async () => {
        const { getByTestId } = render(<ClientsScreen />);

        await waitFor(() => {
            const clientsTable = getByTestId('clients-table-mock');
            expect(clientsTable).toBeTruthy();
        });

        const ClientsTableMock = require('../../../components/ClientsTable');
        const refreshControl = ClientsTableMock.mock.calls[0][0].refreshControl;
        expect(refreshControl).toBeTruthy();

        // Simulate the refresh call
        act(() => {
            refreshControl.props.onRefresh();
        });

        await waitFor(() => {
            expect(mockClientService.fetchClients).toHaveBeenCalledTimes(2);
        });
    });
});
