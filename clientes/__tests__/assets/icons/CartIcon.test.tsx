import React from 'react';
import { render } from '@testing-library/react-native';
import CartIcon from '../../../assets/icons/CartIcon';

describe('CartIcon Component', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<CartIcon testID="cart-icon" />);

        const icon = getByTestId('cart-icon');
        expect(icon).toBeTruthy();
        expect(icon.props.width).toBe(28);
        expect(icon.props.height).toBe(28);
    });

    it('renders with custom size', () => {
        const { getByTestId } = render(<CartIcon testID="cart-icon" size={36} />);

        const icon = getByTestId('cart-icon');
        expect(icon.props.width).toBe(36);
        expect(icon.props.height).toBe(36);
    });

    it('renders with custom fill color', () => {
        const { getByTestId } = render(<CartIcon testID="cart-icon" fill="blue" />);

        const icon = getByTestId('cart-icon');
        const path = icon.findByProps({ fill: 'blue' });
        expect(path).toBeTruthy();
    });
}); 
