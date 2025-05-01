import { Stack } from 'expo-router';
import { Cliente, fetchClientById, fetchPlannedVisits, Visit } from '../../../services/api/clientsService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import PlannedVisitsTable from '../../../components/PlannedVisitsTable';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const ClientDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const sellerInfo = useAuth();
  const { t } = useTranslation();
  // API data
  const [client, setClient] = useState<Cliente>();
  const [plannedVisits, setPlannedVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!sellerInfo || !sellerInfo.vendedorData?.id) {
        return;
      }
      setError(null);

      const clientData = await fetchClientById(id as string);
      setClient(clientData.cliente);
      const visits = await fetchPlannedVisits(id as string);
      setPlannedVisits(visits);
    } catch (err) {
      setError(
        t(
          'clientDetails.loadError',
          'No se pudieron cargar los detalles del cliente. Por favor intente de nuevo.'
        )
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id, sellerInfo, t]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    setClient(undefined);
    setPlannedVisits([]);
    setIsLoading(true);
    if (sellerInfo && sellerInfo.vendedorData?.id) {
      fetchData(true);
    }
  }, [id, sellerInfo, fetchData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message={t('clientDetails.loading', 'Cargando detalles del cliente...')} />
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

  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorDisplay onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('clientDetails.title', 'Detalles del cliente')}</Text>
          <Text style={styles.title}>{client.nombre}</Text>
        </View>
        <PlannedVisitsTable
          visits={plannedVisits}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
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
  content: {
    padding: 16,
    flexGrow: 1,
  },
  visitsSection: {
    marginTop: 24,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClientDetailsScreen;
