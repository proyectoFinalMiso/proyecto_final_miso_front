import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import OrdersScreen from '../../app/(tabs)/orders';
import { Order } from '../../services/api/orderService';

// Mock services
jest.mock('../../services/api/orderService', () => ({
    fetchClientOrders: jest.fn(),
    Order: jest.requireActual('../../services/api/orderService').Order
}));

// Mock context
jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(() => ({ clienteId: 'testClient123' }))
}));

// Mock components
jest.mock('../../components/OrderTable', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => (
        <MockView testID="order-table-mock">
            {props.refreshControl}
        </MockView>
    ));
});

jest.mock('../../components/LoadingIndicator', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => (
        <MockView testID="loading-indicator-mock">{props.message}</MockView>
    ));
});

jest.mock('../../components/ErrorDisplay', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => (
        <MockView testID="error-display-mock">
            <MockView testID="retry-button" onPress={props.onRetry} />
        </MockView>
    ));
});

jest.mock('../../components/FilterOrdersModal', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => {
        const onApply = () => props.onApply && props.onApply();
        const onClear = () => props.onClear && props.onClear();
        const onClose = () => props.onClose && props.onClose();
        const onTempPriceChange = (field: 'min' | 'max', value: string) =>
            props.onTempPriceChange && props.onTempPriceChange(field, value);
        const onTempDateChange = (field: 'start' | 'end', value: string) =>
            props.onTempDateChange && props.onTempDateChange(field, value);

        return (
            <MockView testID="filter-modal-mock">
                <MockView testID="apply-button" onPress={onApply} />
                <MockView testID="clear-button" onPress={onClear} />
                <MockView testID="close-button" onPress={onClose} />
                <MockView
                    testID="min-price-input"
                    onChangeText={(value: string) => onTempPriceChange('min', value)}
                />
                <MockView
                    testID="max-price-input"
                    onChangeText={(value: string) => onTempPriceChange('max', value)}
                />
                <MockView
                    testID="start-date-input"
                    onChangeText={(value: string) => onTempDateChange('start', value)}
                />
                <MockView
                    testID="end-date-input"
                    onChangeText={(value: string) => onTempDateChange('end', value)}
                />
            </MockView>
        );
    });
});

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

// Mock i18n translation
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string, options?: any) => {
            const translations: Record<string, string> = {
                'orders.noClientId': 'No se encontró el ID del cliente',
                'orders.loadError': 'No se pudieron cargar los pedidos. Por favor intente de nuevo.',
                'orders.lastUpdated': 'Última actualización: ' + (options?.time || ''),
                'orders.loading': 'Cargando pedidos...',
                'orders.title': 'Mis pedidos',
                'orders.searchOrders': 'Busca por dirección...',
                'orders.search': 'Buscar pedidos',
                'orders.searchHint': 'Ingresa la dirección del pedido que buscas',
                'orders.filterOrders': 'Filtrar pedidos',
                'orders.filterHint': 'Abre el modal de filtrado',
                'orders.filters': 'Filtros activos:',
                'orders.from': 'Desde',
                'orders.to': 'Hasta',
                'orders.clearFilters': 'Limpiar filtros',
                'orders.priceRangeError': 'El valor mínimo no puede ser mayor que el valor máximo.',
                'orders.dateRangeError': 'La fecha de inicio no puede ser mayor que la fecha de fin.',
                'products.minPrice': 'Valor mín',
                'products.maxPrice': 'Valor máx',
            };
            return translations[key] || key;
        }
    })
}));

// Implement console mocks
global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

