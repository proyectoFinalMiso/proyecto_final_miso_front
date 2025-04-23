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
import { useCart } from '../contexts/CartContext';


if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


export type Product = {
  id: string;
  name: string;
  price: number;
  sku: number
};

type ProductTableProps = {
  products: Product[];
  onProductPress?: (product: Product) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

const ProductTable = ({ products, onProductPress, refreshControl }: ProductTableProps) => {
  const { addToCart } = useCart();
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
              color={Colors.light.text}
              accessibilityLabel={isExpanded ? "Contraer detalles" : "Expandir detalles"}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor Unitario</Text>
              <Text style={styles.detailValue}>${item.price.toFixed(0)} COP</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cantidad</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item.id)}
                  testID={`decrease-quantity-button-${item.id}`}
                  accessibilityLabel={`Disminuir cantidad para ${item.name}`}
                >
                  <Ionicons name="remove" size={12} color={Colors.light.text} />
                </TouchableOpacity>
                <Text
                  style={styles.quantityText}
                  testID={`quantity-text-${item.id}`}
                  accessibilityLabel={`Cantidad actual ${quantity}`}
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.id)}
                  testID={`increase-quantity-button-${item.id}`}
                  accessibilityLabel={`Aumentar cantidad para ${item.name}`}
                >
                  <Ionicons name="add" size={12} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Acción</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleAddToCart(item, quantity)}
                testID={`add-to-cart-button-${item.id}`}
                accessibilityLabel={`Agregar ${quantity} de ${item.name} al carrito`}
              >
                <Ionicons name="add" size={8} color={Colors.light.buttonText} />
                <Text style={styles.detailButtonText}>Agregar al carrito</Text>
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
        <Text style={styles.headerText}>Productos</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={styles.emptyText}
            testID="empty-product-list-text"
            accessibilityLabel="No hay productos disponibles en este momento"
          >
            No hay productos disponibles
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
          accessibilityLabel="Lista de productos disponibles"
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
  productContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productRow: {
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
  productName: {
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
  detailButton: {
    backgroundColor: Colors.light.button,
    borderRadius: 69,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    color: Colors.light.buttonText,
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
    borderColor: Colors.light.expandableQuantityButtonBorder,
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
    color: Colors.light.text,
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.expandableQuantityButtonBorder,
    borderRightWidth: 1,
    borderRightColor: Colors.light.expandableQuantityButtonBorder,
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

export default ProductTable;
