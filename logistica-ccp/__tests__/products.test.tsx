import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Products from '@/app/products/page'
import userEvent from '@testing-library/user-event'

describe('Vista de creación de productos', () => {
    it('Validar renderizado de la vista', () => {
        render(<Products />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })

    it('Renderizar tabla principal', () => {
        render(<Products />)
        const table = screen.getByRole('grid')
        expect(table).toBeInTheDocument()
    })
})