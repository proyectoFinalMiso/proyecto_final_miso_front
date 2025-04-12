import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import LoginScreen from '../../app/login';
import { useAuth } from '../../contexts/AuthContext';

// Mock dependencies
jest.mock('expo-router', () => ({
    useRouter: jest.fn()
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn()
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'MockedIonicons'
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;

describe('LoginScreen', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mocks
        mockUseRouter.mockReturnValue({
            push: jest.fn(),
            replace: jest.fn()
        });

        mockUseAuth.mockReturnValue({
            login: mockLogin,
            isLoading: false
        });
    });

    it('should render login form correctly', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        expect(getByText('Bienvenido')).toBeTruthy();
        expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
        expect(getByPlaceholderText('Contraseña')).toBeTruthy();
        expect(getByText('Iniciar sesión')).toBeTruthy();
    });

    it('should show error alert when submitting empty form', () => {
        const { getByText } = render(<LoginScreen />);

        fireEvent.press(getByText('Iniciar sesión'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Por favor, introduce correo y contraseña'
        );
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should validate email format', () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);
        const emailInput = getByPlaceholderText('Correo electrónico');

        // Enter invalid email
        fireEvent.changeText(emailInput, 'invalidemail');

        // Should show validation error
        expect(getByText('Email inválido. Debe ser un email de CCP.')).toBeTruthy();

        // Enter valid email
        fireEvent.changeText(emailInput, 'valid@ccp.com');

        // Error message should not be present
        expect(() => getByText('Email inválido. Debe ser un email de CCP.')).toThrow();
    });

    it('should call login and navigate on successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        // Fill the form
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@ccp.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Iniciar sesión'));

        // Check login was called with correct data
        expect(mockLogin).toHaveBeenCalledWith({
            correo: 'test@ccp.com',
            contrasena: 'password123'
        });

        await waitFor(() => {
            // Check navigation was called
            expect(mockUseRouter().replace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('should display error alert on login failure', async () => {
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValueOnce(new Error(errorMessage));

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        // Fill the form
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Iniciar sesión'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                `Error al iniciar sesión: ${errorMessage}`
            );
        });
    });
}); 
