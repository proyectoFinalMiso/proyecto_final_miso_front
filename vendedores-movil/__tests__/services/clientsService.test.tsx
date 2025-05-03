import axios from 'axios';
import { fetchClients, fetchClientById, mapClientesToProducts, Cliente, ClientesResponse } from '../../services/api/clientsService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('clientsService', () => {
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_CLIENTES;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchClients', () => {
        it('should fetch clients correctly', async () => {
            // Mock response
            const mockClientes: Cliente[] = [
                { id: '1', nombre: 'Cliente 1', correo: 'cliente1@example.com' },
                { id: '2', nombre: 'Cliente 2', correo: 'cliente2@example.com' }
            ];

            const mockResponse = {
                data: {
                    clientes: mockClientes,
                    msg: 'Clientes obtenidos exitosamente'
                }
            };

            mockedAxios.get.mockResolvedValueOnce(mockResponse);

            // Test data
            const vendedorId = 'vendedor123';

            // Call function
            const result = await fetchClients(vendedorId);

            // Check request
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${API_BASE_URL}/clientes?vendedor_id=${vendedorId}`
            );

            // Check result
            expect(result).toEqual(mockClientes);
        });

        it('should throw error when request fails', async () => {
            const error = new Error('Network error');
            mockedAxios.get.mockRejectedValueOnce(error);

            const vendedorId = 'vendedor123';

            await expect(
                fetchClients(vendedorId)
            ).rejects.toThrow('Network error');

            // Verify console.error was called
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            try {
                await fetchClients(vendedorId).catch(() => { });
                expect(consoleSpy).toHaveBeenCalled();
            } finally {
                consoleSpy.mockRestore();
            }
        });
    });

    describe('fetchClientById', () => {
        it('should fetch a client by ID correctly', async () => {
            // Mock response
            const mockClient: Cliente = {
                id: '1',
                nombre: 'Cliente 1',
                correo: 'cliente1@example.com'
            };

            const mockResponse = {
                data: mockClient
            };

            mockedAxios.get.mockResolvedValueOnce(mockResponse);

            // Test data
            const clientId = '1';

            // Call function
            const result = await fetchClientById(clientId);

            // Check request
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${API_BASE_URL}/${clientId}`
            );

            // Check result
            expect(result).toEqual(mockClient);
        });

        it('should throw error when client ID request fails', async () => {
            const error = new Error('Client not found');
            mockedAxios.get.mockRejectedValueOnce(error);

            const clientId = 'non-existent-id';

            await expect(
                fetchClientById(clientId)
            ).rejects.toThrow('Client not found');

            // Verify console.error was called
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            try {
                await fetchClientById(clientId).catch(() => { });
                expect(consoleSpy).toHaveBeenCalled();
            } finally {
                consoleSpy.mockRestore();
            }
        });
    });

    describe('mapClientesToProducts', () => {
        it('should map clients to products format correctly', () => {
            // Test data
            const clientes: Cliente[] = [
                { id: '1', nombre: 'Cliente 1', correo: 'cliente1@example.com' },
                { id: '2', nombre: 'Cliente 2', correo: 'cliente2@example.com' }
            ];

            // Call function
            const result = mapClientesToProducts(clientes);

            // Check result
            expect(result).toEqual([
                { id: '1', name: 'Cliente 1' },
                { id: '2', name: 'Cliente 2' }
            ]);
        });

        it('should return empty array when input is empty', () => {
            const result = mapClientesToProducts([]);
            expect(result).toEqual([]);
        });
    });
});
