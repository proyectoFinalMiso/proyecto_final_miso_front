import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import LanguageSelector from '../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
    const { t } = useTranslation();

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
        color: Colors.light.titleText,
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
        color: Colors.light.primary,
        marginBottom: 12,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.light.backgroundLogin,
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
        backgroundColor: Colors.light.tabActiveBackground,
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
        color: Colors.light.titleText,
    },
    optionDescription: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.text,
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
        color: Colors.light.text,
        opacity: 0.6,
    },
});
