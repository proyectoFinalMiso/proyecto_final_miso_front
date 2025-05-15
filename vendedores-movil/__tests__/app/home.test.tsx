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
                    onPress={() => onProductPress({ id: 'test-id', name: 'Test Product', price: 100, sku: 10007})}
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
            <MockView testID="filter-modal-mock" visible={props.visible}>
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
                'home.lastUpdated': (opts?: any) => `Última actualización: ${opts?.time || new Date().toLocaleTimeString()}`,
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

        mockInventoryService.fetchAvailableInventory.mockResolvedValue([{ id: "1", nombre: 'Test Product', precio: 100, cantidadDisponible: 10, sku: "10007" }]);
        mockInventoryService.mapInventoryToProducts.mockReturnValue(mockProducts);

        const mockUseTheme = require('../../contexts/ThemeContext').useTheme;
        mockUseTheme.mockReturnValue({
            theme: 'light',
            colors: Colors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),
        });
    });

    it('should show loading indicator while fetching data', async () => {
        mockInventoryService.fetchAvailableInventory.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

        render(<HomeScreen />);
        expect(screen.getByTestId('loading-indicator-mock')).toBeTruthy();
    });

    it('should show error display when fetching fails', async () => {
        mockInventoryService.fetchAvailableInventory.mockRejectedValue(new Error('API Error'));

        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByTestId('error-display-mock')).toBeTruthy();
        });
    });

    it('should retry fetching data when retry button is pressed', async () => {
        mockInventoryService.fetchAvailableInventory.mockRejectedValueOnce(new Error('API Error'));

        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByTestId('error-display-mock')).toBeTruthy();
        });

        mockInventoryService.fetchAvailableInventory.mockResolvedValueOnce([{ id: "1", nombre: 'Test Product', precio: 100, cantidadDisponible: 10, sku: "10007" }]);
        mockInventoryService.mapInventoryToProducts.mockReturnValueOnce(mockProducts);


        act(() => {
            fireEvent.press(screen.getByTestId('retry-button'));
        });

        await waitFor(() => {
            expect(mockInventoryService.fetchAvailableInventory).toHaveBeenCalledTimes(2);
            expect(screen.getByTestId('product-table-mock')).toBeTruthy();
        });
    });

    it('should render search input and product table when data is loaded', async () => {
        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByTestId('product-table-mock')).toBeTruthy();
            expect(screen.getByPlaceholderText('Busca productos...')).toBeTruthy();
        });

        const ProductTableMock = require('../../components/ProductTable');
        expect(ProductTableMock).toHaveBeenCalled();
    });

    it('should open filter modal when filter button is pressed', async () => {
        render(<HomeScreen />);
        const FilterModalMock = require('../../components/FilterProductsModal');


        await waitFor(() => {
            const filterButton = screen.getByLabelText('Filtrar productos');
            expect(filterButton).toBeTruthy();
             act(() => {
                fireEvent.press(filterButton);
            });
        });


        await waitFor(() => {
          expect(FilterModalMock).toHaveBeenCalledWith(expect.objectContaining({ visible: true }), {});
        });
    });

    it('should filter products when search text changes', async () => {
        render(<HomeScreen />);
        const ProductTableMock = require('../../components/ProductTable');

        await waitFor(() => {
            expect(screen.getByTestId('product-table-mock')).toBeTruthy();
        });
        
        const searchInput = screen.getByPlaceholderText('Busca productos...');
        act(() => {
            fireEvent.changeText(searchInput, 'Test');
        });
        

        await waitFor(() => {
            const mockCalls = ProductTableMock.mock.calls;
            expect(mockCalls.length).toBeGreaterThanOrEqual(1);
            const lastCallArgs = mockCalls[mockCalls.length - 1][0];
            expect(lastCallArgs).toHaveProperty('products');
        });
    });

    it('should render title correctly', async () => {
        render(<HomeScreen />);
        await waitFor(() => {
            expect(screen.getByText('Ordena lo que gustes')).toBeTruthy();
        });
    });

    it('should pass onProductPress to ProductTable and log selection', async () => {
        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByTestId('product-table-mock')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(screen.getByTestId('product-press-button'));
        });

        expect(console.log).toHaveBeenCalledWith('Producto seleccionado:', expect.objectContaining({
            id: 'test-id',
            name: 'Test Product',
            price: 100
        }));
    });

    it('should close filter modal when applied', async () => {
        render(<HomeScreen />);
        const FilterModalMock = require('../../components/FilterProductsModal');

        await waitFor(() => screen.getByLabelText('Filtrar productos'));
        
        act(() => {
          fireEvent.press(screen.getByLabelText('Filtrar productos'));
        });

        await waitFor(() => {
           expect(FilterModalMock).toHaveBeenCalledWith(expect.objectContaining({ visible: true }), {});
        });
        
        act(() => {
            fireEvent.press(screen.getByTestId('apply-button'));
        });

        await waitFor(() => {
            const lastCallArgs = FilterModalMock.mock.calls[FilterModalMock.mock.calls.length - 1][0];
            expect(lastCallArgs.visible).toBe(false);
        });
    });

    it('should show last updated time when data is loaded', async () => {
        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByText(/Última actualización:/)).toBeTruthy();
        });
    });

    it('should refresh data when onRefresh is called from ProductTable', async () => {
        render(<HomeScreen />);
        const ProductTableMock = require('../../components/ProductTable');

        await waitFor(() => {
            expect(screen.getByTestId('product-table-mock')).toBeTruthy();
        });

        expect(ProductTableMock).toHaveBeenCalled();
        const productTableProps = ProductTableMock.mock.calls[ProductTableMock.mock.calls.length -1][0];
        expect(productTableProps.refreshControl).toBeTruthy();
        expect(typeof productTableProps.refreshControl.props.onRefresh).toBe('function');

        act(() => {
            productTableProps.refreshControl.props.onRefresh();
        });

        await waitFor(() => {
            expect(mockInventoryService.fetchAvailableInventory).toHaveBeenCalledTimes(2);
        });
    });
});
