import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  UIManager,
  RefreshControlProps,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Cliente } from '../services/api/clientsService';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type ProductTableProps = {
  clients: Cliente[];
  onProductPress?: (client: Cliente) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

const ClientTable = ({
  clients,
  onProductPress,
  refreshControl,
}: ProductTableProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const toggleExpand = (productId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
  const renderProduct = ({ item }: { item: Cliente }) => {
    const isExpanded = expandedItems.has(item.id);
    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          style={styles.productRow}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.productName}>{item.nombre}</Text>
          <View style={styles.chevronIconContainer}>
            <Ionicons
              name={isExpanded ? 'eye' : 'eye-off'}
              size={20}
              color={Colors.light.text}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre:</Text>
              <Text style={styles.detailValue}>{item.nombre}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Correo:</Text>
              <Text style={styles.detailValue}>{item.correo}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Clientes</Text>
      </View>

      {clients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay Clientes disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
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
    marginRight: 15,
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

export default ClientTable;
