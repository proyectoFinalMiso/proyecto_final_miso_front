import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../../app/(tabs)/settings';

// Mock dependencies
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    const MockSafeAreaView = jest.fn(({ children, ...props }) => {
        const ActualView = RN.View;
        return <ActualView {...props}>{children}</ActualView>;
    });
    Object.defineProperty(RN, 'SafeAreaView', { value: MockSafeAreaView });

    return RN;
});

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Mock LanguageSelector component
jest.mock('../../../components/LanguageSelector', () => {
    const MockView = require('react-native').View;
    return jest.fn(() => <MockView testID="language-selector-mock" />);
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'settings.title': 'Ajustes',
                'settings.preferences': 'Preferencias',
                'settings.version': 'Versión'
            };
            return translations[key] || key;
        }
    })
}));

describe('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render settings screen correctly', () => {
        const { getByTestId, getByText } = render(<SettingsScreen />);

        expect(getByTestId('settingsScreenTitle')).toBeTruthy();
        expect(getByText('Ajustes')).toBeTruthy();
        expect(getByText('Preferencias')).toBeTruthy();
        expect(getByText('Versión 1.0.0')).toBeTruthy();
    });

    it('should render LanguageSelector component', () => {
        const { getByTestId } = render(<SettingsScreen />);

        expect(getByTestId('language-selector-mock')).toBeTruthy();
    });

    it('should display the correct styling', () => {
        const { getByTestId } = render(<SettingsScreen />);

        const title = getByTestId('settingsScreenTitle');
        expect(title.props.style).toBeTruthy();
    });

    it('should be inside a SafeAreaView', () => {
        render(<SettingsScreen />);

        // Check if SafeAreaView mock was called
        const RNMock = require('react-native');
        expect(RNMock.SafeAreaView).toHaveBeenCalled();
    });

    it('should render the correct layout structure', () => {
        const { getByText } = render(<SettingsScreen />);

        // Check main sections
        const titleElement = getByText('Ajustes');
        const preferencesElement = getByText('Preferencias');
        const versionElement = getByText('Versión 1.0.0');
        
        expect(titleElement).toBeTruthy();
        expect(preferencesElement).toBeTruthy();
        expect(versionElement).toBeTruthy();
    });
});
