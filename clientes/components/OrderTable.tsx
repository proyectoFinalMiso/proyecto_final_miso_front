import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    RefreshControlProps
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Order } from '../services/api/orderService';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

type OrderTableProps = {
    orders: Order[];
    refreshControl?: React.ReactElement<RefreshControlProps>;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'SOLICITADO':
            return Colors.light.warning;
        case 'EN_PROCESO':
            return Colors.light.info;
        case 'FINALIZADO':
            return Colors.light.success;
        case 'CANCELADO':
            return Colors.light.error;
        default:
            return Colors.light.text;
    }
};

const formatDate = (dateString: string) => {
    console.log(dateString);
    const date = new Date(dateString);
    console.log(date);
    return date.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const OrderTable = ({ orders, refreshControl }: OrderTableProps) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpand = (orderId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const renderOrder = ({ item }: { item: Order }) => {
        const isExpanded = expandedItems.has(item.id);

        return (
            <View style={styles.orderContainer}>
                <TouchableOpacity
                    style={styles.orderRow}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                    testID={`order-row-${item.id}`}
                    accessibilityLabel={`${item.id}`}
                >
                    <Text style={styles.orderAddress}>Pedido a {item.direccion}</Text>
                    <View style={styles.chevronIconContainer}>
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={Colors.light.text}
                            accessibilityLabel={isExpanded ? 'close-details' : 'open-details'}
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Valor Total</Text>
                            <Text style={styles.detailValue}>${item.valorFactura} COP</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Fecha</Text>
                            <Text style={styles.detailValue}>{formatDate(item.fechaIngreso)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel} testID={`order-status-${item.id}`}>Estado</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
                                <Text style={styles.statusText}>{item.estado}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Pedidos</Text>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer} testID="empty-orders" accessibilityLabel="No hay pedidos disponibles">
                    <Text style={styles.emptyText}>No hay pedidos disponibles</Text>
                </View>
            ) : (
                <FlatList
                    testID="orders-list"
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={refreshControl}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 21,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    header: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerText: {
        color: Colors.light.tableHeaderText,
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    listContent: {
        paddingBottom: 8,
    },
    orderContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    chevronIconContainer: {
        backgroundColor: Colors.light.expandableButtonBackground,
        padding: 2,
        borderRadius: 8,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderAddress: {
        fontSize: 14,
        color: Colors.light.text,
        flex: 1,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    expandedContent: {
        backgroundColor: Colors.light.backgroundLogin,
        paddingVertical: 6,
        paddingHorizontal: 12,
        paddingBottom: 2,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 15,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.expandableDetailLabel,
        width: 100,
        marginRight: 15
    },
    detailValue: {
        fontSize: 15,
        color: Colors.light.expandableDetailValue,
        flex: 1,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.text,
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
});

export default OrderTable; 
