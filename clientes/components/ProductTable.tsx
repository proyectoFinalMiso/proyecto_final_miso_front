import React, { useState } from 'react';
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
import { Colors } from '../constants/Colors';



if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


export type Product = {
  id: string;
  name: string;
  price: number;
};

type ProductTableProps = {
  products: Product[];
  onProductPress?: (product: Product) => void;
};

const ProductTable = ({ products, onProductPress }: ProductTableProps) => {
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
    console.log(product, quantity);
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
        >
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.chevronIconContainer}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.light.text}
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
                >
                  <Ionicons name="remove" size={12} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.id)}
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
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
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
