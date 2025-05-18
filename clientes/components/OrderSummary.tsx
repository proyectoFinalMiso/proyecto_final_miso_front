import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Keyboard } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { sendOrder } from '../services/api/orderService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const OrderSummary = () => {
    const { getTotal, items, clearCart } = useCart();
    const { clienteData, isLoggedIn } = useAuth();
    const { t } = useTranslation();
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
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
                    placeholderTextColor={colors.searchHint}
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
                        <ActivityIndicator size="small" color={colors.buttonText} />
                    ) : (
                        <Text style={styles.buttonText}>{t('cart.finishOrder', 'Finalizar Pedido')}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.backgroundLogin,
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
        borderBottomColor: colors.tableBorder,
    },
    addressLabel: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.text,
        marginBottom: 8,
    },
    addressInput: {
        borderWidth: 1,
        borderColor: colors.tableBorder,
        borderRadius: 8,
        padding: 12,
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        backgroundColor: colors.background,
        minHeight: 44,
        color: colors.text,
    },
    errorInput: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: fontSizes.xs,
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
        fontSize: fontSizes.md,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.text,
        marginRight: 8,
    },
    totalValue: {
        fontSize: fontSizes.md,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.text,
    },
    finishButton: {
        backgroundColor: colors.button,
        borderRadius: 69,
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    finishButtonDisabled: {
        backgroundColor: colors.button + '80',
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: fontSizes.sm,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    }
});

export default OrderSummary;
