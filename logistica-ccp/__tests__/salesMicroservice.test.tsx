import '@testing-library/jest-dom'
import * as microserviceSales from '@/app/[locale]/sales/adapters/microserviceSales'
import fetchMock from 'jest-fetch-mock'

describe('Interacción con microservicio de ventas', () => {

    const salesPlanData = [{
        id: '1',
        estado: 'Activo',
        fecha_inicio: 'Sun, 04 May 2025 15:50:41 GMT',
        fecha_final: null,
        meta_ventas: 1000,
        productos_plan: 10,
    }]

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('Prueba correcta de API listar planes de ventas', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

        await microserviceSales.getSalesPlan()

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/vendedor/listar_planes'),
            expect.objectContaining({
                method: 'GET'
            }),
        )
    })
})