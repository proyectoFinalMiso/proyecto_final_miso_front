import axios from 'axios';
import { fetchInventory, InventoryItem } from './inventoryService';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_CLIENTES;

export interface Cliente {
    id: string;
    nombre: string;
    correo: string;
}

export interface ClientesResponse {
    clientes: Cliente[];
    msg: string;
}

// Fetch all seller's clients
export const fetchClients = async (vendedorId: string): Promise<Cliente[]> => {
    try {
        const response = await axios.get<ClientesResponse>(`${API_BASE_URL}/clientes?vendedor_id=${vendedorId}`);
        return response.data.clientes;
    } catch (error) {
        console.error('Error fetching available clients:', error);
        throw error;
    }
};

// Map API data to application Client model
export const mapClientesToProducts = (clientesItems: Cliente[]) => {
    return clientesItems.map(item => ({
        id: item.id,
        name: item.nombre,
    }));
}; 
