import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ErrorDisplayProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = 'Ha ocurrido un error al cargar los datos.',
    onRetry,
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={50} color={Colors.light.cancelColor} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans_400Regular',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: Colors.light.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 69,
    },
    retryText: {
        color: Colors.light.buttonText,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default ErrorDisplay; 
