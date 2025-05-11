import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_VENDEDORES;

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

export interface VendedorData {
    id: string;
    nombre: string;
    email: string;
}

export const register = async (data: RegisterRequest): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/crear_vendedor`, data);
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

export const getVendedorData = async (vendedorId: string): Promise<VendedorData> => {
    try {
        if (!vendedorId) {
            throw new Error('vendedorId es undefined o null');
        }
        const response = await axios.get<VendedorData>(`${API_BASE_URL}/obtener_vendedor/${vendedorId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos del vendedor:', error);
        throw error;
    }
}; 
