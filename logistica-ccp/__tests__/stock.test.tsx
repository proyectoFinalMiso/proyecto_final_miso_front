import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Stock from '@/app/[locale]/stock/page'
import fetchMock from 'jest-fetch-mock'
import userEvent from '@testing-library/user-event'
import * as microserviceStock from '@/app/[locale]/stock/adapters/microserviceStock'

describe('Vista de creación de stock', () => {

    beforeEach(() => {
        fetchMock.resetMocks()

        fetchMock.mockResponse(
            JSON.stringify([
                {"body": [{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]},
            ]))

        fetchMock.mockResponse(
            JSON.stringify([
                {"bodegas": [{ id: "123", nombre: 'Bodega A', direccion: 'Calle 123', latitude: '4.123456', longitude: '-74.123456' }]},
            ]))
    });

    it('Validar renderizado de la vista', () => {
        
        render(<Stock />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })

    it('Renderizar tabla principal', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }]));
        render(<Stock />)
        await waitFor(() => {
            const table = screen.getByRole('grid')
            expect(table).toBeInTheDocument()
        })        
    })

    it('Renderizado de botones', () => {
        
        render(<Stock />)
        const addButton = screen.getAllByRole('button')
        expect(addButton).toHaveLength(3)
    })

    it('Renderizado de formulario', async () => {
        render(<Stock />)
        const user = userEvent.setup()
        const addButton = screen.getByTestId('addStock')
        await user.click(addButton)

        const form = screen.getByTitle('Formulario Ingresar Producto a Stock')
        expect(form).toBeInTheDocument()

        const formTitle = screen.getByTitle("Form title")
        expect(formTitle).toBeInTheDocument()

        const formSubtitle = screen.getByTitle("Form subtitle")
        expect(formSubtitle).toBeInTheDocument()

        const nameField = screen.getByTitle("Producto")
        expect(nameField).toBeInTheDocument()

        const manufacturerField = screen.getByTitle("Lote")
        expect(manufacturerField).toBeInTheDocument()

        const amountField = screen.getByTitle("Cantidad")
        expect(manufacturerField).toBeInTheDocument()

        const warehouseField = screen.getByTitle("Bodega")
        expect(manufacturerField).toBeInTheDocument()
    })

    it('Cambio campos del formulario', async () => {
        render(<Stock />)
        const user = userEvent.setup()
        const addButton = screen.getByTestId('addStock')
        await user.click(addButton)
        
        const form = screen.getByTitle('Formulario Ingresar Producto a Stock')
        expect(form).toBeInTheDocument()

        const loteField = screen.getAllByRole("textbox")[0]
        await user.type(loteField, 'lote123')
        expect(loteField).toHaveValue('lote123')

        const cantidadField = screen.getAllByRole("textbox")[1]
        await user.type(cantidadField, '10')
        expect(cantidadField).toHaveValue('10')
    })

    it('Comprobar conexión con backend', async () => {
                const products = await microserviceStock.getProducts()
                expect(products).toBeDefined()
            })

})