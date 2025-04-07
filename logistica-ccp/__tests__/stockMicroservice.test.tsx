import '@testing-library/jest-dom'
import * as microserviceStock from '@/app/stock/adapters/microserviceStock'
import fetchMock from 'jest-fetch-mock'

describe('Interacción con microservicio de inventarios', () => {

    const sellerData = {
        id_producto: '10024',
        cantidad: 10
    }

    beforeEach(() => {
        fetchMock.resetMocks();
    });


    it('Prueba correcta de API de crear vendedor', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

        await microserviceStock.updateStock(sellerData)

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/bodega/stock_ingresar_inventario'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        )
    })
})

