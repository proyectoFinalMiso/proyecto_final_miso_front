import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelector from '../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: jest.fn((key) => {
            const translations: { [key: string]: string } = {
                'common.language': 'Idioma'
            };
            return translations[key] || key;
        }),
        i18n: {
            language: 'es',
            changeLanguage: jest.fn()
        }
    })
}));

describe('LanguageSelector Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUseTranslation = useTranslation as jest.Mock;

    it('renders correctly with default language (Spanish)', () => {
        const { getByText } = render(<LanguageSelector />);

        expect(getByText('Idioma')).toBeTruthy();
        expect(getByText('Español')).toBeTruthy();
        expect(getByText('English')).toBeTruthy();
    });

    it('calls changeLanguage when a language button is pressed', () => {
        const mockChangeLanguage = jest.fn();
        mockUseTranslation.mockReturnValueOnce({
            t: jest.fn((key) => key),
            i18n: {
                language: 'es',
                changeLanguage: mockChangeLanguage
            }
        });

        const { getByText } = render(<LanguageSelector />);
        
        // Press the English button
        fireEvent.press(getByText('English'));
        
        // Check if changeLanguage was called with 'en'
        expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });

    it('applies active text style to active language', () => {
        mockUseTranslation.mockReturnValueOnce({
            t: jest.fn((key) => key),
            i18n: {
                language: 'es',
                changeLanguage: jest.fn()
            }
        });
        
        const { getByText } = render(<LanguageSelector />);
        
        // Spanish text should have active style
        const spanishText = getByText('Español');
        expect(spanishText.props.style).toContainEqual(
            expect.objectContaining({
                color: expect.any(String),
                fontFamily: expect.stringContaining('SemiBold')
            })
        );
        
        // English text should not have active style
        const englishText = getByText('English');
        expect(englishText.props.style).not.toContainEqual(
            expect.objectContaining({
                color: '#FFFFFF'
            })
        );
    });
});
