<<<<<<< HEAD
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
=======
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/Colors';
>>>>>>> main

const LANGUAGES = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' }
];

const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
<<<<<<< HEAD
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
=======
>>>>>>> main

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('common.language')}</Text>
            <View style={styles.languageButtons}>
                {LANGUAGES.map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        style={[
                            styles.languageButton,
                            i18n.language === language.code && styles.activeLanguage,
                        ]}
                        onPress={() => i18n.changeLanguage(language.code)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                i18n.language === language.code && styles.activeLanguageText,
                            ]}
                        >
                            {language.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

<<<<<<< HEAD
const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.backgroundLogin,
=======
const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.light.backgroundLogin,
>>>>>>> main
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
<<<<<<< HEAD
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 16,
        color: colors.titleText,
=======
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 16,
        color: Colors.light.titleText,
>>>>>>> main
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    languageButton: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
<<<<<<< HEAD
        backgroundColor: colors.expandableButtonBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderWidget,
    },
    activeLanguage: {
        backgroundColor: colors.button,
        borderColor: colors.button,
    },
    languageText: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.text,
    },
    activeLanguageText: {
        color: colors.buttonText,
=======
        backgroundColor: Colors.light.expandableButtonBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borderWidget,
    },
    activeLanguage: {
        backgroundColor: Colors.light.button,
        borderColor: Colors.light.button,
    },
    languageText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.text,
    },
    activeLanguageText: {
        color: Colors.light.buttonText,
>>>>>>> main
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default LanguageSelector;
