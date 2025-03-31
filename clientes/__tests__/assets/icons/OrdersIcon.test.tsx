import React from 'react';
import { render } from '@testing-library/react-native';
import OrdersIcon from '../../../assets/icons/OrdersIcon';

describe('OrdersIcon Component', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<OrdersIcon testID="orders-icon" />);

        const icon = getByTestId('orders-icon');
        expect(icon).toBeTruthy();
        expect(icon.props.width).toBe(28);
        expect(icon.props.height).toBe(28);
    });

    it('renders with custom size', () => {
        const { getByTestId } = render(<OrdersIcon testID="orders-icon" size={32} />);

        const icon = getByTestId('orders-icon');
        expect(icon.props.width).toBe(32);
        expect(icon.props.height).toBe(32);
    });

    it('renders with custom fill color', () => {
        const { getByTestId } = render(<OrdersIcon testID="orders-icon" fill="green" />);

        const icon = getByTestId('orders-icon');
        const path = icon.findByProps({ fill: 'green' });
        expect(path).toBeTruthy();
    });
}); 
