import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import LoginScreen from '../../app/login';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

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

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'common.welcomeText': 'Bienvenido',
                'common.login': 'Iniciar sesión',
                'common.register': 'Registrarse',
                'common.error': 'Error',
                'auth.email': 'Correo electrónico',
                'auth.password': 'Contraseña',
                'auth.invalidEmail': 'Email inválido',
                'auth.loginError': 'Error al iniciar sesión',
                'auth.requiredFields': 'Por favor, introduce correo y contraseña'
            };
            return translations[key] || key;
        }
    })
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
        expect(getByText('Registrarse')).toBeTruthy();
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
        expect(getByText('Email inválido')).toBeTruthy();

        // Enter valid email
        fireEvent.changeText(emailInput, 'valid@example.com');

        // Error message should not be present
        expect(() => getByText('Email inválido')).toThrow();
    });

    it('should call login and navigate on successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        // Fill the form
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Iniciar sesión'));

        // Check login was called with correct data
        expect(mockLogin).toHaveBeenCalledWith({
            correo: 'test@example.com',
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

    it('should navigate to register screen when register button is pressed', () => {
        const { getByText } = render(<LoginScreen />);

        fireEvent.press(getByText('Registrarse'));

        expect(mockUseRouter().push).toHaveBeenCalledWith('/register');
    });
}); 
