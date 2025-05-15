import { Cliente, fetchClients } from '../../services/api/clientsService';
import { useAuth } from '../../contexts/AuthContext';
import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay';
import ClientTable from '../../components/ClientsTable';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

const ClientsScreen = () => {
  const sellerInfo = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
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
        t(
          'clients.loadError',
          'No se pudieron cargar los clientes. Por favor intente de nuevo.'
        )
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
        <LoadingIndicator message={t('clients.loading', 'Cargando clientes...')} />
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
          <Text style={styles.title}>{t('clients.title', 'Mis clientes')}</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('clients.search', 'Buscar clientes')}
              placeholderTextColor={colors.searchHint}
              value={searchText}
              onChangeText={setSearchText}
              testID="searchInput"
              accessibilityLabel={t('clients.search', 'Buscar clientes')}
              accessibilityHint={t('clients.searchHint', 'Ingresa el nombre del cliente que buscas')}
            />
          </View>
        </View>
        <ClientTable
          clients={filteredClients}
          onClientPress={(client) => router.push(`/clients/${client.id}`)}
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
    </SafeAreaView>
  );
};

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

export default ClientsScreen;
