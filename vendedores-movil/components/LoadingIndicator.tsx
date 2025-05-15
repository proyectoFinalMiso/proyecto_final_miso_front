import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMemo } from 'react';

interface LoadingIndicatorProps {
    message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    message = 'Cargando...'
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>{message}</Text>
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
    },
});

export default LoadingIndicator;
