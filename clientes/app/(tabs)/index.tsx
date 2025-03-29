import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import ProductTable, { Product } from '../../components/ProductTable';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../components/FilterProductsModal';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop HP Pavilion',
    price: 1200,
  },
  {
    id: '2',
    name: 'Monitor LG 27"',
    price: 350,
  },
  {
    id: '3',
    name: 'Teclado mecánico RGB',
    price: 120,
  },
  {
    id: '4',
    name: 'Mouse inalámbrico Logitech',
    price: 45,
  },
];

export default function HomeScreen() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{ min: number | null, max: number | null }>({ min: null, max: null });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });

  const handleProductPress = (product: Product) => {
    console.log('Producto seleccionado:', product);
  };

  const openFilterModal = () => {
    setTempPriceRange({
      min: priceRange.min !== null ? priceRange.min.toString() : '',
      max: priceRange.max !== null ? priceRange.max.toString() : ''
    });
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    const min = tempPriceRange.min.trim() === '' ? null : Number(tempPriceRange.min);
    const max = tempPriceRange.max.trim() === '' ? null : Number(tempPriceRange.max);

    if (min !== null && max !== null && min > max) {
      alert("El precio mínimo no puede ser mayor que el precio máximo.");
      return;
    }

    setPriceRange({
      min: tempPriceRange.min ? Number(tempPriceRange.min) : null,
      max: tempPriceRange.max ? Number(tempPriceRange.max) : null
    });
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setPriceRange({ min: null, max: null });
    setTempPriceRange({ min: '', max: '' });
    setShowFilterModal(false);
  };

  const handleTempPriceChange = (field: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setTempPriceRange(prev => ({ ...prev, [field]: numericValue }));
  };

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());

    const matchesMinPrice = priceRange.min === null || product.price >= priceRange.min;
    const matchesMaxPrice = priceRange.max === null || product.price <= priceRange.max;

    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  }), [products, searchText, priceRange]);

  const hasActiveFilters = priceRange.min !== null || priceRange.max !== null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ordena lo que gustes</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Busca productos..."
              placeholderTextColor={Colors.light.searchHint}
              value={searchText}
              onChangeText={setSearchText}
              accessibilityLabel="Buscar productos"
              accessibilityHint="Ingresa el nombre del producto que buscas"
            />
            <TouchableOpacity
              style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
              onPress={openFilterModal}
              accessibilityLabel="Filtrar productos"
              accessibilityHint="Abre el modal de filtrado"
            >
              <Ionicons
                name="filter-outline"
                size={22}
                color={hasActiveFilters ? Colors.light.buttonText : Colors.light.text}
              />
            </TouchableOpacity>
          </View>
          {hasActiveFilters && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersText}>
                Filtros activos:
                {priceRange.min !== null && ` Precio mín: $${priceRange.min}`}
                {priceRange.max !== null && ` Precio máx: $${priceRange.max}`}
              </Text>
              <TouchableOpacity onPress={clearFilters}>
                <Ionicons name="close-circle" size={18} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <ProductTable
          products={filteredProducts}
          onProductPress={handleProductPress}
        />
      </View>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        tempPriceRange={tempPriceRange}
        onTempPriceChange={handleTempPriceChange}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 0.8,
    borderColor: Colors.light.borderWidget,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.backgroundLogin,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: Colors.light.backgroundLogin,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: Colors.light.borderWidget,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.button,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.light.backgroundLogin,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.light.borderWidget,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
}); 
