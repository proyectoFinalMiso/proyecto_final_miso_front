import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LoadingIndicatorProps {
    message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    message = 'Cargando...'
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.message}>{message}</Text>
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
    },
});

export default LoadingIndicator; 