describe('OrdersScreen', () => {
    const mockOrders: Order[] = [
        {
            id: 'order1',
            cliente: 'testClient123',
            direccion: 'Calle 123 #45-67',
            estado: 'SOLICITADO',
            fechaIngreso: '2023-04-15T10:30:00',
            latitud: 4.5,
            longitud: -74.2,
            packingList: 'packing1',
            valorFactura: 25000,
            vendedor: 'vendedor1'
        },
        {
            id: 'order2',
            cliente: 'testClient123',
            direccion: 'Avenida 78 #90-12',
            estado: 'FINALIZADO',
            fechaIngreso: '2023-04-14T15:45:00',
            latitud: 4.7,
            longitud: -74.1,
            packingList: 'packing2',
            valorFactura: 35000,
            vendedor: 'vendedor1'
        }
    ];

    const mockOrderService = require('../../services/api/orderService');

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Setup default mock for API function
        mockOrderService.fetchClientOrders.mockResolvedValue({ pedidos: mockOrders });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should show loading indicator while fetching data', async () => {
        mockOrderService.fetchClientOrders.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ pedidos: [] }), 100))
        );

        const { getByTestId } = render(<OrdersScreen />);
        expect(getByTestId('loading-indicator-mock')).toBeTruthy();
    });

    it('should show error display when fetching fails', async () => {
        mockOrderService.fetchClientOrders.mockRejectedValue(new Error('API Error'));

        const { getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });
    });

    it('should retry fetching data when retry button is pressed', async () => {
        mockOrderService.fetchClientOrders.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });

        mockOrderService.fetchClientOrders.mockResolvedValueOnce({ pedidos: mockOrders });

        act(() => {
            fireEvent.press(getByTestId('retry-button'));
        });

        await waitFor(() => {
            expect(mockOrderService.fetchClientOrders).toHaveBeenCalledTimes(2);
        });
    });

    it('should render search input and order table when data is loaded', async () => {
        const { getByPlaceholderText, getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('order-table-mock')).toBeTruthy();
            expect(getByPlaceholderText('Busca por dirección...')).toBeTruthy();
        });

        const OrderTableMock = require('../../components/OrderTable');
        expect(OrderTableMock).toHaveBeenCalled();
    });

    it('should open filter modal when filter button is pressed', async () => {
        const { getByLabelText, getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            const filterButton = getByLabelText('Filtrar pedidos');
            expect(filterButton).toBeTruthy();

            act(() => {
                fireEvent.press(filterButton);
            });
        });

        expect(getByTestId('filter-modal-mock')).toBeTruthy();
    });

    it('should filter orders by search text', async () => {
        const { getByPlaceholderText, getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('order-table-mock')).toBeTruthy();
        });

        act(() => {
            fireEvent.changeText(getByPlaceholderText('Busca por dirección...'), 'Calle');
        });

        await waitFor(() => {
            const OrderTableMock = require('../../components/OrderTable');
            const lastCall = OrderTableMock.mock.calls[OrderTableMock.mock.calls.length - 1][0];
            expect(lastCall.orders.length).toBe(1);
            expect(lastCall.orders[0].direccion).toContain('Calle');
        });
    });

    it('should filter orders by price range', async () => {
        const { getByLabelText, getByTestId } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('order-table-mock')).toBeTruthy();
        });

        // Open filter modal
        act(() => {
            fireEvent.press(getByLabelText('Filtrar pedidos'));
        });

        const filterModal = getByTestId('filter-modal-mock');

        // Set min price
        act(() => {
            fireEvent.changeText(getByTestId('min-price-input'), '30000');
        });

        // Apply filter
        act(() => {
            fireEvent.press(getByTestId('apply-button'));
        });

        await waitFor(() => {
            const OrderTableMock = require('../../components/OrderTable');
            const lastCall = OrderTableMock.mock.calls[OrderTableMock.mock.calls.length - 1][0];
            expect(lastCall.orders.length).toBe(1);
            expect(lastCall.orders[0].valorFactura).toBeGreaterThanOrEqual(30000);
        });
    });

    it('should refresh data automatically on interval', async () => {
        render(<OrdersScreen />);

        await waitFor(() => {
            expect(mockOrderService.fetchClientOrders).toHaveBeenCalledTimes(1);
        });

        // Fast-forward time to trigger auto-refresh
        act(() => {
            jest.advanceTimersByTime(30000);
        });

        await waitFor(() => {
            expect(mockOrderService.fetchClientOrders).toHaveBeenCalledTimes(2);
        });
    });

    it('should clear filters when clear button is pressed', async () => {
        const { getByLabelText, getByTestId, getByText } = render(<OrdersScreen />);

        await waitFor(() => {
            expect(getByTestId('order-table-mock')).toBeTruthy();
        });

        // Open filter modal
        act(() => {
            fireEvent.press(getByLabelText('Filtrar pedidos'));
        });

        // Set min price
        act(() => {
            fireEvent.changeText(getByTestId('min-price-input'), '30000');
        });

        // Apply filter
        act(() => {
            fireEvent.press(getByTestId('apply-button'));
        });

        // Verify filter is active
        await waitFor(() => {
            expect(getByText(/Filtros activos/)).toBeTruthy();
        });

        // Clear filters
        act(() => {
            fireEvent.press(getByTestId('clear-filters-button'));
        });

        // Verify all orders are shown again
        await waitFor(() => {
            const OrderTableMock = require('../../components/OrderTable');
            const lastCall = OrderTableMock.mock.calls[OrderTableMock.mock.calls.length - 1][0];
            expect(lastCall.orders.length).toBe(2);
        });
    });
});
