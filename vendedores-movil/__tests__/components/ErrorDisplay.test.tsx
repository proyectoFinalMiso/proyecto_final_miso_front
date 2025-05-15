import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorDisplay from '../../components/ErrorDisplay';
import { Colors } from '../../constants/Colors';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
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

describe('ErrorDisplay Component', () => {
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
        const { getByText } = render(<ErrorDisplay />);

        expect(getByText('Ha ocurrido un error al cargar los datos.')).toBeTruthy();
    });

    it('renders correctly with custom message', () => {
        const customMessage = 'Error de conexión. Intente más tarde.';
        const { getByText } = render(<ErrorDisplay message={customMessage} />);

        expect(getByText(customMessage)).toBeTruthy();
    });

    it('renders retry button when onRetry function is provided', () => {
        const mockOnRetry = jest.fn();
        const { getByText } = render(<ErrorDisplay onRetry={mockOnRetry} />);

        const retryButton = getByText('Reintentar');
        expect(retryButton).toBeTruthy();
    });

    it('does not render retry button when onRetry is not provided', () => {
        const { queryByText } = render(<ErrorDisplay />);

        const retryButton = queryByText('Reintentar');
        expect(retryButton).toBeNull();
    });

    it('calls onRetry when retry button is pressed', () => {
        const mockOnRetry = jest.fn();
        const { getByText } = render(<ErrorDisplay onRetry={mockOnRetry} />);

        const retryButton = getByText('Reintentar');
        fireEvent.press(retryButton);

        expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('renders with alert icon', () => {
        const { UNSAFE_getByType } = render(<ErrorDisplay />);

        // Check if the Ionicons component is rendered with the alert-circle name
        const ionicon = UNSAFE_getByType('Ionicons');
        expect(ionicon.props.name).toBe('alert-circle');
        expect(ionicon.props.size).toBe(50);
    });

    it('renders with appropriate styling', () => {
        const { getByText } = render(<ErrorDisplay />);

        const message = getByText('Ha ocurrido un error al cargar los datos.');

        // Check if the message has styles applied (note: this is a bit of an implementation detail)
        expect(message.props.style).toBeTruthy();
    });

    it('should not call onRetry if not provided', () => {
        // Just a smoke test to ensure no errors occur when onRetry is undefined
        const { getByText } = render(<ErrorDisplay message="Error" />);
        expect(getByText('Error')).toBeTruthy();
        // No assertion needed, just checking it doesn't throw
    });
}); 
