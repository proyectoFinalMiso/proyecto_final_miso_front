import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/[locale]/layout'
import userEvent from '@testing-library/user-event'

describe("Layout base", () => {
    it("Renderizado de sidebar", () => {
        render(
            <RootLayout>
                <div>Dummy</div>
            </RootLayout>
        );

        const sidebar = screen.getByTestId('sidebar')
        expect(sidebar).toBeInTheDocument();
    })

    it("Renderizado de footer", () => {
        render(
            <RootLayout>
                <div>Dummy</div>
            </RootLayout>
        );
        const footer = screen.getByTestId('footer')
        expect(footer).toBeInTheDocument();
        expect(screen.getByText(/Copyright © 2025/i)).toBeInTheDocument();
    })

    it("Validar selector de cambio de idioma", async () => {
        render(
            <RootLayout>
                <div>Dummy</div>
            </RootLayout>
        );
        const user = userEvent.setup()

        const languageSelector = screen.getByTitle('language-selector');
        expect(languageSelector).toHaveTextContent("Español (Latinoamérica)");
    })
})