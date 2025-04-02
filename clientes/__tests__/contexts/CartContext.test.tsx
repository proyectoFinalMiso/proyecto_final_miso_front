import React from 'react';
import { render, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';

const TestComponent = ({ onRender }: { onRender: (cart: ReturnType<typeof useCart>) => void }) => {
    const cart = useCart();
    onRender(cart);
    return null;
};

const renderCartHook = () => {
    let lastRenderedCart: ReturnType<typeof useCart> | null = null;

    const onRender = (cart: ReturnType<typeof useCart>) => {
        lastRenderedCart = cart;
    };

    const utils = render(
        <CartProvider>
            <TestComponent onRender={onRender} />
        </CartProvider>
    );

    return {
        ...utils,
        result: () => lastRenderedCart!
    };
};

describe('CartContext', () => {
    const product1: Product = { id: '1', name: 'Producto 1', price: 10000 };
    const product2: Product = { id: '2', name: 'Producto 2', price: 20000 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with an empty cart', () => {
        const { result } = renderCartHook();

        expect(result().items).toEqual([]);
        expect(result().getTotal()).toBe(0);
    });

    it('should add a product to the cart', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
        });

        expect(result().items).toHaveLength(1);
        expect(result().items[0].product).toEqual(product1);
        expect(result().items[0].quantity).toBe(1);
    });

    it('should increase quantity when adding an existing product', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
            result().addToCart(product1, 2);
        });

        expect(result().items).toHaveLength(1);
        expect(result().items[0].quantity).toBe(3);
    });

    it('should add different products separately', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
            result().addToCart(product2, 1);
        });

        expect(result().items).toHaveLength(2);
        expect(result().items[0].product).toEqual(product1);
        expect(result().items[1].product).toEqual(product2);
    });

    it('should remove a product from the cart', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
            result().addToCart(product2, 1);
            result().removeFromCart(product1.id);
        });

        expect(result().items).toHaveLength(1);
        expect(result().items[0].product).toEqual(product2);
    });

    it('should update the quantity of a product', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
            result().updateQuantity(product1.id, 5);
        });

        expect(result().items[0].quantity).toBe(5);
    });

    it('should remove a product when quantity is set to 0', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 1);
            result().updateQuantity(product1.id, 0);
        });

        expect(result().items).toHaveLength(0);
    });

    it('should calculate the total price correctly', () => {
        const { result } = renderCartHook();

        act(() => {
            result().addToCart(product1, 2); // 2 * 10000 = 20000
            result().addToCart(product2, 1); // 1 * 20000 = 20000
        });

        expect(result().getTotal()).toBe(40000);
    });

    it('should return 0 total when cart is empty', () => {
        const { result } = renderCartHook();

        expect(result().getTotal()).toBe(0);
    });

    it('should handle multiple operations correctly', () => {
        const { result } = renderCartHook();

        act(() => {
            // Add products
            result().addToCart(product1, 3);
            result().addToCart(product2, 2);

            // Update quantities
            result().updateQuantity(product1.id, 1);

            // Remove a product
            result().removeFromCart(product2.id);
        });

        expect(result().items).toHaveLength(1);
        expect(result().items[0].product).toEqual(product1);
        expect(result().items[0].quantity).toBe(1);
        expect(result().getTotal()).toBe(10000);
    });
}); 
