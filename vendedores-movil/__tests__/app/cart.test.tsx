import React from 'react';
import { render, act, screen } from '@testing-library/react-native'; 
import CartScreen from '../../app/(tabs)/cart';
import { CartProvider, useCart, CartItem } from '../../contexts/CartContext';
import { Product } from '../../components/ProductTable';
import { Colors } from '../../constants/Colors';

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    const MockSafeAreaView = jest.fn(({ children, ...props }) => {
        const ActualView = RN.View;
        return <ActualView {...props}>{children}</ActualView>;
    });
    Object.defineProperty(RN, 'SafeAreaView', { value: MockSafeAreaView });
    return RN;
});

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('../../components/CartTable', () => {
    const MockView = require('react-native').View;
    return jest.fn(() => <MockView testID="cart-table-mock" />);
});

jest.mock('../../components/OrderSummary', () => {
    const MockView = require('react-native').View;
    return jest.fn(() => <MockView testID="order-summary-mock" />);
});

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

describe('CartScreen - Final', () => {
    const product1: Product = { id: 'prod-abc', name: 'Final Item', price: 100, sku: 10001 };

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


    it('should render CartTable mock and NOT OrderSummary when cart is empty', () => {
        const { getByTestId, queryByTestId } = render(
            <CartProvider>
                <CartScreen />
            </CartProvider>
        ); 

        expect(getByTestId('cart-container')).toBeTruthy();
        expect(getByTestId('cart-content')).toBeTruthy();
        expect(getByTestId('cart-table-mock')).toBeTruthy();
        expect(queryByTestId('order-summary-container')).toBeNull();
        expect(queryByTestId('order-summary-mock')).toBeNull();

        const CartTableMock = require('../../components/CartTable');
        expect(CartTableMock).toHaveBeenCalledTimes(1);
        const OrderSummaryMock = require('../../components/OrderSummary');
        expect(OrderSummaryMock).not.toHaveBeenCalled();
        const RNativeMock = require('react-native');
        expect(RNativeMock.SafeAreaView).toHaveBeenCalledTimes(1);
    });
});
