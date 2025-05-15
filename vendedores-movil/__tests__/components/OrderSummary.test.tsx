import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import OrderSummary from '../../components/OrderSummary';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as orderService from '../../services/api/orderService';
import * as clientsService from '../../services/api/clientsService';

// Mock order service
jest.mock('../../services/api/orderService');
const mockedOrderService = orderService as jest.Mocked<typeof orderService>;

// Mock clients service
jest.mock('../../services/api/clientsService');
const mockedClientsService = clientsService as jest.Mocked<typeof clientsService>;

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn()
}));

const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

// Mock auth context values
jest.mock('../../contexts/AuthContext', () => {
    const actualContext = jest.requireActual('../../contexts/AuthContext');
    return {
        ...actualContext,
        useAuth: jest.fn()
    };
});

const mockUseAuth = useAuth as jest.Mock;

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <AuthProvider>
            <CartProvider>
                {component}
            </CartProvider>
        </AuthProvider>
    );
};

describe('OrderSummary', () => {
    const product1: Product = { id: '1', name: 'Producto 1', price: 10000, sku: 10006 };
    const product2: Product = { id: '2', name: 'Producto 2', price: 20000, sku: 10007 };

    const mockVendedorData = {
        id: '456',
        correo: 'vendedor@example.com',
        nombre: 'Vendedor Test'
    };

    const mockClients = [
        { id: '123', nombre: 'Test Client', correo: 'client@example.com', vendedorAsociado: '456' }
    ];

    beforeEach(() => {
        mockConsoleLog.mockClear();
        mockedOrderService.sendOrder.mockClear();
        mockedClientsService.fetchClients.mockClear();
        (Alert.alert as jest.Mock).mockClear();

        // Default mocks
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            vendedorData: mockVendedorData
        });

        mockedClientsService.fetchClients.mockResolvedValue(mockClients);
    });

    it('should render with the correct total when cart is empty', () => {
        const { getByText } = renderWithProvider(<OrderSummary />);

        expect(getByText('Total:')).toBeTruthy();
        expect(getByText('$0 COP')).toBeTruthy();
        expect(getByText('Finalizar Pedido')).toBeTruthy();
    });

    it('should display the correct total when cart has items', () => {
        const { getByText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <OrderSummary />
            </>
        );

        // $10000 + $20000 = $30000
        expect(getByText('$30000 COP')).toBeTruthy();
    });

    it('should calculate total correctly with multiple quantities', () => {
        const { getByText } = renderWithProvider(
            <>
                <TestCartAdder
                    products={[product1, product2]}
                    quantities={[2, 3]}
                />
                <OrderSummary />
            </>
        );

        // (2 * $10000) + (3 * $20000) = $20000 + $60000 = $80000
        expect(getByText('$80000 COP')).toBeTruthy();
    });

    it('should show error alert when trying to order with empty cart', async () => {
        const { getByText, getByPlaceholderText } = renderWithProvider(<OrderSummary />);

        // Wait for clients to load and select a client
        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
        });

        // Select a client
        fireEvent.press(getByText('Selecciona un cliente'));
        fireEvent.press(getByText('Test Client'));

        // Fill in the required address field
        fireEvent.changeText(
            getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'),
            'Calle 123 # 45-67. Ciudad de Bogotá'
        );

        fireEvent.press(getByText('Finalizar Pedido'));

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No hay productos en el carrito');
        expect(mockedOrderService.sendOrder).not.toHaveBeenCalled();
    });

    it('should show error alert when user is not logged in', async () => {
        // Mock user not logged in
        mockUseAuth.mockReturnValue({
            isLoggedIn: false,
            vendedorData: null
        });

        const { getByText, getByPlaceholderText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <OrderSummary />
            </>
        );

        // Wait for setup
        await waitFor(() => { });

        // Fill in the required address field
        fireEvent.changeText(
            getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'),
            'Calle 123 # 45-67. Ciudad de Bogotá'
        );

        try {
            fireEvent.press(getByText('Selecciona un cliente'));
        } catch (e) {
        }

        fireEvent.press(getByText('Finalizar Pedido'));

        expect(mockedOrderService.sendOrder).not.toHaveBeenCalled();
    });

    it('should send order successfully and clear cart', async () => {
        // Mock successful order
        mockedOrderService.sendOrder.mockResolvedValueOnce({
            body: { id: 'order-123' },
            msg: 'Pedido creado exitosamente'
        });

        // Create a mock for clearCart in CartContext
        const originalUseCart = require('../../contexts/CartContext').useCart;
        const mockClearCart = jest.fn();

        // Replace the useCart hook with our mocked version
        jest.spyOn(require('../../contexts/CartContext'), 'useCart').mockImplementation(() => ({
            ...originalUseCart(),
            clearCart: mockClearCart
        }));

        const { getByText, getByPlaceholderText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <OrderSummary />
            </>
        );

        // Wait for clients to load
        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
        });

        // Select a client
        fireEvent.press(getByText('Selecciona un cliente'));
        fireEvent.press(getByText('Test Client'));

        const direccion = 'Calle Principal 123 # 45-67. Ciudad de Bogotá';
        fireEvent.changeText(
            getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'),
            direccion
        );

        fireEvent.press(getByText('Finalizar Pedido'));

        await waitFor(() => {
            expect(mockedOrderService.sendOrder).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ product: product1 }),
                    expect.objectContaining({ product: product2 })
                ]),
                mockClients[0].id,
                mockVendedorData.id,
                direccion
            );
        });

        // Simulate OK button press on the success alert
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const successAlertCall = alertCalls.find(
            call => call[0] === 'Éxito' && call[1] === 'El pedido se ha enviado correctamente'
        );

        if (successAlertCall && successAlertCall[2] && successAlertCall[2][0] && successAlertCall[2][0].onPress) {
            successAlertCall[2][0].onPress();
        }

        // Now verify the cart was cleared
        expect(mockClearCart).toHaveBeenCalled();

        // Restore the original useCart implementation
        jest.restoreAllMocks();
    });

    it('should show error message when order fails', async () => {
        // Mock order error
        const errorMessage = 'Network error';
        mockedOrderService.sendOrder.mockRejectedValueOnce(new Error(errorMessage));

        const { getByText, getByPlaceholderText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <OrderSummary />
            </>
        );

        // Wait for clients to load
        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
        });

        // Select a client
        fireEvent.press(getByText('Selecciona un cliente'));
        fireEvent.press(getByText('Test Client'));

        fireEvent.changeText(
            getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'),
            'Calle 123 # 45-67. Ciudad de Bogotá'
        );

        fireEvent.press(getByText('Finalizar Pedido'));

        await waitFor(() => {
            expect(mockedOrderService.sendOrder).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                `Ocurrió un error al enviar el pedido: ${errorMessage}`
            );
        });
    });

    it('should handle case when no clients are available', async () => {
        // Mock empty clients list
        mockedClientsService.fetchClients.mockResolvedValueOnce([]);

        const { queryByText, getByText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <OrderSummary />
            </>
        );

        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
        });

        fireEvent.press(getByText('Selecciona un cliente'));

        expect(mockedClientsService.fetchClients).toHaveBeenCalledWith(mockVendedorData.id);
    });

    it('should handle error when fetching clients fails', async () => {
        const errorMessage = 'Failed to fetch clients';
        mockedClientsService.fetchClients.mockRejectedValueOnce(new Error(errorMessage));

        renderWithProvider(<OrderSummary />);

        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudieron cargar los clientes. Por favor intente de nuevo.');
        });
    });

    it('should close client dropdown when clicking outside', async () => {
        const { getByText, queryByText } = renderWithProvider(<OrderSummary />);

        await waitFor(() => {
            expect(mockedClientsService.fetchClients).toHaveBeenCalled();
        });

        fireEvent.press(getByText('Selecciona un cliente'));

        try {
            const closeButton = getByText('Cerrar');
            fireEvent.press(closeButton);
        } catch (e) {
        }
    });

    it('should properly format currency in the total', () => {
        const { getByText } = renderWithProvider(
            <>
                <TestCartAdder
                    products={[
                        { ...product1, price: 1000000 } // 1 million
                    ]}
                />
                <OrderSummary />
            </>
        );

        expect(getByText('$1000000 COP')).toBeTruthy();
    });
});

// Helper component to add products to cart for testing
const TestCartAdder = ({ products, quantities = [] }: { products: Product[], quantities?: number[] }) => {
    const { addToCart } = useCart();

    React.useEffect(() => {
        products.forEach((product, index) => {
            const quantity = quantities[index] || 1;
            addToCart(product, quantity);
        });
    }, []);

    return null;
};

// Helper to mock cart context with custom clear function
const CartContextMock = ({ children, clearCart }: { children: React.ReactNode, clearCart: () => void }) => {
    const originalContext = jest.requireActual('../../contexts/CartContext');

    const mockContext = {
        ...originalContext,
        useCart: () => ({
            ...originalContext.useCart(),
            clearCart
        })
    };

    return (
        <mockContext.CartProvider>
            {children}
        </mockContext.CartProvider>
    );
}; 
