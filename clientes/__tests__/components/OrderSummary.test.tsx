import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import OrderSummary from '../../components/OrderSummary';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as orderService from '../../services/api/orderService';

// Mock order service
jest.mock('../../services/api/orderService');
const mockedOrderService = orderService as jest.Mocked<typeof orderService>;

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

    const mockClientData = {
        cliente: {
            id: '123',
            nombre: 'Test User',
            correo: 'test@example.com',
            vendedorAsociado: '456'
        }
    };

    beforeEach(() => {
        mockConsoleLog.mockClear();
        mockedOrderService.sendOrder.mockClear();
        (Alert.alert as jest.Mock).mockClear();

        // Default mock for useAuth
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            clienteData: mockClientData
        });
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

    it('should show error alert when trying to order with empty cart', () => {
        const { getByText, getByPlaceholderText } = renderWithProvider(<OrderSummary />);

        // Fill in the required address field
        fireEvent.changeText(getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'), 'Calle 123 # 45-67. Ciudad de Bogotá');

        fireEvent.press(getByText('Finalizar Pedido'));

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No hay productos en el carrito');
        expect(mockedOrderService.sendOrder).not.toHaveBeenCalled();
    });

    it('should show error alert when user is not logged in', () => {
        // Mock user not logged in
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            clienteData: null
        });

        const { getByText, getByPlaceholderText } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <OrderSummary />
            </>
        );

        // Fill in the required address field
        fireEvent.changeText(getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'), 'Calle 123 # 45-67. Ciudad de Bogotá');

        fireEvent.press(getByText('Finalizar Pedido'));

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Debes iniciar sesión para realizar un pedido');
        expect(mockedOrderService.sendOrder).not.toHaveBeenCalled();
    });

    it('should send order successfully and clear cart', async () => {
        // Mock successful order
        mockedOrderService.sendOrder.mockResolvedValueOnce({
            body: { id: 'order-123' },
            msg: 'Pedido creado exitosamente'
        });

        const mockClearCart = jest.fn();

        const { getByText, getByPlaceholderText } = render(
            <AuthProvider>
                <CartContextMock clearCart={mockClearCart}>
                    <TestCartAdder products={[product1, product2]} />
                    <OrderSummary />
                </CartContextMock>
            </AuthProvider>
        );

        const direccion = 'Calle Principal 123 # 45-67. Ciudad de Bogotá';
        fireEvent.changeText(getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'), direccion);
        fireEvent.press(getByText('Finalizar Pedido'));

        await waitFor(() => {
            expect(mockedOrderService.sendOrder).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ product: product1 }),
                    expect.objectContaining({ product: product2 })
                ]),
                mockClientData.cliente.id,
                mockClientData.cliente.vendedorAsociado,
                direccion
            );

            // Check that alert was shown
            expect(Alert.alert).toHaveBeenCalledWith(
                'Éxito',
                'El pedido se ha enviado correctamente',
                expect.arrayContaining([
                    expect.objectContaining({ text: 'OK' })
                ])
            );
        });

        // Simulate clicking OK on the alert
        const alertCallArgs = (Alert.alert as jest.Mock).mock.calls[0];
        const okButton = alertCallArgs[2][0];
        okButton.onPress();
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

        fireEvent.changeText(getByPlaceholderText('Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá'), 'Calle 123 # 45-67. Ciudad de Bogotá');
        fireEvent.press(getByText('Finalizar Pedido'));

        await waitFor(() => {
            expect(mockedOrderService.sendOrder).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                `Ocurrió un error al enviar el pedido: ${errorMessage}`
            );
        });
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
