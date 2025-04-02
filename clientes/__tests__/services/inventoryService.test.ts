import axios from 'axios';
import {
    fetchInventory,
    fetchAvailableInventory,
    mapInventoryToProducts,
    InventoryItem
} from '../../services/api/inventoryService';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Inventory Service', () => {
    const mockInventoryData = [
        {
            id: '1',
            nombre: 'Product 1',
            valorUnitario: 100,
            cantidadDisponible: 10,
            cantidadReservada: 2,
            fechaIgreso: '2023-01-01',
            bodega: 'A1',
            lote: 'L001',
            posicion: 'P1',
            sku: 101
        },
        {
            id: '2',
            nombre: 'Product 2',
            valorUnitario: 200,
            cantidadDisponible: 0, 
            cantidadReservada: 5,
            fechaIgreso: '2023-01-02',
            bodega: 'A2',
            lote: 'L002',
            posicion: 'P2',
            sku: 102
        },
        {
            id: '3',
            nombre: 'Product 3',
            valorUnitario: 300,
            cantidadDisponible: 15,
            cantidadReservada: 0,
            fechaIgreso: '2023-01-03',
            bodega: 'A3',
            lote: 'L003',
            posicion: 'P3',
            sku: 103
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchInventory', () => {
        it('should fetch all inventory items successfully', async () => {
            // Arrange
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    body: mockInventoryData,
                    msg: 'Success'
                }
            });

            // Act
            const result = await fetchInventory();

            // Assert
            expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/inventario/listar_inventarios'));
            expect(result).toEqual(mockInventoryData);
            expect(result.length).toBe(3);
        });

        it('should handle errors correctly', async () => {
            // Arrange
            const errorMessage = 'Network Error';
            mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(fetchInventory()).rejects.toThrow(errorMessage);
            expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/inventario/listar_inventarios'));
        });
    });

    describe('fetchAvailableInventory', () => {
        it('should fetch only items with available stock', async () => {
            // Arrange
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    body: mockInventoryData,
                    msg: 'Success'
                }
            });

            // Act
            const result = await fetchAvailableInventory();

            // Assert
            expect(result.length).toBe(2); // Only items with cantidadDisponible > 0
            expect(result.some(item => item.id === '2')).toBe(false); // Item with id 2 has no stock
            expect(result.every(item => item.cantidadDisponible > 0)).toBe(true);
        });

        it('should propagate errors from fetchInventory', async () => {
            // Arrange
            const errorMessage = 'API Error';
            mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(fetchAvailableInventory()).rejects.toThrow(errorMessage);
        });
    });

    describe('mapInventoryToProducts', () => {
        it('should map inventory items to product format', () => {
            // Act
            const mappedProducts = mapInventoryToProducts(mockInventoryData);

            // Assert
            expect(mappedProducts.length).toBe(3);

            // Check mapping for first item
            expect(mappedProducts[0]).toEqual({
                id: '1',
                name: 'Product 1',
                price: 100,
                sku: 101
            });

            // Check all items are mapped correctly
            mappedProducts.forEach((product, i) => {
                const originalItem = mockInventoryData[i];
                expect(product.id).toBe(originalItem.id);
                expect(product.name).toBe(originalItem.nombre);
                expect(product.price).toBe(originalItem.valorUnitario);
            });
        });

        it('should handle empty array', () => {
            // Act
            const mappedProducts = mapInventoryToProducts([]);

            // Assert
            expect(mappedProducts).toEqual([]);
            expect(mappedProducts.length).toBe(0);
        });
    });
}); 
