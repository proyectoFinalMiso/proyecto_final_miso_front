import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const FONT_SIZES = [
    { mode: 'small', name: 'Small', icon: 'text-outline' },
    { mode: 'medium', name: 'Medium', icon: 'text-outline' },
    { mode: 'large', name: 'Large', icon: 'text-outline' }
];

const TextSizeSelector: React.FC = () => {
    const { t } = useTranslation();
    const { colors, fontSize, setFontSize } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('common.textSize', 'Text Size')}</Text>
            <View style={styles.sizeButtons}>
                {FONT_SIZES.map((sizeOption) => (
                    <TouchableOpacity
                        key={sizeOption.mode}
                        style={[
                            styles.sizeButton,
                            fontSize === sizeOption.mode && styles.activeSize,
                        ]}
                        onPress={() => setFontSize(sizeOption.mode as 'small' | 'medium' | 'large')}
                        activeOpacity={0.7}
                        accessibilityLabel={`switch to ${sizeOption.name} text size`}
                        testID={`size-button-${sizeOption.mode}`}
                    >
                        <View style={styles.sizeButtonContent}>
                            <Text
                                style={[
                                    styles.sizeText,
                                    fontSize === sizeOption.mode && styles.activeSizeText,
                                    sizeOption.mode === 'small' && { fontSize: 12 },
                                    sizeOption.mode === 'medium' && { fontSize: 14 },
                                    sizeOption.mode === 'large' && { fontSize: 16 },
                                ]}
                            >
                                {t(`common.${sizeOption.mode}`, sizeOption.name)}
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
    sizeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    sizeButton: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.expandableButtonBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderWidget,
    },
    sizeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeSize: {
        backgroundColor: colors.button,
        borderColor: colors.button,
    },
    sizeText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: colors.text,
    },
    activeSizeText: {
        color: colors.buttonText,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default TextSizeSelector;
