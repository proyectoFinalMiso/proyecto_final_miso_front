import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useCart } from '../contexts/CartContext';
import { sendOrder } from '../services/api/orderService';

const OrderSummary = () => {
    const { getTotal, items, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinishOrder = async () => {
        if (items.length === 0) {
            Alert.alert('Error', 'No hay productos en el carrito');
            return;
        }

        try {
            setIsLoading(true);
            const response = await sendOrder(items);

            Alert.alert(
                'Éxito',
                'El pedido se ha enviado correctamente',
                [{
                    text: 'OK',
                    onPress: () => {
                        clearCart();
                    }
                }]
            );

        } catch (error) {
            let errorMessage = 'Ocurrió un error al enviar el pedido';

            if (error instanceof Error) {
                errorMessage += `: ${error.message}`;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${getTotal().toFixed(0)} COP</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.finishButton,
                    isLoading && styles.finishButtonDisabled
                ]}
                onPress={handleFinishOrder}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.light.buttonText} />
                ) : (
                    <Text style={styles.buttonText}>Finalizar Pedido</Text>
                )}
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
        minWidth: 120,
    },
    finishButtonDisabled: {
        backgroundColor: Colors.light.button + '80',
    },
    buttonText: {
        color: Colors.light.buttonText,
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    }
});

export default OrderSummary;
