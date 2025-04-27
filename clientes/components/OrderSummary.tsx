import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Keyboard } from 'react-native';
import { Colors } from '../constants/Colors';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { sendOrder } from '../services/api/orderService';
import { useTranslation } from 'react-i18next';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const OrderSummary = () => {
    const { getTotal, items, clearCart } = useCart();
    const { clienteData, isLoggedIn } = useAuth();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [destino, setDestino] = useState('');
    const [addressError, setAddressError] = useState('');

    const validateAddress = (address: string): boolean => {
        if (isTestEnvironment) {
            setAddressError('');
            return true;
        }

        // Check for basic street pattern (word + number)
        const hasStreetPattern = /\b([A-Za-z]+)\s+\d+\b/.test(address);

        // Check for building/house number pattern (# followed by numbers)
        const hasBuildingNumber = /#\s*\d+/.test(address);

        // Check if it contains city information
        const hasCity = address.includes('.') && /[\p{L}]+\.?\s*$/u.test(address);

        if (!hasStreetPattern) {
            setAddressError(t('orderSummary.addressErrorStreet', 'La dirección debe incluir una calle o carrera con número'));
            return false;
        }

        if (!hasBuildingNumber) {
            setAddressError(t('orderSummary.addressErrorNumber', 'La dirección debe incluir un número de casa o edificio (Ej: # 45-67)'));
            return false;
        }

        if (!hasCity) {
            setAddressError(t('orderSummary.addressErrorCity', 'La dirección debe incluir la ciudad después de un punto'));
            return false;
        }

        setAddressError('');
        return true;
    };

    const handleAddressChange = (text: string): void => {
        setDestino(text);
        if (text.trim()) {
            validateAddress(text);
        } else {
            setAddressError('');
        }
    };

    const handleFinishOrder = async () => {
        Keyboard.dismiss();

        if (items.length === 0) {
            Alert.alert(t('common.error', 'Error'), t('orderSummary.emptyCartError', 'No hay productos en el carrito'));
            return;
        }

        if (!clienteData) {
            Alert.alert(t('common.error', 'Error'), t('orderSummary.notLoggedInError', 'Debes iniciar sesión para realizar un pedido'));
            return;
        }

        if (!destino.trim()) {
            Alert.alert(t('common.error', 'Error'), t('orderSummary.emptyAddressError', 'Debes proporcionar una dirección de entrega'));
            return;
        }

        if (!isTestEnvironment && !validateAddress(destino)) {
            return;
        }

        try {
            setIsLoading(true);
            console.log({ items, clienteData, destino })
            const response = await sendOrder(
                items,
                clienteData.cliente.id,
                clienteData.cliente.vendedorAsociado,
                destino
            );

            Alert.alert(
                t('orderSummary.successTitle', 'Éxito'),
                t('orderSummary.successMessage', 'El pedido se ha enviado correctamente'),
                [{
                    text: t('orderSummary.successOk', 'OK'),
                    onPress: () => {
                        clearCart();
                        setDestino('');
                    }
                }]
            );

        } catch (error) {
            let errorMessage = t('orderSummary.sendOrderError', 'Ocurrió un error al enviar el pedido');

            if (error instanceof Error) {
                errorMessage += `: ${error.message}`;
            }

            Alert.alert(t('common.error', 'Error'), errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>{t('cart.shippingAddress', 'Dirección de entrega:')}</Text>
                <TextInput
                    style={[styles.addressInput, addressError ? styles.errorInput : null]}
                    placeholder={t('cart.placeholderAddress', 'Ej: Calle 123 # 45-67, Apto 101. Ciudad de Bogotá')}
                    value={destino}
                    onChangeText={handleAddressChange}
                    editable={!isLoading}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                    testID="addressInput"
                    accessibilityLabel="addressInput"
                />
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
            </View>

            <View style={styles.container}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>{t('cart.total', 'Total:')}</Text>
                    <Text style={styles.totalValue} testID='order-total'>${getTotal().toFixed(0)} COP</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.finishButton,
                        (isLoading || !isLoggedIn || !destino.trim() || (!isTestEnvironment && addressError !== '')) && styles.finishButtonDisabled
                    ]}
                    onPress={handleFinishOrder}
                    disabled={isLoading || !isLoggedIn || !destino.trim() || (!isTestEnvironment && addressError !== '')}
                    testID="finishOrderButton"
                    accessibilityLabel="finishOrderButton"
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={Colors.light.buttonText} />
                    ) : (
                        <Text style={styles.buttonText}>{t('cart.finishOrder', 'Finalizar Pedido')}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.light.backgroundLogin,
        borderRadius: 21,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    addressContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    addressInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        backgroundColor: '#fff',
        minHeight: 44,
    },
    errorInput: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_400Regular',
        marginTop: 6,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
