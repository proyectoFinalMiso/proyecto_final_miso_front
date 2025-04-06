import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Products from '@/app/products/page'
import userEvent from '@testing-library/user-event'
import fetchMock from 'jest-fetch-mock'
import * as microserviceProducts from '@/app/products/adapters/microserviceProducts'

describe('Vista de creación de productos', () => {

    beforeEach(() => {
        fetchMock.resetMocks()
        fetchMock.mockResponse(JSON.stringify({})) 
    });

    it('Validar renderizado de la vista', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, name: "Fabricante A" }]));
        render(<Products />)
        await waitFor(() => {
            const heading = screen.getByRole('heading', { level: 1 })
            expect(heading).toBeInTheDocument()
        })
    })

    it('Renderizar tabla principal', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Products />)
        await waitFor(() => {
            const table = screen.getByRole('grid')
            expect(table).toBeInTheDocument()
        })        
    })

    it('Renderizado de botones', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Products />)
        await waitFor(() => {
            const filterButton = screen.getByRole('button', { name: /cargar/i })
            const addButton = screen.getByRole('button', { name: /registrar/i } )
            expect(filterButton).toBeInTheDocument()
            expect(addButton).toBeInTheDocument()
        })        
    })

    it('Renderizado de formulario', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Products />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Formulario nuevo producto')
        expect(form).toBeInTheDocument()

        const formTitle = screen.getByTitle("Form title")
        expect(formTitle).toBeInTheDocument()

        const formSubtitle = screen.getByTitle("Form subtitle")
        expect(formSubtitle).toBeInTheDocument()

        const submitButton = screen.getByRole("button", { name: /confirmar/i })
        expect(submitButton).toBeInTheDocument()

        const cancelButton = screen.getByRole("button", { name: /cancelar/i })
        expect(cancelButton).toBeInTheDocument()

        const nameField = screen.getByTitle("Nombre del producto")
        expect(nameField).toBeInTheDocument()

        const costField = screen.getByTitle("Valor unitario del producto")
        expect(costField).toBeInTheDocument()

        const manufacturerField = screen.getByTitle("Fabricante del producto")
        expect(manufacturerField).toBeInTheDocument()

        const volumeField = screen.getByTitle("Volumen del producto")
        expect(volumeField).toBeInTheDocument()

        await user.click(cancelButton)
        expect(form).not.toBeInTheDocument()
    })

    it('Función de cambio de los campos del formulario', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Products />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Formulario nuevo producto')
        expect(form).toBeInTheDocument()

        const nameField = screen.getByRole("textbox", { name: /nombre/i })
        await user.type(nameField, 'Pepito Perez')
        expect(nameField).toHaveValue('Pepito Perez')
    })

    it('Renderizado de modal de carga', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Products />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /cargar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Modal de carga de productos')
        expect(form).toBeInTheDocument()

        const formTitle = screen.getByTitle("Form title")
        expect(formTitle).toBeInTheDocument()

        const formSubtitle = screen.getByTitle("Form subtitle")
        expect(formSubtitle).toBeInTheDocument()

        const submitButton = screen.getByRole("button", { name: /confirmar/i })
        expect(submitButton).toBeInTheDocument()

        const cancelButton = screen.getByRole("button", { name: /cancelar/i })
        expect(cancelButton).toBeInTheDocument()

        const dropzone = screen.getByTitle("Espacio de envio de archivos")
        expect(dropzone).toBeInTheDocument()

        await user.click(cancelButton)
        expect(form).not.toBeInTheDocument()
    })

    it('Comprobar conexión con backend', async () => {
            const manufacturers = await microserviceProducts.getManufacturers()
            const products = await microserviceProducts.getProducts()
            expect(manufacturers).toBeDefined()
            expect(products).toBeDefined()
        })
})