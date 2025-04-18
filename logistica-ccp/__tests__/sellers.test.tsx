import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Sellers from '@/app/[locale]/sellers/page'
import userEvent from '@testing-library/user-event'
import * as microserviceSeller from '@/app/[locale]/sellers/adapters/microserviceSeller'

describe('Vista de creación de vendedores', () => {
    it('Validar renderizado de la vista', () => {
        render(<Sellers />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })

    it('Renderizar tabla principal', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Sellers />)
        await waitFor(() => {
            const table = screen.getByRole('grid')
            expect(table).toBeInTheDocument()
        })        
    })

    it('renderizado de botones', () => {
        render(<Sellers />)
        const filterButton = screen.getByRole('button', { name: /filtrar/i })
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        expect(filterButton).toBeInTheDocument()
        expect(addButton).toBeInTheDocument()
    })

    it('Renderizado de formulario', async () => {
        render(<Sellers />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Formulario nuevo vendedor')
        expect(form).toBeInTheDocument()

        const formTitle = screen.getByTitle("Form title")
        expect(formTitle).toBeInTheDocument()

        const submitButton = screen.getByRole("button", { name: /confirmar/i })
        expect(submitButton).toBeInTheDocument()

        const cancelButton = screen.getByRole("button", { name: /cancelar/i })
        expect(cancelButton).toBeInTheDocument()

        const nameField = screen.getByTitle("Nombre")
        expect(nameField).toBeInTheDocument()

        const emailField = screen.getByTitle("email")
        expect(emailField).toBeInTheDocument()
    })

    it('Función de cambio de los campos del formulario', async () => {
        render(<Sellers />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Formulario nuevo vendedor')
        expect(form).toBeInTheDocument()

        const nameField = screen.getByRole("textbox", { name: /nombre/i })
        await user.type(nameField, 'Diego Naranjo')
        expect(nameField).toHaveValue('Diego Naranjo')
    })

    it('Comprobar conexión con backend', async () => {
                const sellers = await microserviceSeller.getSellers()
                expect(sellers).toBeDefined()
            })
})