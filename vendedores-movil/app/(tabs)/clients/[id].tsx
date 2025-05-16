import { Cliente, fetchClientById, fetchPastVisits, Visit } from '../../../services/api/clientsService';
import { useAuth } from '../../../contexts/AuthContext';
import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import PlannedVisitsTable from '../../../components/PastVisitsTable';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import RegisterVisitModal from '../../../components/RegisterVisitModal';
import VideoUploadModal from '@/components/VideoUploadModal';

const ClientDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const sellerInfo = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
  // API data
  const [client, setClient] = useState<Cliente>();
  const [plannedVisits, setPlannedVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showVisitModal, setShowVisitModal] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const fetchData = useCallback(async (isRefreshingPull = false) => {
    try {
      if (!sellerInfo || !sellerInfo.vendedorData?.id) {
        return;
      }
      setError(null);

      setIsLoading(true);

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

  const handleVideoUpload = () => {
    setShowVideoModal(true);
  };

  const handleVideoUploadSuccess = () => {
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
              <Ionicons name="arrow-back" size={24} color={colors.text} />
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
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.visitButtonStyle]}
                onPress={handleRegisterVisit}
                testID="register-visit-button"
                accessibilityLabel={t('clientDetails.registerVisit', 'Registrar Visita')}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={24} 
                  color={colors.buttonText} 
                  style={styles.actionButtonIcon}
                />
                <Text style={styles.actionButtonText}>
                  {t('clientDetails.registerVisit', 'Registrar Visita')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.videoButtonStyle]}
                onPress={handleVideoUpload}
                testID="upload-video-button"
                accessibilityLabel={t('clientDetails.uploadVideo', 'Solicitar Recomendación')}
              >
                <Ionicons 
                  name="videocam-outline" 
                  size={24} 
                  color={colors.buttonText} 
                  style={styles.actionButtonIcon}
                />
                <Text style={styles.actionButtonText}>
                  {t('clientDetails.uploadVideo', 'Recomendar')}
                </Text>
              </TouchableOpacity>
            </View>
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

      {client && sellerInfo?.vendedorData?.id && (
        <VideoUploadModal
          visible={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          clientId={client.id}
          vendedorId={sellerInfo.vendedorData.id}
          onSuccess={handleVideoUploadSuccess}
          clientEmail={client.correo}
          vendedorEmail={sellerInfo.vendedorData.email}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.backgroundLogin,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '600',
    color: colors.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    flex: 1,
  },
  clientCard: {
    backgroundColor: colors.backgroundLogin,
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
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  registerVisitButton: {
    backgroundColor: colors.button,
    borderRadius: 69,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  registerVisitText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.primary,
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
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-evenly',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    width: '45%',
  },
  visitButtonStyle: {
    backgroundColor: colors.button,
  },
  videoButtonStyle: {
    backgroundColor: colors.button,
  },
  actionButtonIcon: {
    marginBottom: 4,
  },
  actionButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'center',
  },
});

export default ClientDetailsScreen;
