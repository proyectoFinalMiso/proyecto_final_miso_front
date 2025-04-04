import axios from 'axios';
import { CartItem } from '../../contexts/CartContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_PEDIDOS;

export interface OrderPayload {
    cliente: string;
    vendedor: string;
    destino: string;
    productos: ProductOrder[];
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
        const payload: OrderPayload = {
            cliente: clienteId,
            vendedor: vendedorId,
            destino: destino,
            productos: items.map(item => ({
                sku: item.product.sku.toString(),
                cantidad: item.quantity
            }))
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
