import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import { fetchScheduledVisits, Visit } from '@/services/api/clientsService';
import VisitsTable from '@/components/VisitsTable';

export default function VisitsScreen() {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

  const sellerInfo = useAuth();

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

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tableWrapper: {
      marginBottom: 20,
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
        fontSize: fontSizes.xxl,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: colors.titleText,
    },
    content: {
        paddingHorizontal: 16,
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: fontSizes.lg,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.primary,
        marginBottom: 12,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.backgroundLogin,
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
        backgroundColor: colors.tabActiveBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: colors.titleText,
    },
    optionDescription: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
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
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
        opacity: 0.6,
    },
});
