import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as authService from '../../services/api/authService';

// Mock the auth service
jest.mock('../../services/api/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

const TestComponent = ({ onRender }: { onRender: (auth: ReturnType<typeof useAuth>) => void }) => {
    const auth = useAuth();
    onRender(auth);
    return null;
};

const renderAuthHook = () => {
    let lastRenderedAuth: ReturnType<typeof useAuth> | null = null;

    const onRender = (auth: ReturnType<typeof useAuth>) => {
        lastRenderedAuth = auth;
    };

    const utils = render(
        <AuthProvider>
            <TestComponent onRender={onRender} />
        </AuthProvider>
    );

    return {
        ...utils,
        result: () => lastRenderedAuth!
    };
};

describe('AuthContext', () => {
    const mockLoginRequest = {
        correo: 'test@ccp.com',
        contrasena: 'password123'
    };

    const mockRegisterRequest = {
        nombre: 'Test User',
        correo: 'test@ccp.com',
        contrasena: 'password123'
    };

    const mockLoginResponse = {
        id: '123',
        msg: 'Login exitoso'
    };

    const mockVendedorData = {
        id: '123',
        nombre: 'Test User',
        correo: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderAuthHook();

        expect(result().isLoggedIn).toBe(false);
        expect(result().isLoading).toBe(false);
        expect(result().vendedorId).toBeNull();
        expect(result().vendedorData).toBeNull();
    });

    describe('login', () => {
        it('should set logged in state after successful login', async () => {
            // Arrange
            mockedAuthService.login.mockResolvedValueOnce(mockLoginResponse);
            mockedAuthService.getVendedorData.mockResolvedValueOnce(mockVendedorData);

            const { result } = renderAuthHook();

            // Act
            await act(async () => {
                await result().login(mockLoginRequest);
            });

            // Assert
            expect(mockedAuthService.login).toHaveBeenCalledWith(mockLoginRequest);
            expect(mockedAuthService.getVendedorData).toHaveBeenCalledWith(mockLoginResponse.id);
            expect(result().isLoggedIn).toBe(true);
            expect(result().vendedorId).toBe(mockLoginResponse.id);
            expect(result().vendedorData).toEqual(mockVendedorData);
            expect(result().isLoading).toBe(false);
        });

        it('should handle login errors correctly', async () => {
            // Arrange
            const error = new Error('Invalid credentials');
            mockedAuthService.login.mockRejectedValueOnce(error);

            const { result } = renderAuthHook();

            // Act & Assert
            await expect(async () => {
                await act(async () => {
                    await result().login(mockLoginRequest);
                });
            }).rejects.toThrow('Invalid credentials');

            expect(result().isLoggedIn).toBe(false);
            expect(result().vendedorId).toBeNull();
            expect(result().vendedorData).toBeNull();
            expect(result().isLoading).toBe(false);
        });

    });

    describe('register', () => {
        it('should register and log in the user automatically', async () => {
            // Arrange
            mockedAuthService.register.mockResolvedValueOnce({ id: '123', mensaje: 'Usuario registrado con éxito' });
            mockedAuthService.login.mockResolvedValueOnce(mockLoginResponse);
            mockedAuthService.getVendedorData.mockResolvedValueOnce(mockVendedorData);

            const { result } = renderAuthHook();

            // Act
            await act(async () => {
                await result().register(mockRegisterRequest);
            });

            // Assert
            expect(mockedAuthService.register).toHaveBeenCalledWith(mockRegisterRequest);
            expect(mockedAuthService.login).toHaveBeenCalledWith({
                correo: mockRegisterRequest.correo,
                contrasena: mockRegisterRequest.contrasena
            });
            expect(result().isLoggedIn).toBe(true);
            expect(result().vendedorId).toBe(mockLoginResponse.id);
            expect(result().vendedorData).toEqual(mockVendedorData);
            expect(result().isLoading).toBe(false);
        });

        it('should handle registration errors correctly', async () => {
            // Arrange
            const error = new Error('Email already exists');
            mockedAuthService.register.mockRejectedValueOnce(error);

            const { result } = renderAuthHook();

            // Act & Assert
            await expect(async () => {
                await act(async () => {
                    await result().register(mockRegisterRequest);
                });
            }).rejects.toThrow('Email already exists');

            expect(mockedAuthService.login).not.toHaveBeenCalled();
            expect(result().isLoggedIn).toBe(false);
            expect(result().vendedorId).toBeNull();
            expect(result().vendedorData).toBeNull();
            expect(result().isLoading).toBe(false);
        });
    });

    describe('logout', () => {
        it('should clear auth state on logout', async () => {
            // Arrange
            mockedAuthService.login.mockResolvedValueOnce(mockLoginResponse);
            mockedAuthService.getVendedorData.mockResolvedValueOnce(mockVendedorData);

            const { result } = renderAuthHook();

            // Login first
            await act(async () => {
                await result().login(mockLoginRequest);
            });

            // Verify logged in state
            expect(result().isLoggedIn).toBe(true);
            expect(result().vendedorId).toBe(mockLoginResponse.id);
            expect(result().vendedorData).not.toBeNull();

            // Act
            act(() => {
                result().logout();
            });

            // Assert
            expect(result().isLoggedIn).toBe(false);
            expect(result().vendedorId).toBeNull();
            expect(result().vendedorData).toBeNull();
        });
    });
}); 
