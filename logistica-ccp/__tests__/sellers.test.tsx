import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Sellers from '@/app/sellers/page'
import userEvent from '@testing-library/user-event'

describe('Vista de creación de vendedores', () => {
    it('Validar renderizado de la vista', () => {
        render(<Sellers />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
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

        const emailField = screen.getByTitle("e-mail")
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
})