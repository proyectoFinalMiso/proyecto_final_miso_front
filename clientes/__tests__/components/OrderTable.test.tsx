import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderTable from '../../components/OrderTable';
import { Order } from '../../services/api/orderService';
import { Colors } from '../../constants/Colors';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    configureNext: jest.fn(),
    Presets: {
        easeInEaseOut: 'easeInEaseOut',
    },
}));

// Reset the native date format to avoid locale issues in tests
const originalDateToLocaleString = Date.prototype.toLocaleString;
const mockToLocaleString = function (this: Date, locale?: string | string[], options?: Intl.DateTimeFormatOptions): string {
    if (locale === 'es-CO' && this.toString() !== 'Invalid Date') {
        const day = String(this.getDate()).padStart(2, '0');
        const month = String(this.getMonth() + 1).padStart(2, '0');
        const year = this.getFullYear();
        const hours = String(this.getHours()).padStart(2, '0');
        const minutes = String(this.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }
    return originalDateToLocaleString.call(this, locale as any, options);
};

Date.prototype.toLocaleString = mockToLocaleString;

describe('OrderTable', () => {
    const mockOrders: Order[] = [
        {
            id: 'order1',
            cliente: 'cliente1',
            direccion: 'Calle 123 #45-67',
            estado: 'SOLICITADO',
            fechaIngreso: '2023-04-15T10:30:00',
            latitud: 4.5,
            longitud: -74.2,
            packingList: 'packing1',
            valorFactura: 25000,
            vendedor: 'vendedor1'
        },
        {
            id: 'order2',
            cliente: 'cliente1',
            direccion: 'Avenida 78 #90-12',
            estado: 'FINALIZADO',
            fechaIngreso: '2023-04-14T15:45:00',
            latitud: 4.7,
            longitud: -74.1,
            packingList: 'packing2',
            valorFactura: 35000,
            vendedor: 'vendedor1'
        }
    ];

    it('should render orders correctly', () => {
        const { getAllByText } = render(<OrderTable orders={mockOrders} />);

        // Check if all orders are rendered
        expect(getAllByText(/Pedido a/)).toHaveLength(2);
        expect(getAllByText('Pedido a Calle 123 #45-67')).toBeTruthy();
        expect(getAllByText('Pedido a Avenida 78 #90-12')).toBeTruthy();
    });

    it('should render orders header correctly', () => {
        const { getByText } = render(<OrderTable orders={mockOrders} />);
        expect(getByText('Pedidos')).toBeTruthy();
    });

    it('should show empty message when no orders', () => {
        const { getByText } = render(<OrderTable orders={[]} />);
        expect(getByText('No hay pedidos disponibles')).toBeTruthy();
    });

    it('should expand order details when an order is pressed', () => {
        const { getByText, queryByText } = render(<OrderTable orders={[mockOrders[0]]} />);

        // Initially, the details should not be visible
        expect(queryByText('$25000 COP')).toBeNull();

        // Press the order row to expand
        fireEvent.press(getByText('Pedido a Calle 123 #45-67'));

        // The details should now be visible
        expect(getByText('$25000 COP')).toBeTruthy();
        expect(getByText('Valor Total')).toBeTruthy();
        expect(getByText('Fecha')).toBeTruthy();
        expect(getByText('Estado')).toBeTruthy();
        expect(getByText('SOLICITADO')).toBeTruthy();
        // Date formatting match
        expect(getByText('15/04/2023, 10:30')).toBeTruthy();
    });

    it('should collapse expanded order when pressed again', () => {
        const { getByText, queryByText } = render(<OrderTable orders={[mockOrders[0]]} />);

        // Expand the order
        fireEvent.press(getByText('Pedido a Calle 123 #45-67'));
        expect(getByText('$25000 COP')).toBeTruthy();

        // Press again to collapse
        fireEvent.press(getByText('Pedido a Calle 123 #45-67'));
        expect(queryByText('$25000 COP')).toBeNull();
    });
}); 
