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
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export type Product = {
  id: string;
  name: string;
  price: number;
  sku: number,
  availableQuantity: number;
};

type ProductTableProps = {
  products: Product[];
  onProductPress?: (product: Product) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

const ProductTable = ({ products, onProductPress, refreshControl }: ProductTableProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const toggleExpand = (productId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
        if (!quantities[productId]) {
          setQuantities(prev => ({ ...prev, [productId]: 1 }));
        }
      }
      return newSet;
    });
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(1, currentQuantity - 1);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const increaseQuantity = (productId: string) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = currentQuantity + 1;
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isExpanded = expandedItems.has(item.id);
    const quantity = quantities[item.id] || 1;

    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          style={styles.productRow}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
          testID={`product-row-${item.id}`}
          accessibilityLabel={`${item.name}`}
        >
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.chevronIconContainer}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text}
              accessibilityLabel={isExpanded ? t('productTable.collapseDetails', 'Contraer detalles') : t('productTable.expandDetails', 'Expandir detalles')}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('productTable.stock', 'Inventario')}</Text>
              <Text style={styles.detailValue}>{item.availableQuantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('productTable.unitValue', 'Valor Unitario')}</Text>
              <Text style={styles.detailValue}>${item.price.toFixed(0)} COP</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('productTable.quantity', 'Cantidad')}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item.id)}
                  testID={`decrease-quantity-button-${item.id}`}
                  accessibilityLabel={t('productTable.decreaseQuantity', { name: item.name, defaultValue: `Disminuir cantidad para ${item.name}` })}
                >
                  <Ionicons name="remove" size={12} color={colors.text} />
                </TouchableOpacity>
                <Text
                  style={styles.quantityText}
                  testID={`quantity-text-${item.id}`}
                  accessibilityLabel={t('productTable.currentQuantity', { quantity, defaultValue: `Cantidad actual ${quantity}` })}
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.id)}
                  testID={`increase-quantity-button-${item.id}`}
                  accessibilityLabel={t('productTable.increaseQuantity', { name: item.name, defaultValue: `Aumentar cantidad para ${item.name}` })}
                >
                  <Ionicons name="add" size={12} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('productTable.action', 'Acción')}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleAddToCart(item, quantity)}
                testID={`add-to-cart-button-${item.id}`}
                accessibilityLabel={t('productTable.addToCart', { quantity, name: item.name, defaultValue: `Agregar ${quantity} de ${item.name} al carrito` })}
              >
                <Ionicons name="add" size={8} color={colors.buttonText} />
                <Text style={styles.detailButtonText}>{t('productTable.addToCartButton', 'Agregar al carrito')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('productTable.title', 'Productos')}</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={styles.emptyText}
            testID="empty-product-list-text"
            accessibilityLabel={t('productTable.empty', 'No hay productos disponibles en este momento')}
          >
            {t('productTable.empty', 'No hay productos disponibles')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={refreshControl}
          testID="product-list"
          accessibilityLabel={t('productTable.listLabel', 'Lista de productos disponibles')}
        />
      )}
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
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
    fontSize: 11,
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
    fontSize: 14,
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
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.expandableDetailLabel,
    width: 100,
    marginRight: 15
  },
  detailValue: {
    fontSize: 15,
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
  detailButtonText: {
    color: colors.buttonText,
    fontSize: 8,
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
    fontSize: 13,
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
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});

export default ProductTable;
