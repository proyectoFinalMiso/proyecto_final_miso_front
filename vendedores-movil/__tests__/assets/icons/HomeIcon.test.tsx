import React from 'react';
import { render } from '@testing-library/react-native';
import HomeIcon from '../../../assets/icons/HomeIcon';

describe('HomeIcon Component', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<HomeIcon testID="home-icon" />);

        const icon = getByTestId('home-icon');
        expect(icon).toBeTruthy();
        expect(icon.props.width).toBe(28);
        expect(icon.props.height).toBe(28);
    });

    it('renders with custom size', () => {
        const { getByTestId } = render(<HomeIcon testID="home-icon" size={40} />);

        const icon = getByTestId('home-icon');
        expect(icon.props.width).toBe(40);
        expect(icon.props.height).toBe(40);
    });

    it('renders with custom fill color', () => {
        const { getByTestId } = render(<HomeIcon testID="home-icon" fill="red" />);

        const icon = getByTestId('home-icon');
        const path = icon.findByProps({ fill: 'red' });
        expect(path).toBeTruthy();
    });
}); 
