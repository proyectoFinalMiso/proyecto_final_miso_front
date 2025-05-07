import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Sales from '@/app/[locale]/sales/page'
import fetchMock from 'jest-fetch-mock'
import userEvent from '@testing-library/user-event'
// import * as microserviceStock from '@/app/[locale]/stock/adapters/microserviceStock'

describe('Vista de creación de planes de ventas', () => {

    it('Validar renderizado de la vista', () => {
        render(<Sales />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })

    it('Renderizar tabla principal', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, estado: 'Activo', fecha_inicio: '2024-03-24', fecha_fin: '2024-03-31', meta_ventas: 1000000, productos: 10 }]));
        render(<Sales />)
        await waitFor(() => {
            const table = screen.getByRole('grid')
            expect(table).toBeInTheDocument()
        })        
    })

    it('Renderizado de botones', () => {
        render(<Sales />)
        const addButton = screen.getAllByRole('button')
        expect(addButton).toHaveLength(3)
    })
})