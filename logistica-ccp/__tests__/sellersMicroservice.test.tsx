import '@testing-library/jest-dom'
import * as microserviceSeller from '@/app/[locale]/sellers/adapters/microserviceSeller'
import fetchMock from 'jest-fetch-mock'

describe('Interacción con microservicio de productos', () => {

    const sellerData = {
        nombre: 'Vendedor Test',
        email: 'vendedor@ccp.com'
    }

    beforeEach(() => {
        fetchMock.resetMocks();
    });


    it('Prueba correcta de API de crear vendedor', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

        await microserviceSeller.createSeller(sellerData)

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/vendedor/crear_vendedor'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }),
        )
    })
})

