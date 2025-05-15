import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ProductTable, { Product } from '../../components/ProductTable';
import { CartProvider } from '../../contexts/CartContext';
import { Colors } from '../../constants/Colors';

// Mock the CartContext
jest.mock('../../contexts/CartContext', () => {
    const mockAddToCart = jest.fn();

    return {
        CartProvider: ({ children }: { children: React.ReactNode }) => children,
        useCart: () => ({
            addToCart: mockAddToCart,
            items: [],
            removeFromCart: jest.fn(),
            updateQuantity: jest.fn(),
            getTotal: jest.fn()
        }),
        // Export the mock function for testing
        mockAddToCart
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string, options?: any) => {
            const translations: Record<string, string | ((opts?: any) => string)> = {
                'productTable.title': 'Productos',
                'productTable.empty': 'No hay productos disponibles',
                'productTable.listLabel': 'Lista de productos disponibles',
                'productTable.unitValue': 'Valor Unitario',
                'productTable.quantity': 'Cantidad',
                'productTable.action': 'Acción',
                'productTable.addToCartButton': 'Agregar al carrito',
                'productTable.addToCart': (opts?: any) => `Agregar ${opts?.quantity} de ${opts?.name} al carrito`,
                'productTable.decreaseQuantity': (opts?: any) => `Disminuir cantidad para ${opts?.name}`,
                'productTable.increaseQuantity': (opts?: any) => `Aumentar cantidad para ${opts?.name}`,
                'productTable.currentQuantity': (opts?: any) => `Cantidad actual ${opts?.quantity}`,
                'productTable.expandDetails': 'Expandir detalles',
                'productTable.collapseDetails': 'Contraer detalles',
            };
            const value = translations[key];
            if (typeof value === 'function') {
                return value(options);
            }
            return value || key;
        },
        i18n: { language: 'es', changeLanguage: jest.fn() }
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

// Import the mockAddToCart from the mocked module
const { mockAddToCart } = require('../../contexts/CartContext');

global.console.log = jest.fn();

// Helper function to render ProductTable with CartProvider
const renderWithCartProvider = (ui: React.ReactElement) => {
    return render(<CartProvider>{ui}</CartProvider>);
};

describe('ProductTable Component', () => {
    const mockProducts: Product[] = [
        { id: '1', name: 'Producto 1', price: 10000, sku: 10001 },
        { id: '2', name: 'Producto 2', price: 20000, sku: 10002 },
    ];

    const mockOnProductPress = jest.fn();

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

    it('renders correctly with products', () => {
        const { getByText } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        expect(getByText('Productos')).toBeTruthy();
        expect(getByText('Producto 1')).toBeTruthy();
        expect(getByText('Producto 2')).toBeTruthy();
    });

    it('displays empty state message when no products', () => {
        const { getByText } = renderWithCartProvider(
            <ProductTable products={[]} onProductPress={mockOnProductPress} />
        );

        expect(getByText('No hay productos disponibles')).toBeTruthy();
    });

    it('expands a product when clicked', () => {
        const { getByText, queryByText } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        expect(queryByText('Valor Unitario')).toBeNull();

        fireEvent.press(getByText('Producto 1'));

        expect(getByText('Valor Unitario')).toBeTruthy();
        expect(getByText('$10000 COP')).toBeTruthy();
        expect(getByText('Cantidad')).toBeTruthy();
        expect(getByText('Agregar al carrito')).toBeTruthy();
    });

    it('increases and decreases quantity correctly', () => {
        const { getByText, getByTestId } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));

        expect(getByText('1')).toBeTruthy();

        fireEvent.press(getByTestId('increase-quantity-button-1'));
        fireEvent.press(getByTestId('increase-quantity-button-1'));

        expect(getByText('3')).toBeTruthy();

        fireEvent.press(getByTestId('decrease-quantity-button-1'));

        expect(getByText('2')).toBeTruthy();
    });

    it('does not decrease quantity below 1', () => {
        const { getByText, getByTestId } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));

        expect(getByText('1')).toBeTruthy();

        fireEvent.press(getByTestId('decrease-quantity-button-1'));

        expect(getByText('1')).toBeTruthy();
    });

    it('calls handleAddToCart when "Agregar al carrito" button is pressed', () => {
        const { getByText, getByTestId } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));
        fireEvent.press(getByTestId('add-to-cart-button-1'));

        expect(mockAddToCart).toHaveBeenCalledWith(
            expect.objectContaining({ id: '1', name: 'Producto 1', price: 10000 }),
            1
        );
    });

    it('calls handleAddToCart with the correct quantity after increasing', () => {
        const { getByText, getByTestId } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));

        fireEvent.press(getByTestId('increase-quantity-button-1'));
        fireEvent.press(getByTestId('increase-quantity-button-1'));

        fireEvent.press(getByTestId('add-to-cart-button-1'));

        expect(mockAddToCart).toHaveBeenCalledWith(
            expect.objectContaining({ id: '1', name: 'Producto 1', price: 10000 }),
            3
        );
    });

    it('collapses an expanded product when clicked again', () => {
        const { getByText, queryByText } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));

        expect(queryByText('Valor Unitario')).toBeTruthy();

        fireEvent.press(getByText('Producto 1'));

        expect(queryByText('Valor Unitario')).toBeNull();
    });

    it('maintains separate quantities for different products', () => {
        const { getByText, getByTestId } = renderWithCartProvider(
            <ProductTable products={mockProducts} onProductPress={mockOnProductPress} />
        );

        fireEvent.press(getByText('Producto 1'));
        fireEvent.press(getByTestId('increase-quantity-button-1'));
        fireEvent.press(getByTestId('increase-quantity-button-1'));

        fireEvent.press(getByText('Producto 1'));

        fireEvent.press(getByText('Producto 2'));

        expect(getByText('1')).toBeTruthy();

        fireEvent.press(getByText('Producto 2'));
        fireEvent.press(getByText('Producto 1'));

        expect(getByText('3')).toBeTruthy();
    });
}); 
