import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';

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
