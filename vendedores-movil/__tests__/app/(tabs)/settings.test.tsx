import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../../app/(tabs)/settings';
import { Colors } from '../../../constants/Colors';
import { StyleSheet } from 'react-native';

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

// Mock ThemeContext
jest.mock('../../../contexts/ThemeContext', () => {
    const ActualAppColors = jest.requireActual('../../../constants/Colors').Colors;
    return {
        useTheme: jest.fn().mockReturnValue({
            theme: 'light',
            colors: ActualAppColors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),
        }),
    };
});

describe('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const mockUseTheme = require('../../../contexts/ThemeContext').useTheme;
        mockUseTheme.mockReturnValue({
            theme: 'light',
            colors: Colors.light,
            isDark: false,
            toggleTheme: jest.fn(),
            setTheme: jest.fn(),
        });
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

    it('should display the correct styling for the title based on the theme', () => {
        const { getByTestId } = render(<SettingsScreen />);

        const title = getByTestId('settingsScreenTitle');
        const titleStyle = StyleSheet.flatten(title.props.style);
        
        expect(titleStyle).toBeTruthy();
        expect(titleStyle.color).toBe(Colors.light.titleText);
        expect(titleStyle.fontSize).toBe(28);
        expect(titleStyle.fontFamily).toBe('PlusJakartaSans_700Bold');
    });

    it('should be inside a SafeAreaView', () => {
        render(<SettingsScreen />);
        const RNMock = require('react-native');
        expect(RNMock.SafeAreaView).toHaveBeenCalled();
    });

    it('should render the correct layout structure', () => {
        const { getByText } = render(<SettingsScreen />);
        const titleElement = getByText('Ajustes');
        const preferencesElement = getByText('Preferencias');
        const versionElement = getByText('Versión 1.0.0');
        
        expect(titleElement).toBeTruthy();
        expect(preferencesElement).toBeTruthy();
        expect(versionElement).toBeTruthy();
    });

    describe('SettingsScreen with dark theme', () => {
        beforeEach(() => {
            const mockUseTheme = require('../../../contexts/ThemeContext').useTheme;
            mockUseTheme.mockReturnValue({
                theme: 'dark',
                colors: Colors.dark,
                isDark: true,
                toggleTheme: jest.fn(),
                setTheme: jest.fn(),
            });
        });

        it('should display correct title color for dark theme', () => {
            const { getByTestId } = render(<SettingsScreen />);
            const title = getByTestId('settingsScreenTitle');
            const titleStyle = StyleSheet.flatten(title.props.style);
            expect(titleStyle.color).toBe(Colors.dark.titleText);
        });
    });
});
