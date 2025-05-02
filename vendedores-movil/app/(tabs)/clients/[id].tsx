import { Cliente, fetchClientById, fetchPastVisits, Visit } from '../../../services/api/clientsService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import PlannedVisitsTable from '../../../components/PastVisitsTable';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import RegisterVisitModal from '../../../components/RegisterVisitModal';

const ClientDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const sellerInfo = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  // API data
  const [client, setClient] = useState<Cliente>();
  const [plannedVisits, setPlannedVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showVisitModal, setShowVisitModal] = useState<boolean>(false);

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!sellerInfo || !sellerInfo.vendedorData?.id) {
        return;
      }
      setError(null);

      const clientData = await fetchClientById(id as string);
      setClient(clientData.cliente);
      const visits = await fetchPastVisits(id as string);
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

  const handleRegisterVisit = () => {
    setShowVisitModal(true);
  };

  const handleVisitSuccess = () => {
    fetchData();
  };

  const handleGoBack = () => {
    router.push('/(tabs)/clients');
  };

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
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              testID="back-button"
              accessibilityLabel={t('common.back', 'Volver')}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('clientDetails.title', 'Detalles del cliente')}</Text>
          </View>
          
          <View style={styles.clientCard}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.nombre}</Text>
              {client.correo && (
                <Text style={styles.clientEmail}>{client.correo}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.registerVisitButton}
              onPress={handleRegisterVisit}
              testID="register-visit-button"
              accessibilityLabel={t('clientDetails.registerVisit', 'Registrar Visita')}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.light.buttonText} />
              <Text style={styles.registerVisitText}>
                {t('clientDetails.registerVisit', 'Registrar Visita')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>{t('clientDetails.pastVisits', 'Visitas Pasadas')}</Text>
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
      
      {client && sellerInfo?.vendedorData?.id && (
        <RegisterVisitModal 
          visible={showVisitModal}
          onClose={() => setShowVisitModal(false)}
          clientId={client.id}
          vendedorId={sellerInfo.vendedorData.id}
          clientName={client.nombre}
          onSuccess={handleVisitSuccess}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundLogin,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    flex: 1,
  },
  clientCard: {
    backgroundColor: Colors.light.backgroundLogin,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  clientInfo: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  registerVisitButton: {
    backgroundColor: Colors.light.button,
    borderRadius: 69,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  registerVisitText: {
    color: Colors.light.buttonText,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 12,
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
