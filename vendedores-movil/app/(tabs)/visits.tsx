import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import { fetchScheduledVisits, Visit } from '@/services/api/clientsService';
import VisitsTable from '@/components/VisitsTable';

export default function VisitsScreen() {
  const { t } = useTranslation();

  const sellerInfo = useAuth();
  const router = useRouter();

  // API data
  const [todayVisits, setTodayVisits] = useState<Visit[]>([]);
  const [scheduleVisits, setScheduleVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!sellerInfo || !sellerInfo.vendedorData?.id) {
        return;
      }
      setError(null);

      const visitsData = await fetchScheduledVisits(sellerInfo.vendedorData.id);
      /* const visitsData = [
        {
          cliente_id: '4c6f0e25-c341-4f9d-a2f7-926502458366',
          estado: 'programada',
          fecha: '2025-05-12T10:00:00',
          id: 2,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
          cliente_nombre: 'a',
        },
        {
          cliente_id: '7fb7d6f6-c851-424c-873e-07be28dc6554',
          estado: 'programada',
          fecha: '2025-05-15T08:10:00',
          cliente_nombre: 'b',
          id: 8,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
        },
        {
          cliente_id: '7fb7d6f6-c851-424c-873e-07be28dc6554',
          estado: 'programada',
          fecha: '2025-05-15T08:11:00',
          cliente_nombre: 'c',
          id: 6,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
        },
        {
          cliente_id: '7fb7d6f6-c851-424c-873e-07be28dc6554',
          estado: 'programada',
          fecha: '2025-05-15T08:12:00',
          cliente_nombre: 'd',
          id: 7,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
        },
        {
          cliente_id: '7fb7d6f6-c851-424c-873e-07be28dc6554',
          estado: 'programada',
          fecha: '2025-05-20T20:12:00',
          cliente_nombre: 'e',
          id: 4,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
        },
        {
          cliente_id: '7fb7d6f6-c851-424c-873e-07be28dc6554',
          estado: 'programada',
          fecha: '2025-05-21T11:30:00',
          cliente_nombre: 'f',
          id: 5,
          vendedor_id: 'fed9bb62-9760-4d6e-9b52-ea8c37105a80',
        },
      ]; */

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      function formatDate(date: Date) {
        return date.toISOString().slice(0, 10);
      }

      const formattedToday = formatDate(today);
      const formattedTomorrow = formatDate(tomorrow);

      const filtered = visitsData.filter((visit) => {
        const date = visit.fecha.slice(0, 10);
        return date === formattedToday || date === formattedTomorrow;
      });

      filtered.sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

      const todayVisits = filtered.filter(
        (visit) => visit.fecha.slice(0, 10) === formattedToday
      );
      const scheduleVisits = filtered.filter(
        (visit) => visit.fecha.slice(0, 10) === formattedTomorrow
      );

      setTodayVisits(todayVisits);
      setScheduleVisits(scheduleVisits);
    } catch (err) {
      setError(
        t(
          'visits.loadError',
          'No se pudieron cargar las rutas, intente de nuevo.'
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
    if (sellerInfo && sellerInfo.vendedorData?.id) {
      fetchData(true);
    }
  }, [sellerInfo]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator
          message={t('visits.loading', 'Cargando visitas programadas...')}
        />
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
          <Text style={styles.title}>
            {t('visits.title', 'Rutas de Visita')}
          </Text>
        </View>
        <View style={styles.tableWrapper}>
          <VisitsTable
            visits={todayVisits}
            title="TODAY"
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
        <VisitsTable
          visits={scheduleVisits}
          title="TOMORROW"
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.light.titleText,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.light.primary,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.backgroundLogin,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tabActiveBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.light.titleText,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 2,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    opacity: 0.6,
  },
  tableWrapper: {
    marginBottom: 20,
  },
});
