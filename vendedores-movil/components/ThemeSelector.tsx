import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const THEMES = [
    { mode: 'light', name: 'Light' },
    { mode: 'dark', name: 'Dark' }
];

const ThemeSelector: React.FC = () => {
    const { t } = useTranslation();
    const { colors, theme, setTheme } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('common.theme', 'Theme')}</Text>
            <View style={styles.themeButtons}>
                {THEMES.map((themeOption) => (
                    <TouchableOpacity
                        key={themeOption.mode}
                        style={[
                            styles.themeButton,
                            theme === themeOption.mode && styles.activeTheme,
                        ]}
                        onPress={() => setTheme(themeOption.mode as 'light' | 'dark')}
                        activeOpacity={0.7}
                        accessibilityLabel={`switch to ${themeOption.name} theme`}
                    >
                        <View style={styles.themeButtonContent}>
                            <Ionicons
                                name={themeOption.mode === 'light' ? 'sunny-outline' : 'moon-outline'}
                                size={20}
                                color={theme === themeOption.mode ? colors.buttonText : colors.text}
                                style={styles.themeIcon}
                            />
                            <Text
                                style={[
                                    styles.themeText,
                                    theme === themeOption.mode && styles.activeThemeText,
                                ]}
                            >
                                {t(`common.${themeOption.mode}`, themeOption.name)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.backgroundLogin,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 16,
        color: colors.titleText,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    themeButton: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.expandableButtonBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderWidget,
    },
    themeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeIcon: {
        marginRight: 8,
    },
    activeTheme: {
        backgroundColor: colors.button,
        borderColor: colors.button,
    },
    themeText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.text,
    },
    activeThemeText: {
        color: colors.buttonText,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default ThemeSelector;
