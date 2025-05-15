import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorDisplay from '../../components/ErrorDisplay';
import { Colors } from '../../constants/Colors';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('../../contexts/ThemeContext', () => {
    const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
    return {
        useTheme: jest.fn().mockReturnValue({
            theme: 'light',
            colors: ActualAppColors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),
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
