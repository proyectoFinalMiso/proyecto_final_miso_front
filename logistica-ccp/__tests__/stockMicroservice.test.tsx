import '@testing-library/jest-dom'
import * as microserviceStock from '@/app/[locale]/stock/adapters/microserviceStock'
import fetchMock from 'jest-fetch-mock'

describe('Interacción con microservicio de inventarios', () => {

    const productData = {
        nombre: 'Producto A',
        bodega: 'Calle 123',
        lote: 'loteA',
        cantidad: '10',
        sku: 'skuA',
        valorUnitario: '1000',
        volumen: '0.002',
    }

    beforeEach(() => {
        fetchMock.resetMocks();
    });


    it('Prueba correcta de API de crear vendedor', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

        await microserviceStock.insertStock(productData)

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/bodega/stock_crear_producto'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        )
    })
})

