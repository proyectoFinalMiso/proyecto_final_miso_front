import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';

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

describe('LoadingIndicator Component', () => {
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
        
    it('renders correctly with default message', () => {
        const { getByText, UNSAFE_getByType } = render(<LoadingIndicator />);

        expect(getByText('Cargando...')).toBeTruthy();

        const activityIndicator = UNSAFE_getByType(ActivityIndicator);
        expect(activityIndicator).toBeTruthy();
    });

    it('renders correctly with custom message', () => {
        const customMessage = 'Cargando productos...';
        const { getByText } = render(<LoadingIndicator message={customMessage} />);

        expect(getByText(customMessage)).toBeTruthy();
    });

    it('renders ActivityIndicator with correct size and color', () => {
        const { UNSAFE_getByType } = render(<LoadingIndicator />);

        const activityIndicator = UNSAFE_getByType(ActivityIndicator);
        expect(activityIndicator.props.size).toBe('large');
        expect(activityIndicator.props.color).toBeTruthy(); 
    });

    it('applies styles to the message text', () => {
        const { getByText } = render(<LoadingIndicator />);

        const messageText = getByText('Cargando...');
        expect(messageText.props.style).toBeTruthy();
    });

    it('renders without errors with empty props', () => {
        const { getByText } = render(<LoadingIndicator />);
        expect(getByText('Cargando...')).toBeTruthy();
    });
}); 
