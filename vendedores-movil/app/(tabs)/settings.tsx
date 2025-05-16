<<<<<<< HEAD
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../../components/LanguageSelector';
import ThemeSelector from '../../components/ThemeSelector';
import TextSizeSelector from '../../components/TextSizeSelector';
=======
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import LanguageSelector from '../../components/LanguageSelector';
>>>>>>> main
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
    const { t } = useTranslation();
<<<<<<< HEAD
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
=======
>>>>>>> main

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
<<<<<<< HEAD
                        <LanguageSelector />
                        <ThemeSelector />
                        <TextSizeSelector />
=======
                        <Text style={styles.sectionTitle}>{t('settings.preferences', 'Preferencias')}</Text>
                        <LanguageSelector />
>>>>>>> main
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

<<<<<<< HEAD
const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
=======
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
>>>>>>> main
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
<<<<<<< HEAD
        fontSize: fontSizes.xxl,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.titleText,
=======
        fontSize: 28,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.titleText,
>>>>>>> main
    },
    content: {
        paddingHorizontal: 16,
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
<<<<<<< HEAD
        fontSize: fontSizes.lg,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.primary,
=======
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.primary,
>>>>>>> main
        marginBottom: 12,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
<<<<<<< HEAD
        backgroundColor: colors.backgroundLogin,
=======
        backgroundColor: Colors.light.backgroundLogin,
>>>>>>> main
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
<<<<<<< HEAD
        backgroundColor: colors.tabActiveBackground,
=======
        backgroundColor: Colors.light.tabActiveBackground,
>>>>>>> main
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
<<<<<<< HEAD
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.titleText,
    },
    optionDescription: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
=======
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.titleText,
    },
    optionDescription: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.text,
>>>>>>> main
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
<<<<<<< HEAD
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
=======
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.text,
>>>>>>> main
        opacity: 0.6,
    },
});
