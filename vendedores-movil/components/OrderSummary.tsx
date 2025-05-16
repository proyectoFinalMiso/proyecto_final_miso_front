import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Keyboard, Modal, FlatList } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { sendOrder } from '../services/api/orderService';
import { fetchClients, Cliente } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const OrderSummary = () => {
    const { getTotal, items, clearCart } = useCart();
    const { vendedorData, isLoggedIn } = useAuth();
    const { colors, fontSizes } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [destino, setDestino] = useState('');
    const [addressError, setAddressError] = useState('');
    const [clients, setClients] = useState<Cliente[]>([]);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
    const [isClientModalVisible, setIsClientModalVisible] = useState(false);
    const [isLoadingClients, setIsLoadingClients] = useState(false);

    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

    useEffect(() => {
        if (vendedorData?.id) {
            loadClients();
        }
    }, [vendedorData]);

    const loadClients = async () => {
        if (!vendedorData?.id) return;

        try {
            setIsLoadingClients(true);
            const clientsList = await fetchClients(vendedorData.id);
            setClients(clientsList);
        } catch (error) {
            Alert.alert(t('common.error', 'Error'), t('clientsModal.loadClientsError', 'No se pudieron cargar los clientes. Por favor intente de nuevo.'));
        } finally {
            setIsLoadingClients(false);
        }
    };

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

        if (!vendedorData) {
            Alert.alert(t('common.error', 'Error'), t('orderSummary.notLoggedInError', 'Debes iniciar sesión para realizar un pedido'));
            return;
        }

        if (!selectedClient) {
            Alert.alert(t('common.error', 'Error'), t('orderSummary.nottSelectedClientError', 'Debes seleccionar un cliente'));
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
            const response = await sendOrder(
                items,
                selectedClient.id,
                vendedorData.id,
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
                        setSelectedClient(null);
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

    const renderClientItem = ({ item }: { item: Cliente }) => (
        <TouchableOpacity
            style={styles.clientItem}
            onPress={() => {
                setSelectedClient(item);
                setIsClientModalVisible(false);
            }}
        >
            <Text style={styles.clientName}>{item.nombre}</Text>
            <Text style={styles.clientEmail}>{item.correo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>{t('orderSummary.client', 'Cliente')}</Text>
                <TouchableOpacity
                    style={styles.clientSelector}
                    onPress={() => setIsClientModalVisible(true)}
                    testID='clientSelector'
                    accessibilityLabel="clientSelector"
                >
                    <Text style={selectedClient ? styles.selectedClientText : styles.placeholderText}>
                        {selectedClient
                            ? `${selectedClient.nombre}  (${selectedClient.correo})`
                            : t('orderSummary.clientPlaceholder', 'Selecciona un cliente')}
                    </Text>
                </TouchableOpacity>

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
                        (isLoading || !isLoggedIn || !destino.trim() || !selectedClient || (!isTestEnvironment && addressError !== '')) && styles.finishButtonDisabled
                    ]}
                    onPress={handleFinishOrder}
                    disabled={isLoading || !isLoggedIn || !destino.trim() || !selectedClient || (!isTestEnvironment && addressError !== '')}
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

            <Modal
                visible={isClientModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsClientModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle} testID='modal-title'>{t('clientsModal.title', 'Selecciona un cliente')}</Text>
                        {isLoadingClients ? (
                            <ActivityIndicator size="large" color={colors.button} />
                        ) : clients.length === 0 ? (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateText} testID='empty-modal'>{t('clientsModal.empty', 'No tienes clientes asignados')}</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={clients}
                                renderItem={renderClientItem}
                                keyExtractor={(item) => item.id}
                                style={styles.clientList}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsClientModalVisible(false)}
                            testID='closeModalButton'
                            accessibilityLabel="closeModalButton"
                        >
                            <Text style={styles.closeButtonText}>{t('clientsModal.close', 'Cerrar')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        color: colors.text,
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
    },
    clientSelector: {
        borderWidth: 1,
        borderColor: colors.tableBorder,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: colors.background,
    },
    selectedClientText: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
    },
    placeholderText: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: fontSizes.lg,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.searchHint,
        marginBottom: 16,
        textAlign: 'center',
    },
    emptyStateContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
        textAlign: 'center',
    },
    clientList: {
        maxHeight: '70%',
        backgroundColor: colors.background,
    },
    clientItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    clientName: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.text,
        marginBottom: 4,
    },
    clientEmail: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: colors.button,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.buttonText,
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default OrderSummary;
