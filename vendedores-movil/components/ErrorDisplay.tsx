import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorDisplayProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = 'Ha ocurrido un error al cargar los datos.',
    onRetry,
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={50} color={colors.cancelColor} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>
                        {t('common.retry', 'Reintentar')}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans_400Regular',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: colors.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 69,
    },
    retryText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default ErrorDisplay;
