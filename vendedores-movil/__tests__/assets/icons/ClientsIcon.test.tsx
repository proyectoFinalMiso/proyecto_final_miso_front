import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsIcon from '../../../assets/icons/ClientIcon';

describe('ClientIcon Component', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = render(<SettingsIcon testID="settings-icon" />);

        const icon = getByTestId('settings-icon');
        expect(icon).toBeTruthy();
        expect(icon.props.width).toBe(28);
        expect(icon.props.height).toBe(28);
    });

    it('renders with custom size', () => {
        const { getByTestId } = render(<SettingsIcon testID="settings-icon" size={36} />);

        const icon = getByTestId('settings-icon');
        expect(icon.props.width).toBe(36);
        expect(icon.props.height).toBe(36);
    });

    it('renders with custom fill color', () => {
        const { getByTestId } = render(<SettingsIcon testID="settings-icon" fill="blue" />);

        const icon = getByTestId('settings-icon');
        const path = icon.findByProps({ fill: 'blue' });
        expect(path).toBeTruthy();
    });
}); 
