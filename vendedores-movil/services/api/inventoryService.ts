import axios from 'axios';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_INVENTARIO;

export interface InventoryItem {
    id: string;
    nombre: string;
    valorUnitario: number;
    cantidadDisponible: number;
    cantidadReservada: number;
    fechaIgreso: string;
    bodega: string;
    lote: string;
    posicion: string;
    sku: number;
}

export interface InventoryResponse {
    body: InventoryItem[];
    msg: string;
}

// Fetch all inventory items
export const fetchInventory = async (): Promise<InventoryItem[]> => {
    try {
        const response = await axios.get<InventoryResponse>(`${API_BASE_URL}/stock_listar_inventarios`);
        return response.data.body;
    } catch (error) {
        console.error('Error fetching available inventory:', error);
        throw error;
    }
};

// Fetch only available inventory items (cantidadDisponible > 0)
export const fetchAvailableInventory = async (): Promise<InventoryItem[]> => {
    try {
        const allItems = await fetchInventory();
        return allItems.filter(item => item.cantidadDisponible > 0);
    } catch (error) {
        throw error;
    }
};

// Map API data to application Product model
export const mapInventoryToProducts = (inventoryItems: InventoryItem[]) => {
    return inventoryItems.map(item => ({
        id: item.id,
        name: item.nombre,
        price: item.valorUnitario,
        sku: item.sku,
        availableQuantity: item.cantidadDisponible,
    }));
}; 
