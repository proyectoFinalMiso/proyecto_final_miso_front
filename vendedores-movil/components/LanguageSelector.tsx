import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/Colors';

const LANGUAGES = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' }
];

const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();

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

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.light.backgroundLogin,
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
        color: Colors.light.titleText,
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
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default LanguageSelector;
