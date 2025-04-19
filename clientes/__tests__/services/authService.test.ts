import axios from 'axios';
import {
    login,
    register,
    getClientData,
    LoginRequest,
    RegisterRequest
} from '../../services/api/authService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Service', () => {
    const mockLoginData: LoginRequest = {
        correo: 'test@example.com',
        contrasena: 'password123'
    };

    const mockRegisterData: RegisterRequest = {
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena: 'password123'
    };

    const mockLoginResponse = {
        id: '123',
        msg: 'Login exitoso'
    };

    const mockRegisterResponse = {
        id: '123',
        mensaje: 'Usuario registrado con éxito'
    };

    const mockClientData = {
        id: '123',
        nombre: 'Test User',
        correo: 'test@example.com',
        vendedorId: '456'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully', async () => {
            // Arrange
            mockedAxios.post.mockResolvedValueOnce({
                data: mockLoginResponse
            });

            // Act
            const result = await login(mockLoginData);

            // Assert
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/login'),
                mockLoginData
            );
            expect(result).toEqual(mockLoginResponse);
        });

        it('should handle login errors correctly', async () => {
            // Arrange
            const errorMessage = 'Invalid credentials';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(login(mockLoginData)).rejects.toThrow(errorMessage);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/login'),
                mockLoginData
            );
        });
    });

    describe('register', () => {
        it('should register successfully', async () => {
            // Arrange
            mockedAxios.post.mockResolvedValueOnce({
                data: mockRegisterResponse
            });

            // Act
            const result = await register(mockRegisterData);

            // Assert
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/crear'),
                mockRegisterData
            );
            expect(result).toEqual(mockRegisterResponse);
        });

        it('should handle registration errors correctly', async () => {
            // Arrange
            const errorMessage = 'Email already exists';
            mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(register(mockRegisterData)).rejects.toThrow(errorMessage);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/crear'),
                mockRegisterData
            );
        });
    });

    describe('getClientData', () => {
        it('should fetch client data successfully', async () => {
            // Arrange
            mockedAxios.get.mockResolvedValueOnce({
                data: mockClientData
            });

            // Act
            const result = await getClientData('123');

            // Assert
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('/123')
            );
            expect(result).toEqual(mockClientData);
        });

        it('should throw error when clienteId is not provided', async () => {
            // Act & Assert
            await expect(getClientData('')).rejects.toThrow('clienteId es undefined o null');
            expect(mockedAxios.get).not.toHaveBeenCalled();
        });

        it('should handle client data fetch errors correctly', async () => {
            // Arrange
            const errorMessage = 'Client not found';
            mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(getClientData('123')).rejects.toThrow(errorMessage);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('/123')
            );
        });
    });
}); 
