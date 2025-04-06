import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Stock from '@/app/stock/page'
import userEvent from '@testing-library/user-event'

describe('Vista de creación de stock', () => {
    it('Validar renderizado de la vista', () => {
        render(<Stock />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })

    it('Renderizado de botones', () => {
        render(<Stock />)
        const filterButton = screen.getByRole('button', { name: /filtrar/i })
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        expect(filterButton).toBeInTheDocument()
        expect(addButton).toBeInTheDocument()
    })

    it('Renderizado de formulario', async () => {
        render(<Stock />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Ingresar Lote')
        expect(form).toBeInTheDocument()

        const formTitle = screen.getByTitle("Form title")
        expect(formTitle).toBeInTheDocument()

        const formSubtitle = screen.getByTitle("Form subtitle")
        expect(formSubtitle).toBeInTheDocument()

        const submitButton = screen.getByRole("button", { name: /confirmar/i })
        expect(submitButton).toBeInTheDocument()

        const cancelButton = screen.getByRole("button", { name: /cancelar/i })
        expect(cancelButton).toBeInTheDocument()

        const nameField = screen.getByTitle("Producto")
        expect(nameField).toBeInTheDocument()

        const manufacturerField = screen.getByTitle("Cantidad")
        expect(manufacturerField).toBeInTheDocument()

        await user.click(cancelButton)
        expect(form).not.toBeInTheDocument()
    })

    it('Función de cambio de los campos del formulario', async () => {
        render(<Stock />)
        const user = userEvent.setup()
        const addButton = screen.getByRole('button', { name: /registrar/i } )
        await user.click(addButton)
        const form = screen.getByTitle('Ingresar Lote')
        expect(form).toBeInTheDocument()

        const nameField = screen.getByRole("textbox", { name: /producto/i })
        await user.type(nameField, 'Pan bimbo')
        expect(nameField).toHaveValue('Pan bimbo')
    })

})