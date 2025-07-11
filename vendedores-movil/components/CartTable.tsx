import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, CartItem } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const CartTable = () => {
    const { items, updateQuantity, removeFromCart, getTotal } = useCart();
    const { t } = useTranslation();
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpand = (productId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const decreaseQuantity = (productId: string, currentQuantity: number) => {
        updateQuantity(productId, Math.max(1, currentQuantity - 1));
    };

    const increaseQuantity = (productId: string, currentQuantity: number) => {
        updateQuantity(productId, currentQuantity + 1);
    };

    const renderCartItem = ({ item }: { item: CartItem }) => {
        const isExpanded = expandedItems.has(item.product.id);

        return (
            <View style={styles.productContainer} testID={`cart-item-${item.product.id}`}>
                <TouchableOpacity
                    style={styles.productRow}
                    onPress={() => toggleExpand(item.product.id)}
                    activeOpacity={0.7}
                    testID={`product-row-${item.product.id}`}
                >
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <View style={styles.chevronIconContainer}>
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.text}
                            accessibilityLabel={isExpanded ? t('cartTable.collapseDetails', 'Cerrar detalles') : t('cartTable.expandDetails', 'Abrir detalles')}
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent} testID={`expanded-content-${item.product.id}`}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('cartTable.unitValue', 'Valor Unitario')}</Text>
                            <Text style={styles.detailValue}>${item.product.price.toFixed(0)} COP</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('cartTable.quantity', 'Cantidad')}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => decreaseQuantity(item.product.id, item.quantity)}
                                    testID={`decrease-quantity-${item.product.id}`}
                                    accessibilityLabel={t('cartTable.decreaseQuantity', { name: item.product.name, defaultValue: `Disminuir cantidad para ${item.product.name}` })}
                                >
                                    <Ionicons name="remove" size={12} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText} testID={`quantity-${item.product.id}`}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => increaseQuantity(item.product.id, item.quantity)}
                                    testID={`increase-quantity-${item.product.id}`}
                                    accessibilityLabel={t('cartTable.increaseQuantity', { name: item.product.name, defaultValue: `Aumentar cantidad para ${item.product.name}` })}
                                >
                                    <Ionicons name="add" size={12} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('cartTable.subtotal', 'Subtotal')}</Text>
                            <Text style={styles.detailValue} testID={`subtotal-${item.product.id}`}>${(item.product.price * item.quantity).toFixed(0)} COP</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{t('cartTable.action', 'Acción')}</Text>
                            <TouchableOpacity
                                onPress={() => removeFromCart(item.product.id)}
                                testID={`remove-product-${item.product.id}`}
                                accessibilityLabel={t('cartTable.removeFromCart', { name: item.product.name, defaultValue: `Eliminar ${item.product.name} del carrito` })}
                            >
                                <Ionicons name="trash" size={16} color={colors.cancelColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container} testID="cart-table">
            <View style={styles.header}>
                <Text style={styles.headerText}>{t('cartTable.title', 'Carrito de Compras')}</Text>
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer} testID="empty-cart-message">
                    <Text style={styles.emptyText}>{t('cartTable.empty', 'No hay productos en el carrito')}</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.product.id}
                    contentContainerStyle={styles.listContent}
                    testID="cart-items-list"
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
    productContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.tableBorder,
    },
    productRow: {
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
    productName: {
        fontSize: fontSizes.sm,
        color: colors.text,
        flex: 1,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
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
    detailButton: {
        backgroundColor: colors.button,
        borderRadius: 69,
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    removeButton: {
        backgroundColor: '#e63946',
    },
    detailButtonText: {
        color: colors.buttonText,
        fontSize: fontSizes.xxxs,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.expandableQuantityButtonBorder,
    },
    quantityButton: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: fontSizes.xsPlus,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
        borderLeftWidth: 1,
        borderLeftColor: colors.expandableQuantityButtonBorder,
        borderRightWidth: 1,
        borderRightColor: colors.expandableQuantityButtonBorder,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: fontSizes.sm,
        color: colors.text,
        textAlign: 'center',
    }
});

export default CartTable;
