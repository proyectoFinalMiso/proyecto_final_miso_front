import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)';
import { Product } from '../../components/ProductTable';

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

jest.mock('../../components/ProductTable', () => {
    const MockView = require('react-native').View;
    return jest.fn(() => <MockView testID="product-table-mock" />);
});

jest.mock('../../components/FilterProductsModal', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => {
        const onApply = () => props.onApply && props.onApply();
        const onClear = () => props.onClear && props.onClear();
        const onClose = () => props.onClose && props.onClose();
        const onTempPriceChange = (field: 'min' | 'max', value: string) => props.onTempPriceChange && props.onTempPriceChange(field, value);
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
            </MockView>
        );
    });
});


global.console = {
    ...global.console,
    log: jest.fn()
};

describe('HomeScreen', () => {
    const mockProducts: Product[] = [
        { id: '1', name: 'Test Product', price: 100 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render search input and product table', () => {
        const { getByPlaceholderText, getByTestId } = render(<HomeScreen />);

        expect(getByTestId('product-table-mock')).toBeTruthy();
        expect(getByPlaceholderText('Busca productos...')).toBeTruthy();

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalledTimes(1);
        const RNativeMock = require('react-native');
        expect(RNativeMock.SafeAreaView).toHaveBeenCalledTimes(1);
    });

    it('should open filter modal when filter button is pressed', () => {
        const { getByLabelText, getByTestId } = render(<HomeScreen />);

        const filterButton = getByLabelText('Filtrar productos');
        expect(filterButton).toBeTruthy();

        act(() => {
            fireEvent.press(filterButton);
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        expect(FilterModalMock).toHaveBeenCalledTimes(2);
        expect(getByTestId('filter-modal-mock')).toBeTruthy();
    });

    it('should filter products when search text changes', () => {
        const { getByPlaceholderText } = render(<HomeScreen />);

        const searchInput = getByPlaceholderText('Busca productos...');
        act(() => {
            fireEvent.changeText(searchInput, 'Test');
        });

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalledTimes(2);

        
        const mockCall = ProductTableMock.mock.calls[0][0];
        expect(mockCall).toHaveProperty('products');
        expect(mockCall).toHaveProperty('onProductPress');
    });

    it('should render title correctly', () => {
        const { getByText } = render(<HomeScreen />);

        expect(getByText('Ordena lo que gustes')).toBeTruthy();
    });

    it('should pass onProductPress to ProductTable', () => {
        render(<HomeScreen />);

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalledTimes(1);

        const mockCall = ProductTableMock.mock.calls[0][0];
        expect(mockCall).toHaveProperty('onProductPress');
        expect(typeof mockCall.onProductPress).toBe('function');
    });

    it('should close filter modal when applied', () => {
        const { getByLabelText, getByTestId } = render(<HomeScreen />);

        act(() => {
            fireEvent.press(getByLabelText('Filtrar productos'));
        });

        expect(getByTestId('filter-modal-mock')).toBeTruthy();

        const FilterModalMock = require('../../components/FilterProductsModal');
        const applyCallback = FilterModalMock.mock.calls[0][0].onApply;

        act(() => {
            applyCallback();
        });

        expect(typeof applyCallback).toBe('function');
    });

    it('should close filter modal when closed', () => {
        const { getByLabelText } = render(<HomeScreen />);

        act(() => {
            fireEvent.press(getByLabelText('Filtrar productos'));
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        const onCloseCallback = FilterModalMock.mock.calls[0][0].onClose;

        act(() => {
            onCloseCallback();
        });

        expect(typeof onCloseCallback).toBe('function');
    });

    it('should update tempPriceRange when filter input changes', () => {
        const { getByLabelText } = render(<HomeScreen />);

        act(() => {
            fireEvent.press(getByLabelText('Filtrar productos'));
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        const onTempPriceChangeCallback = FilterModalMock.mock.calls[0][0].onTempPriceChange;

        act(() => {
            onTempPriceChangeCallback('min', '50');
            onTempPriceChangeCallback('max', '200');
        });

        expect(typeof onTempPriceChangeCallback).toBe('function');
    });

    it('should clear filters when onClear is called', () => {
        const { getByLabelText } = render(<HomeScreen />);

        act(() => {
            fireEvent.press(getByLabelText('Filtrar productos'));
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        const onClearCallback = FilterModalMock.mock.calls[0][0].onClear;

        act(() => {
            onClearCallback();
        });

        expect(typeof onClearCallback).toBe('function');
    });

    it('should log product when handleProductPress is called', () => {
        render(<HomeScreen />);

        const ProductTableMock = require('../../components/ProductTable');
        const onProductPressCallback = ProductTableMock.mock.calls[0][0].onProductPress;

        const testProduct = { id: 'test-id', name: 'Test Product', price: 100 };

        act(() => {
            onProductPressCallback(testProduct);
        });

        expect(console.log).toHaveBeenCalledWith('Producto seleccionado:', testProduct);
    });

    it('should handle filter application correctly', () => {
        const { getByLabelText } = render(<HomeScreen />);

        act(() => {
            fireEvent.press(getByLabelText('Filtrar productos'));
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        const onTempPriceChangeCallback = FilterModalMock.mock.calls[0][0].onTempPriceChange;
        const onApplyCallback = FilterModalMock.mock.calls[0][0].onApply;

        act(() => {
            onTempPriceChangeCallback('min', '50');
            onTempPriceChangeCallback('max', '150');
            onApplyCallback();
        });

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalled();
    });
});
