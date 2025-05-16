import React, { useState, useMemo } from 'react';
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
import { Order } from '../services/api/orderService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

type OrderTableProps = {
    orders: Order[];
    refreshControl?: React.ReactElement<RefreshControlProps>;
};

const getStatusColor = (status: string, colors: any) => {
    switch (status) {
        case 'SOLICITADO':
            return colors.warning;
        case 'EN_PROCESO':
            return colors.info;
        case 'FINALIZADO':
            return colors.success;
        case 'CANCELADO':
            return colors.error;
        default:
            return colors.text;
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
    const { t } = useTranslation();
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
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
                    <Text style={styles.orderAddress}>{t('orderTable.orderTo', 'Pedido a')} {item.direccion}</Text>
                    <View style={styles.chevronIconContainer}>
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.text}
                            accessibilityLabel={isExpanded ? t('orderTable.closeDetails', 'close-details') : t('orderTable.openDetails', 'open-details')}
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('orderTable.totalValue', 'Valor Total')}</Text>
                            <Text style={styles.detailValue}>${item.valorFactura} COP</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('orderTable.date', 'Fecha')}</Text>
                            <Text style={styles.detailValue}>{formatDate(item.fechaIngreso)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel} testID={`order-status-${item.id}`}>{t('orderTable.status', 'Estado')}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado, colors) }]}>
                                <Text style={styles.statusText}>{t(`orderTable.statuses.${item.estado}`, item.estado)}</Text>
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
                <Text style={styles.headerText}>{t('orderTable.orders', 'Pedidos')}</Text>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer} testID="empty-orders" accessibilityLabel={t('orderTable.noOrders', 'No hay pedidos disponibles')}>
                    <Text style={styles.emptyText}>{t('orderTable.noOrders', 'No hay pedidos disponibles')}</Text>
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

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLogin,
        borderRadius: 21,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.tableBorder,
    },
    header: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerText: {
        color: colors.tableHeaderText,
        fontSize: fontSizes.xxs,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    listContent: {
        paddingBottom: 8,
    },
    orderContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.tableBorder,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    chevronIconContainer: {
        backgroundColor: colors.expandableButtonBackground,
        padding: 2,
        borderRadius: 8,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderAddress: {
        fontSize: fontSizes.sm,
        color: colors.text,
        flex: 1,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    expandedContent: {
        backgroundColor: colors.backgroundLogin,
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
        fontSize: fontSizes.smd,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.expandableDetailLabel,
        width: 100,
        marginRight: 15
    },
    detailValue: {
        fontSize: fontSizes.smd,
        color: colors.expandableDetailValue,
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
        fontSize: fontSizes.xs,
        color: '#2E2E2E',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: fontSizes.sm,
        color: colors.text,
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
});

export default OrderTable;
