import axios from 'axios';
import { CartItem } from '../../contexts/CartContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_PEDIDOS;

export interface OrderPayload {
    cliente: string;
    vendedor: string;
    direccion: string;
    productos: ProductOrder[];
    latitud: number;
    longitud: number;
}

export interface ProductOrder {
    sku: string;
    cantidad: number;
}

export interface OrderResponse {
    body: any;
    msg: string;
}

export const sendOrder = async (
    items: CartItem[],
    clienteId: string,
    vendedorId: string,
    destino: string
): Promise<OrderResponse> => {
    try {
        console.log({ clienteId, vendedorId, destino })

        const latitud = 1.6 + (Math.random() * (11.0 - 1.6));
        const longitud = -75.5 + (Math.random() * (-73.0 - (-75.5)));

        const payload: OrderPayload = {
            cliente: clienteId,
            vendedor: vendedorId,
            direccion: destino,
            productos: items.map(item => ({
                sku: item.product.sku.toString(),
                cantidad: item.quantity
            })),
            latitud: Number(latitud.toFixed(5)),
            longitud: Number(longitud.toFixed(5))
        };

        console.log({ payload })

        const response = await axios.post<OrderResponse>(
            `${API_BASE_URL}/pedido/crear`,
            payload
        );

        return response.data;
    } catch (error) {
        console.error('Error sending order:', error);
        throw error;
    }
}; 
