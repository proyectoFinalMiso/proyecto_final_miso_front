import { Cliente, fetchClients } from '../../services/api/clientsService';
import { useAuth } from '../../contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay';
import ClientTable from '../../components/ClientsTable';

const ClientsScreen = () => {
  const sellerInfo = useAuth();
  // API data
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //UI
  const [searchText, setSearchText] = useState<string>('');

  const filteredClients = clients.filter((client) => {
    const search = searchText.toLowerCase();
    return (
      client.nombre.toLowerCase().includes(search) ||
      client.correo.toLowerCase().includes(search)
    );
  });

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!sellerInfo || !sellerInfo.vendedorData?.id) {
        return;
      }
      setError(null);

      const clientsData = await fetchClients(sellerInfo.vendedorData.id);
      setClients(clientsData);
    } catch (err) {
      setError(
        'No se pudieron cargar los Clientes relacionados al vendedor. Por favor intente de nuevo.'
      );
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
    console.log(sellerInfo, sellerInfo.vendedorData?.id);
    if (sellerInfo && sellerInfo.vendedorData?.id) {
      fetchData(true);
    }
  }, [sellerInfo]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Cargando clientes..." />
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
          <Text style={styles.title}>Clientes</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Busca clientes..."
              placeholderTextColor={Colors.light.searchHint}
              value={searchText}
              onChangeText={setSearchText}
              accessibilityLabel="Buscar clientes"
              accessibilityHint="Ingresa el nombre del cliente que buscas"
            />
            <TouchableOpacity
              style={[styles.filterButton]}
              accessibilityLabel="Filtrar clientes"
              accessibilityHint="Abre el modal de filtrado"
            >
              <Ionicons
                name="filter-outline"
                size={22}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ClientTable
          clients={filteredClients}
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
    </SafeAreaView>
  );
};

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
  lastUpdatedText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_400Regular',
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

export default ClientsScreen;
