import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import RegisterScreen from '../../app/register';
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
                'common.register': 'Registrarse',
                'common.cancel': 'Cancelar',
                'common.error': 'Error',
                'auth.email': 'Correo electrónico',
                'auth.password': 'Contraseña',
                'auth.fullName': 'Nombre completo',
                'auth.createAccount': 'Crear cuenta',
                'auth.invalidEmail': 'Email inválido',
                'auth.shortPassword': 'Contraseña demasiado corta',
                'auth.shortName': 'Nombre demasiado corto',
                'auth.requiredFields': 'Por favor, completa todos los campos',
                'auth.formErrors': 'Por favor, corrige los errores en el formulario',
                'auth.registerError': 'Error al registrarse'
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

describe('RegisterScreen', () => {
    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mocks
        mockUseRouter.mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            back: jest.fn()
        });

        mockUseAuth.mockReturnValue({
            register: mockRegister,
            isLoading: false
        });
    });

    it('should render register form correctly', () => {
        const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

        expect(getByText('Crear cuenta')).toBeTruthy();
        expect(getByPlaceholderText('Nombre completo')).toBeTruthy();
        expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
        expect(getByPlaceholderText('Contraseña')).toBeTruthy();
        expect(getByText('Registrarse')).toBeTruthy();
        expect(getByText('Cancelar')).toBeTruthy();
    });

    it('should show error alert when submitting empty form', () => {
        const { getByText } = render(<RegisterScreen />);

        fireEvent.press(getByText('Registrarse'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Por favor, completa todos los campos'
        );
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate name length', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
        const nameInput = getByPlaceholderText('Nombre completo');

        // Enter too short name
        fireEvent.changeText(nameInput, 'AB');

        // Should show validation error
        expect(getByText('Nombre demasiado corto')).toBeTruthy();

        // Enter valid name
        fireEvent.changeText(nameInput, 'Valid Name');

        // Error message should not be present
        expect(() => getByText('Nombre demasiado corto')).toThrow();
    });

    it('should validate email format', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
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

    it('should validate password length', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
        const passwordInput = getByPlaceholderText('Contraseña');

        // Enter too short password
        fireEvent.changeText(passwordInput, 'ab');

        // Should show validation error
        expect(getByText('Contraseña demasiado corta')).toBeTruthy();

        // Enter valid password
        fireEvent.changeText(passwordInput, 'password123');

        // Error message should not be present
        expect(() => getByText('Contraseña demasiado corta')).toThrow();
    });

    it('should call register and navigate on successful registration', async () => {
        mockRegister.mockResolvedValueOnce(undefined);

        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        // Fill the form
        fireEvent.changeText(getByPlaceholderText('Nombre completo'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Registrarse'));

        // Check register was called with correct data
        expect(mockRegister).toHaveBeenCalledWith({
            nombre: 'Test User',
            correo: 'test@example.com',
            contrasena: 'password123'
        });

        await waitFor(() => {
            // Check navigation was called
            expect(mockUseRouter().replace).toHaveBeenCalledWith('/(tabs)');
        });
    });

    it('should display error alert on registration failure', async () => {
        const errorMessage = 'Email already exists';
        mockRegister.mockRejectedValueOnce(new Error(errorMessage));

        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        // Fill the form
        fireEvent.changeText(getByPlaceholderText('Nombre completo'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Registrarse'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                `Error al registrarse: ${errorMessage}`
            );
        });
    });

    it('should display error when form has validation errors', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        // Fill the form with invalid data
        fireEvent.changeText(getByPlaceholderText('Nombre completo'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

        // Submit the form
        fireEvent.press(getByText('Registrarse'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Por favor, corrige los errores en el formulario'
        );
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should navigate back when back button is pressed', () => {
        const { getByText } = render(<RegisterScreen />);

        fireEvent.press(getByText('Cancelar'));

        expect(mockUseRouter().back).toHaveBeenCalled();
    });
}); 
