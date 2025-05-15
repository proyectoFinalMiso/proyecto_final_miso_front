import axios from 'axios';
import {
    fetchClients,
    fetchClientById,
    mapClientesToProducts,
    Cliente,
    ClientesResponse,
    sendVisit,
    VisitPayload,
    VisitResponse,
    fetchPastVisits,
    VisitsResponse,
    Visit,
    VideoUploadResponse
} from '../../services/api/clientsService';

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

    describe('sendVisit', () => {
        it('should send visit data correctly', async () => {
            const mockVisitResponse: VisitResponse = {
                body: { visitId: 'visit123' },
                msg: 'Visita registrada exitosamente'
            };
            mockedAxios.post.mockResolvedValueOnce({ data: mockVisitResponse });

            const clienteID = 'client1';
            const vendedorId = 'seller1';
            const fecha = '2025-05-06';
            const estado = 'realizada';

            const result = await sendVisit(clienteID, vendedorId, fecha, estado);

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${API_BASE_URL}/${clienteID}/registrar_visita`,
                { vendedor_id: vendedorId, fecha, estado }
            );
            expect(result).toEqual(mockVisitResponse);
        });

        it('should throw error when sending visit fails', async () => {
            const error = new Error('Network error');
            mockedAxios.post.mockRejectedValueOnce(error);

            await expect(
                sendVisit('client1', 'seller1', '2025-05-06', 'realizada')
            ).rejects.toThrow('Network error');
        });
    });

    describe('fetchPastVisits', () => {
        it('should fetch past visits correctly', async () => {
            const mockVisits: Visit[] = [
                { id: 1, cliente_id: 'client1', vendedor_id: 'seller1', estado: 'completada', fecha: '2025-05-01' },
                { id: 2, cliente_id: 'client1', vendedor_id: 'seller1', estado: 'completada', fecha: '2025-04-20' }
            ];
            const mockResponse: VisitsResponse = {
                visitas: mockVisits,
                msg: 'Visitas obtenidas'
            };
            mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

            const clientId = 'client1';
            const result = await fetchPastVisits(clientId);

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${API_BASE_URL}/visitas?cliente_id=${clientId}&estado=completada`
            );
            expect(result).toEqual(mockVisits);
        });

        it('should throw error when fetching past visits fails', async () => {
            const error = new Error('Network error');
            mockedAxios.get.mockRejectedValueOnce(error);

            await expect(fetchPastVisits('client1')).rejects.toThrow('Network error');
        });
    });
});
