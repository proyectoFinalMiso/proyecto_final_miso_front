import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)';
import { Product } from '../../components/ProductTable';
import { Colors } from '../../constants/Colors';

// Mock services
jest.mock('../../services/api/inventoryService', () => ({
    fetchAvailableInventory: jest.fn(),
    mapInventoryToProducts: jest.fn()
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

jest.mock('../../components/ProductTable', () => {
    const MockView = require('react-native').View;
    return jest.fn(props => {
        const onProductPress = (product: Product) => props.onProductPress && props.onProductPress(product);
        return (
            <MockView testID="product-table-mock">
                {props.refreshControl}
                <MockView
                    testID="product-press-button"
                    onPress={() => onProductPress({ id: 'test-id', name: 'Test Product', price: 100, sku: 10007 })}
                />
            </MockView>
        );
    });
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

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string, options?: any) => {
            const translations: Record<string, string | ((opts?: any) => string)> = {
                'home.title': 'Ordena lo que gustes',
                'home.loading': 'Cargando productos...',
                'home.lastUpdated': (opts?: any) => `Última actualización: ${opts?.time || ''}`,
                'home.loadError': 'No se pudieron cargar los productos. Por favor intente de nuevo.',
                'home.searchProducts': 'Busca productos...',
                'home.filterProducts': 'Filtrar productos',
                'home.filterHint': 'Abre el modal de filtrado',
                'home.filters': 'Filtros:',
                'home.clearFilters': 'Limpiar filtros',
                'home.priceRangeError': 'El precio mínimo no puede ser mayor que el precio máximo.',
                'products.minPrice': 'Precio mín',
                'products.maxPrice': 'Precio máx',
                'common.search': 'Buscar',
                'home.searchHint': 'Ingresa el nombre del producto que buscas',
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

const mockBaseFontSizes = {
    xxxs: 8, xxs: 11, xs: 12, xsPlus: 13, sm: 14, smd: 15, md: 16,
    lg: 18, xl: 20, xxl: 24, xxxl: 32, title: 42,
};
const mockFontSizeMultipliers: Record<'small' | 'medium' | 'large', number> = { small: 0.9, medium: 1.0, large: 1.1 };
  
const calculateMockFontSizes = (fontSizeMode: 'small' | 'medium' | 'large') => {
    const multiplier = mockFontSizeMultipliers[fontSizeMode];
    const calculated: any = {}; 
    for (const key in mockBaseFontSizes) {
    calculated[key] = mockBaseFontSizes[key as keyof typeof mockBaseFontSizes] * multiplier;
    }
    return calculated;
};

const mockDefaultFontSizeMode = 'medium' as 'small' | 'medium' | 'large';
const mockDefaultFontSizes = calculateMockFontSizes(mockDefaultFontSizeMode);

jest.mock('../../contexts/ThemeContext', () => {
    const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
    return {
        useTheme: jest.fn().mockReturnValue({
            theme: 'light',
            colors: ActualAppColors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),

            fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
        }),
    };
});

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

describe('HomeScreen', () => {
    const mockProducts: Product[] = [
        { id: '1', name: 'Test Product', price: 100, sku: 10007 }
    ];
    const mockInventoryService = require('../../services/api/inventoryService');

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks for API functions
        mockInventoryService.fetchAvailableInventory.mockResolvedValue([{ id: 1, nombre: 'Test Product', precio: 100, cantidadDisponible: 10 }]);
        mockInventoryService.mapInventoryToProducts.mockReturnValue(mockProducts);

        const mockUseTheme = require('../../contexts/ThemeContext').useTheme;
                mockUseTheme.mockReturnValue({
                    theme: 'light',
                    colors: Colors.light,
                    isDark: false,
                    toggleTheme: jest.fn(),
                    setTheme: jest.fn(),

                    fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
                });
    });

    it('should show loading indicator while fetching data', async () => {
        mockInventoryService.fetchAvailableInventory.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

        const { getByTestId } = render(<HomeScreen />);
        expect(getByTestId('loading-indicator-mock')).toBeTruthy();
    });

    it('should show error display when fetching fails', async () => {
        mockInventoryService.fetchAvailableInventory.mockRejectedValue(new Error('API Error'));

        const { getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });
    });

    it('should retry fetching data when retry button is pressed', async () => {
        mockInventoryService.fetchAvailableInventory.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByTestId('error-display-mock')).toBeTruthy();
        });

        mockInventoryService.fetchAvailableInventory.mockResolvedValueOnce([{ id: 1, nombre: 'Test Product', precio: 100, cantidadDisponible: 10 }]);

        act(() => {
            fireEvent.press(getByTestId('retry-button'));
        });

        await waitFor(() => {
            expect(mockInventoryService.fetchAvailableInventory).toHaveBeenCalledTimes(2);
        });
    });

    it('should render search input and product table when data is loaded', async () => {
        const { getByPlaceholderText, getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByTestId('product-table-mock')).toBeTruthy();
            expect(getByPlaceholderText('Busca productos...')).toBeTruthy();
        });

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalled();
    });

    it('should open filter modal when filter button is pressed', async () => {
        const { getByLabelText, getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            const filterButton = getByLabelText('Filtrar productos');
            expect(filterButton).toBeTruthy();

            act(() => {
                fireEvent.press(filterButton);
            });
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        expect(FilterModalMock).toHaveBeenCalled();
        expect(getByTestId('filter-modal-mock')).toBeTruthy();
    });

    it('should filter products when search text changes', async () => {
        const { getByPlaceholderText } = render(<HomeScreen />);

        await waitFor(() => {
            const searchInput = getByPlaceholderText('Busca productos...');

            act(() => {
                fireEvent.changeText(searchInput, 'Test');
            });
        });

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalled();

        const mockCalls = ProductTableMock.mock.calls;
        const lastCall = mockCalls[mockCalls.length - 1][0];
        expect(lastCall).toHaveProperty('products');
        expect(lastCall).toHaveProperty('onProductPress');
        expect(lastCall).toHaveProperty('refreshControl');
    });

    it('should render title correctly', async () => {
        const { getByText } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText('Ordena lo que gustes')).toBeTruthy();
        });
    });

    it('should pass onProductPress to ProductTable', async () => {
        const { getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByTestId('product-table-mock')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByTestId('product-press-button'));
        });

        expect(console.log).toHaveBeenCalledWith('Producto seleccionado:', expect.objectContaining({
            id: 'test-id',
            name: 'Test Product',
            price: 100
        }));
    });

    it('should close filter modal when applied', async () => {
        const { getByLabelText, getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            const filterButton = getByLabelText('Filtrar productos');
            act(() => {
                fireEvent.press(filterButton);
            });
        });

        expect(getByTestId('filter-modal-mock')).toBeTruthy();

        act(() => {
            fireEvent.press(getByTestId('apply-button'));
        });

        const FilterModalMock = require('../../components/FilterProductsModal');
        const lastCall = FilterModalMock.mock.calls[FilterModalMock.mock.calls.length - 1][0];
        expect(typeof lastCall.onApply).toBe('function');
    });

    it('should show last updated time when data is loaded', async () => {
        const { getByText } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText(/Última actualización:/)).toBeTruthy();
        });
    });

    it('should refresh data when onRefresh is called', async () => {
        const { getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            const productTable = getByTestId('product-table-mock');
            expect(productTable).toBeTruthy();
        });

        const ProductTableMock = require('../../components/ProductTable');
        const refreshControl = ProductTableMock.mock.calls[0][0].refreshControl;
        expect(refreshControl).toBeTruthy();

        // Simulate the refresh call
        act(() => {
            refreshControl.props.onRefresh();
        });

        await waitFor(() => {
            expect(mockInventoryService.fetchAvailableInventory).toHaveBeenCalledTimes(2);
        });
    });
});
