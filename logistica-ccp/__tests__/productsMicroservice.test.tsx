import '@testing-library/jest-dom';
import * as microserviceProducts from '@/app/[locale]/products/adapters/microserviceProducts';
import fetchMock from 'jest-fetch-mock';

describe('Interacción con microservicio de productos', () => {
  const productData = {
    nombre: 'Producto Test',
    valorUnitario: 15000,
    id_fabricante: '37f4018e-e636-47fe-9c15-070e7f071c68',
    volumen: '0.05',
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Prueba correcta de API de crear producto', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    await microserviceProducts.createProduct(productData);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/productos/crear_producto'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

describe('Interacción con microservicio de bodegas', () => {
  const storeResponse = {
    body: [
      {
        id: '1',
        nombre: 'Bodega Central',
        direccion: 'Calle 123',
        posicion: 'Pasillo 4',
        latitude: 4.60971,
        longitude: -74.08175,
      },
    ],
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('retorna los datos de la bodega correctamente', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(storeResponse));

    const result = await microserviceProducts.getStore('bodega-central');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/bodega/buscador_bodega'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: 'bodega-central' }),
      })
    );

    expect(result).toEqual(storeResponse);
  });

  it('retorna un arreglo vacío si la respuesta no es exitosa', async () => {
    fetchMock.mockResponseOnce('Error interno del servidor', { status: 500 });

    const result = await microserviceProducts.getStore('bodega-error');

    expect(result).toEqual([]);
  });

  it('retorna un arreglo vacío si ocurre un error inesperado', async () => {
    fetchMock.mockReject(new Error('Fallo de red'));

    const result = await microserviceProducts.getStore('fallo-red');

    expect(result).toEqual([]);
  });
});
