import { Cliente, fetchClients } from '../../services/api/clientsService';
import { useAuth } from '../../contexts/AuthContext';
<<<<<<< HEAD
import { useCallback, useEffect, useState, useMemo } from 'react';
=======
import { useCallback, useEffect, useState } from 'react';
>>>>>>> main
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
<<<<<<< HEAD
=======
import { Colors } from '../../constants/Colors';
>>>>>>> main
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay';
import ClientTable from '../../components/ClientsTable';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { useTheme } from '../../contexts/ThemeContext';
=======
>>>>>>> main

const ClientsScreen = () => {
  const sellerInfo = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
<<<<<<< HEAD
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
=======
>>>>>>> main
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
<<<<<<< HEAD
              placeholderTextColor={colors.searchHint}
=======
              placeholderTextColor={Colors.light.searchHint}
>>>>>>> main
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
<<<<<<< HEAD
              colors={[colors.primary]}
              tintColor={colors.primary}
=======
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
>>>>>>> main
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

<<<<<<< HEAD
const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
>>>>>>> main
  },
  header: {
    marginBottom: 20,
  },
  title: {
<<<<<<< HEAD
    fontSize: fontSizes.xxl,
    fontWeight: '600',
    color: colors.titleText,
=======
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.titleText,
>>>>>>> main
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  lastUpdatedText: {
    marginTop: 4,
<<<<<<< HEAD
    fontSize: fontSizes.xs,
    color: colors.text,
=======
    fontSize: 12,
    color: Colors.light.text,
>>>>>>> main
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  placeholder: {
<<<<<<< HEAD
    fontSize: fontSizes.md,
    color: colors.text,
=======
    fontSize: 16,
    color: Colors.light.text,
>>>>>>> main
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
<<<<<<< HEAD
    borderColor: colors.borderWidget,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundLogin,
    fontSize: fontSizes.md,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
=======
    borderColor: Colors.light.borderWidget,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.backgroundLogin,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
>>>>>>> main
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
<<<<<<< HEAD
    backgroundColor: colors.backgroundLogin,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: colors.borderWidget,
  },
  filterButtonActive: {
    backgroundColor: colors.button,
=======
    backgroundColor: Colors.light.backgroundLogin,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: Colors.light.borderWidget,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.button,
>>>>>>> main
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
<<<<<<< HEAD
    backgroundColor: colors.backgroundLogin,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: colors.borderWidget,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: fontSizes.xs,
    color: colors.text,
=======
    backgroundColor: Colors.light.backgroundLogin,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.light.borderWidget,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.text,
>>>>>>> main
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});

export default ClientsScreen;
