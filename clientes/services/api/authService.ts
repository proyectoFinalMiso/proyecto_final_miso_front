import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_CLIENTES;

export interface RegisterRequest {
    nombre: string;
    correo: string;
    contrasena: string;
}

export interface LoginRequest {
    correo: string;
    contrasena: string;
}

export interface LoginResponse {
    id: string;
    msg: string;
}

export interface ClienteData {
    cliente: {
        id: string;
        nombre: string;
        correo: string;
        vendedorAsociado: string;
    };
}

export const register = async (data: RegisterRequest): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/crear`, data);
        return response.data;
    } catch (error) {
        console.error('Error durante el registro:', error);
        throw error;
    }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, data);
        return response.data;
    } catch (error) {
        console.error('Error durante el login:', error);
        throw error;
    }
};

export const getClientData = async (clienteId: string): Promise<ClienteData> => {
    try {
        if (!clienteId) {
            throw new Error('clienteId es undefined o null');
        }
        const response = await axios.get<ClienteData>(`${API_BASE_URL}/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
        throw error;
    }
}; 
