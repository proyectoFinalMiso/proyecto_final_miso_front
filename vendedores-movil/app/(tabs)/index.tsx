import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import ProductTable, { Product } from '../../components/ProductTable';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../components/FilterProductsModal';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay';
import { fetchAvailableInventory, mapInventoryToProducts } from '../../services/api/inventoryService';
import { useTranslation } from 'react-i18next';

const AUTO_REFRESH_INTERVAL = 30000;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  // API data
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // UI
  const [searchText, setSearchText] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{ min: number | null, max: number | null }>({ min: null, max: null });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!isRefreshingPull) {
        setIsLoading(true);
      }
      setError(null);

      // cantidadDisponible > 0
      const inventoryData = await fetchAvailableInventory();

      const mappedProducts = mapInventoryToProducts(inventoryData);

      setProducts(mappedProducts);
      setLastUpdated(new Date());
    } catch (err) {
      setError(t('home.loadError', 'No se pudieron cargar los productos. Por favor intente de nuevo.'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchData]);

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
      alert(t('home.priceRangeError', 'El precio mínimo no puede ser mayor que el precio máximo.'));
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

  const formattedLastUpdated = lastUpdated
    ? t('home.lastUpdated', { time: lastUpdated.toLocaleTimeString() })
    : '';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message={t('home.loading', 'Cargando productos...')} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorDisplay message={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} testID="homeScreenTitle" accessibilityLabel='homeScreenTitle'>{t('home.title')}</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdatedText} testID='last-updated-text' accessibilityLabel='last-updated-text'>{formattedLastUpdated}</Text>
          )}
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('home.searchProducts')}
              placeholderTextColor={colors.searchHint}
              value={searchText}
              onChangeText={setSearchText}
              testID='searchInput'
              accessibilityLabel={t('common.search')}
              accessibilityHint={t('home.searchHint', 'Ingresa el nombre del producto que buscas')}
            />
            <TouchableOpacity
              style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
              onPress={openFilterModal}
              testID='filterButton'
              accessibilityLabel={t('home.filterProducts', 'Filtrar productos')}
              accessibilityHint={t('home.filterHint', 'Abre el modal de filtrado')}
            >
              <Ionicons
                name="filter-outline"
                size={22}
                color={hasActiveFilters ? colors.buttonText : colors.text}
              />
            </TouchableOpacity>
          </View>
          {hasActiveFilters && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersText}>
                {t('home.filters')}
                {priceRange.min !== null && ` ${t('products.minPrice', 'Precio mín')}: $${priceRange.min}`}
                {priceRange.max !== null && ` ${t('products.maxPrice', 'Precio máx')}: $${priceRange.max}`}
              </Text>
              <TouchableOpacity onPress={clearFilters} accessibilityLabel={t('home.clearFilters', 'Limpiar filtros')} testID='clearFiltersButton'>
                <Ionicons name="close-circle" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <ProductTable
          products={filteredProducts}
          onProductPress={handleProductPress}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  lastUpdatedText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text,
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
    borderColor: colors.borderWidget,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundLogin,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: colors.backgroundLogin,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: colors.borderWidget,
  },
  filterButtonActive: {
    backgroundColor: colors.button,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.backgroundLogin,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: colors.borderWidget,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
