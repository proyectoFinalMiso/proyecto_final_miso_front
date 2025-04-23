import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import {
  getOrders,
  createDeliveryRoute,
} from '@/app/[locale]/orders/adapters/microserviceOrders';

describe('Interacción con microservicio de pedidos', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Retorna pedidos correctamente cuando la respuesta es exitosa', async () => {
    const mockPedidos = [
      {
        id: 'pedido-001',
        packingList: 'PL-001',
        cliente: 'cliente-001',
        vendedor: 'vendedor-001',
        fechaIngreso: '2024-04-10T12:00:00Z',
        direccion: 'Calle 123',
        latitud: 4.6097,
        longitud: -74.0817,
        estado: 'PENDIENTE',
        valorFactura: 50000,
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({ pedidos: mockPedidos }));

    const pedidos = await getOrders();

    expect(pedidos).toHaveLength(1);
    expect(pedidos[0]).toHaveProperty('id', 'pedido-001');
  });

  it('Retorna un array vacío si el servidor falla', async () => {
    fetchMock.mockRejectOnce(new Error('Fallo de red'));

    const pedidos = await getOrders();

    expect(pedidos).toEqual([]);
  });

  it('Maneja error cuando el backend responde con !ok', async () => {
    fetchMock.mockResponseOnce('Error interno', { status: 500 });

    const pedidos = await getOrders();

    expect(pedidos).toEqual([]);
  });

  it('Crea una ruta de entrega correctamente', async () => {
    const mockRuta = [
      { id: 'destino-1', direccion: 'Carrera 12 #34-56' },
      { id: 'destino-2', direccion: 'Avenida Siempre Viva 742' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({ msg: mockRuta }));

    const result = await createDeliveryRoute('pedido-001');

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('direccion', 'Carrera 12 #34-56');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/gestorPedidos/pedido/ruta_de_entrega'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: 'pedido-001' }),
      })
    );
  });

  it('Retorna array vacío si ocurre un error de red al crear ruta', async () => {
    fetchMock.mockRejectOnce(new Error('Fallo de red'));

    const result = await createDeliveryRoute('pedido-002');

    expect(result).toEqual([]);
  });

  it('Retorna array vacío si el servidor responde con error', async () => {
    fetchMock.mockResponseOnce('Error al procesar', { status: 500 });

    const result = await createDeliveryRoute('pedido-003');

    expect(result).toEqual([]);
  });
});
