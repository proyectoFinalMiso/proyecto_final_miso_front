import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FilterOrdersModal from '../../components/FilterOrdersModal';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay';
import { fetchClientOrders, Order } from '../../services/api/orderService';
import { useAuth } from '../../contexts/AuthContext';
import OrderTable from '../../components/OrderTable';

const AUTO_REFRESH_INTERVAL = 30000;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OrdersScreen() {
  const { clienteId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{ min: number | null, max: number | null }>({ min: null, max: null });
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
  const [tempDateRange, setTempDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

  const parseDateString = (dateString: string): Date | null => {
    if (!dateString || dateString.trim() === '') return null;

    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return date;
  };

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!isRefreshingPull) {
        setIsLoading(true);
      }
      setError(null);

      if (!clienteId) {
        throw new Error('No se encontró el ID del cliente');
      }

      const response = await fetchClientOrders(clienteId);
      setOrders(response.pedidos);
      setLastUpdated(new Date());
    } catch (err) {
      setError('No se pudieron cargar los pedidos. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [clienteId]);

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

  const openFilterModal = () => {
    setTempPriceRange({
      min: priceRange.min !== null ? priceRange.min.toString() : '',
      max: priceRange.max !== null ? priceRange.max.toString() : ''
    });
    setTempDateRange({
      start: dateRange.start ? dateRange.start.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
      end: dateRange.end ? dateRange.end.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
    });
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    const min = tempPriceRange.min.trim() === '' ? null : Number(tempPriceRange.min);
    const max = tempPriceRange.max.trim() === '' ? null : Number(tempPriceRange.max);

    if (min !== null && max !== null && min > max) {
      alert("El valor mínimo no puede ser mayor que el valor máximo.");
      return;
    }

    setPriceRange({ min, max });

    const startDate = parseDateString(tempDateRange.start);
    const endDate = parseDateString(tempDateRange.end);

    if (startDate && endDate && startDate > endDate) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return;
    }

    setDateRange({ start: startDate, end: endDate });
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setPriceRange({ min: null, max: null });
    setDateRange({ start: null, end: null });
    setTempPriceRange({ min: '', max: '' });
    setTempDateRange({ start: '', end: '' });
    setShowFilterModal(false);
  };

  const handleTempPriceChange = (field: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setTempPriceRange(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleTempDateChange = (field: 'start' | 'end', value: string) => {
    setTempDateRange(prev => ({ ...prev, [field]: value }));
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchesSearch = order.direccion.toLowerCase().includes(searchText.toLowerCase());

    const matchesMinPrice = priceRange.min === null || order.valorFactura >= priceRange.min;
    const matchesMaxPrice = priceRange.max === null || order.valorFactura <= priceRange.max;

    const orderDate = new Date(order.fechaIngreso);
    const matchesStartDate = dateRange.start === null || orderDate >= dateRange.start;
    const matchesEndDate = dateRange.end === null || orderDate <= dateRange.end;

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStartDate && matchesEndDate;
  }), [orders, searchText, priceRange, dateRange]);

  const hasActiveFilters = priceRange.min !== null || priceRange.max !== null || dateRange.start !== null || dateRange.end !== null;

  const formattedLastUpdated = lastUpdated
    ? `Última actualización: ${lastUpdated.toLocaleTimeString()}`
    : '';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Cargando pedidos..." />
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
          <Text style={styles.title}>Mis pedidos</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdatedText}>{formattedLastUpdated}</Text>
          )}
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Busca por dirección..."
              placeholderTextColor={Colors.light.searchHint}
              value={searchText}
              onChangeText={setSearchText}
              accessibilityLabel="Buscar pedidos"
              accessibilityHint="Ingresa la dirección del pedido que buscas"
            />
            <TouchableOpacity
              style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
              onPress={openFilterModal}
              accessibilityLabel="Filtrar pedidos"
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
                {priceRange.min !== null && ` Valor mín: $${priceRange.min}`}
                {priceRange.max !== null && ` Valor máx: $${priceRange.max}`}
                {dateRange.start !== null && ` Desde: ${dateRange.start.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                {dateRange.end !== null && ` Hasta: ${dateRange.end.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
              </Text>
              <TouchableOpacity onPress={clearFilters}>
                <Ionicons name="close-circle" size={18} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <OrderTable
          orders={filteredOrders}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
        />
      </View>

      <FilterOrdersModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        tempPriceRange={tempPriceRange}
        tempDateRange={tempDateRange}
        onTempPriceChange={handleTempPriceChange}
        onTempDateChange={handleTempDateChange}
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
  content: {
    padding: 16,
    flex: 1,
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
  lastUpdatedText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_400Regular',
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
