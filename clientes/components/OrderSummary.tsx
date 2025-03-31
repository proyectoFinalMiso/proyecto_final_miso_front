import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useCart } from '../contexts/CartContext';

const OrderSummary = () => {
    const { getTotal } = useCart();

    const handleFinishOrder = () => {
        console.log('Finalizar pedido');
    };

    return (
        <View style={styles.container}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${getTotal().toFixed(0)} COP</Text>
            </View>
            <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishOrder}
            >
                <Text style={styles.buttonText}>Finalizar Pedido</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.light.backgroundLogin,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 21,
        marginBottom: 4,
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        marginRight: 8,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    finishButton: {
        backgroundColor: Colors.light.button,
        borderRadius: 69,
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.light.buttonText,
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    }
});

export default OrderSummary;
