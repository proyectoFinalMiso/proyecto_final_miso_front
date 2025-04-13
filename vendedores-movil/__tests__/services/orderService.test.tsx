import axios from 'axios';
import { sendOrder, OrderPayload } from '../../services/api/orderService';
import { CartItem } from '../../contexts/CartContext';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('orderService', () => {
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_PEDIDOS;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    describe('sendOrder', () => {
        it('should format and send order data correctly', async () => {
            // Mock response
            const mockResponse = {
                data: {
                    body: { orderId: '123456' },
                    msg: 'Orden creada exitosamente'
                }
            };
            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            // Test data
            const items: CartItem[] = [
                {
                    product: { id: '1', name: 'Producto 1', price: 10000, sku: 10001 },
                    quantity: 2
                },
                {
                    product: { id: '2', name: 'Producto 2', price: 15000, sku: 10002 },
                    quantity: 1
                }
            ];
            const clienteId = 'cliente123';
            const vendedorId = 'vendedor456';
            const destino = 'Calle 123 #45-67';

            // Call function
            const result = await sendOrder(items, clienteId, vendedorId, destino);

            // Check payload
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${API_BASE_URL}/pedido/crear`,
                expect.objectContaining({
                    cliente: clienteId,
                    vendedor: vendedorId,
                    direccion: destino,
                    productos: [
                        { sku: '10001', cantidad: 2 },
                        { sku: '10002', cantidad: 1 }
                    ],
                    latitud: expect.any(Number),
                    longitud: expect.any(Number)
                })
            );

            // Check result
            expect(result).toEqual(mockResponse.data);
        });

        it('should generate random latitude and longitude values', async () => {
            // Mock response
            mockedAxios.post.mockResolvedValueOnce({
                data: { body: {}, msg: 'success' }
            });

            // Call function with minimal data
            await sendOrder([], 'cliente1', 'vendedor1', 'direccion1');

            // Get the payload sent to axios
            const payload = mockedAxios.post.mock.calls[0][1] as OrderPayload;

            // With Math.random mocked to return 0.5:
            // latitud should be 1.6 + (0.5 * (11.0 - 1.6)) = 6.3
            // longitud should be -75.5 + (0.5 * (-73.0 - (-75.5))) = -74.25
            expect(payload.latitud).toBeCloseTo(6.3, 5);
            expect(payload.longitud).toBeCloseTo(-74.25, 5);
        });

        it('should throw error when request fails', async () => {
            const error = new Error('Network error');
            mockedAxios.post.mockRejectedValueOnce(error);

            await expect(
                sendOrder([], 'cliente1', 'vendedor1', 'direccion1')
            ).rejects.toThrow('Network error');

        });
    });
});
