import '@testing-library/jest-dom'
import * as microserviceProducts from '@/app/products/adapters/microserviceProducts'
import fetchMock from 'jest-fetch-mock'

describe('Interacción con microservicio de productos', () => {

    const productData = {
        nombre: 'Producto Test',
        valorUnitario: 15000,
        id_fabricante: '37f4018e-e636-47fe-9c15-070e7f071c68',
        volumen: '0.05'
    }

    beforeEach(() => {
        fetchMock.resetMocks();
    });


    it('Prueba correcta de API de crear producto', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

        await microserviceProducts.createProduct(productData)

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/productos/crear_producto'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        )
    })
})

