import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelector from '../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/Colors';

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

const mockBaseFontSizes = {
    xxxs: 8, xxs: 11, xs: 12, xsPlus: 13, sm: 14, smd: 15, md: 16,
    lg: 18, xl: 20, xxl: 24, xxxl: 32, title: 42,
};
const mockFontSizeMultipliers: Record<'small' | 'medium' | 'large', number> = { small: 0.9, medium: 1.0, large: 1.1 };
  
const calculateMockFontSizes = (fontSizeMode: 'small' | 'medium' | 'large') => {
    const multiplier = mockFontSizeMultipliers[fontSizeMode];
    const calculated: any = {}; 
    for (const key in mockBaseFontSizes) {
    calculated[key] = mockBaseFontSizes[key as keyof typeof mockBaseFontSizes] * multiplier;
    }
    return calculated;
};

const mockDefaultFontSizeMode = 'medium' as 'small' | 'medium' | 'large';
const mockDefaultFontSizes = calculateMockFontSizes(mockDefaultFontSizeMode);

jest.mock('../../contexts/ThemeContext', () => {
    const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
    return {
        useTheme: jest.fn().mockReturnValue({
            theme: 'light',
            colors: ActualAppColors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),

            fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
        }),
    };
});

describe('LanguageSelector Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const mockUseTheme = require('../../contexts/ThemeContext').useTheme;
                        mockUseTheme.mockReturnValue({
                            theme: 'light',
                            colors: Colors.light,
                            isDark: false,
                            toggleTheme: jest.fn(),
                            setTheme: jest.fn(),

                            fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
                        });
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
