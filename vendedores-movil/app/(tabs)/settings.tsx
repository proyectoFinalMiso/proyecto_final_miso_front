import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../../components/LanguageSelector';
import ThemeSelector from '../../components/ThemeSelector';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title} testID="settingsScreenTitle" accessibilityLabel="settingsScreenTitle">
                        {t('settings.title', 'Ajustes')}
                    </Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.preferences', 'Preferencias')}</Text>
                        <LanguageSelector />
                        <ThemeSelector />
                    </View>
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>
                        {t('settings.version', 'Versión')} 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.titleText,
    },
    content: {
        paddingHorizontal: 16,
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.primary,
        marginBottom: 12,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.backgroundLogin,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionIconContainer: {
        width: 40, 
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.tabActiveBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.titleText,
    },
    optionDescription: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
        opacity: 0.7,
        marginTop: 2,
    },
    versionContainer: {
        padding: 24,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    versionText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
        opacity: 0.6,
    },
});
