import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderSummary from '../../components/OrderSummary';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';

// Mock console.log to test handleFinishOrder
const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <CartProvider>
            {component}
        </CartProvider>
    );
};

describe('OrderSummary', () => {
    const product1: Product = { id: '1', name: 'Producto 1', price: 10000 };
    const product2: Product = { id: '2', name: 'Producto 2', price: 20000 };

    beforeEach(() => {
        mockConsoleLog.mockClear();
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

    it('should call handleFinishOrder when button is pressed', () => {
        const { getByText } = renderWithProvider(<OrderSummary />);

        fireEvent.press(getByText('Finalizar Pedido'));

        expect(mockConsoleLog).toHaveBeenCalledWith('Finalizar pedido');
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
