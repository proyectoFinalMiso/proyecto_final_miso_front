import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CartTable from '../../components/CartTable';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    configureNext: jest.fn(),
    Presets: {
        easeInEaseOut: 'easeInEaseOut',
    },
}));

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <CartProvider>
            {component}
        </CartProvider>
    );
};

describe('CartTable', () => {
    const product1: Product = { id: '1', name: 'Producto 1', price: 10000, sku: 10001 };
    const product2: Product = { id: '2', name: 'Producto 2', price: 20000, sku: 10002 };

    it('should render empty cart message when cart is empty', () => {
        const { getByTestId } = renderWithProvider(<CartTable />);

        expect(getByTestId('empty-cart-message')).toBeTruthy();
    });

    it('should render products when cart has items', () => {
        const { getByTestId, queryByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1, product2]} />
                <CartTable />
            </>
        );

        expect(queryByTestId('empty-cart-message')).toBeNull();
        expect(getByTestId('cart-items-list')).toBeTruthy();
        expect(getByTestId(`cart-item-${product1.id}`)).toBeTruthy();
        expect(getByTestId(`cart-item-${product2.id}`)).toBeTruthy();
    });

    it('should expand product details when clicked', () => {
        const { getByTestId, queryByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <CartTable />
            </>
        );

        expect(queryByTestId(`expanded-content-${product1.id}`)).toBeNull();

        fireEvent.press(getByTestId(`product-row-${product1.id}`));

        expect(getByTestId(`expanded-content-${product1.id}`)).toBeTruthy();
    });

    it('should collapse expanded product details when clicked again', () => {
        const { getByTestId, queryByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <CartTable />
            </>
        );

        fireEvent.press(getByTestId(`product-row-${product1.id}`));
        expect(getByTestId(`expanded-content-${product1.id}`)).toBeTruthy();

        fireEvent.press(getByTestId(`product-row-${product1.id}`));
        expect(queryByTestId(`expanded-content-${product1.id}`)).toBeNull();
    });

    it('should increase product quantity when + button is pressed', () => {
        const { getByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <CartTable />
            </>
        );

        fireEvent.press(getByTestId(`product-row-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(1);

        fireEvent.press(getByTestId(`increase-quantity-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(2);
    });

    it('should decrease product quantity when - button is pressed', () => {
        const { getByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} quantities={[3]} />
                <CartTable />
            </>
        );

        fireEvent.press(getByTestId(`product-row-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(3);

        fireEvent.press(getByTestId(`decrease-quantity-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(2);
    });

    it('should not decrease quantity below 1', () => {
        const { getByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <CartTable />
            </>
        );

        fireEvent.press(getByTestId(`product-row-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(1);

        fireEvent.press(getByTestId(`decrease-quantity-${product1.id}`));

        expect(getByTestId(`quantity-${product1.id}`).props.children).toBe(1);
    });

    it('should remove product when remove button is pressed', () => {
        const { getByTestId, queryByTestId } = renderWithProvider(
            <>
                <TestCartAdder products={[product1]} />
                <CartTable />
            </>
        );

        fireEvent.press(getByTestId(`product-row-${product1.id}`));

        fireEvent.press(getByTestId(`remove-product-${product1.id}`));

        expect(queryByTestId(`cart-item-${product1.id}`)).toBeNull();
        expect(getByTestId('empty-cart-message')).toBeTruthy();
    });
});

const TestCartAdder = ({ products, quantities = [] }: { products: Product[], quantities?: number[] }) => {
    const { addToCart } = useCart();

    React.useEffect(() => {
        act(() => {
            products.forEach((product, index) => {
                const quantity = quantities[index] || 1;
                addToCart(product, quantity);
            });
        });
    }, []);

    return null;
}; 
