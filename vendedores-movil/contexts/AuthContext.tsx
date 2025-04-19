import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    login as loginApi,
    register as registerApi,
    getVendedorData,
    LoginRequest,
    RegisterRequest,
    VendedorData
} from '../services/api/authService';

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    vendedorId: string | null;
    vendedorData: VendedorData | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [vendedorId, setVendedorId] = useState<string | null>(null);
    const [vendedorData, setVendedorData] = useState<VendedorData | null>(null);

    const login = async (data: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await loginApi(data);
            console.log('Respuesta completa del login:', response);

            setVendedorId(response.id);

            try {
                const vendedorData = await getVendedorData(response.id);
                console.log('vendedorData:', vendedorData)
                setVendedorData(vendedorData);
                setIsLoggedIn(true);
            } catch (vendedorError) {
                    console.error('Error al obtener datos del vendedor:', vendedorError);
                throw new Error('Se autenticó correctamente pero no se pudieron obtener los datos del vendedor');
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const registerResponse = await registerApi(data);
            console.log('Respuesta del registro:', registerResponse);

            await login({ correo: data.correo, contrasena: data.contrasena });
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setVendedorId(null);
        setVendedorData(null);
    };

    const value = {
        isLoggedIn,
        isLoading,
        vendedorId,
        vendedorData,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 
