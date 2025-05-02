import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  UIManager,
  RefreshControlProps,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Visit } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';
import { getLocaleFromLanguage } from '../utils/localeUtils';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type PlannedVisitsTableProps = {
  visits: Visit[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

const PlannedVisitsTable = ({ visits, refreshControl }: PlannedVisitsTableProps) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = getLocaleFromLanguage(i18n.language);
    return date.toLocaleString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
    
  const renderVisit = ({ item }: { item: Visit }) => (
    <View style={styles.visitContainer}>
      <Text style={styles.visitDate}>{formatDate(item.fecha)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID="planned-visits-title">
          {t('pastVisits.title', 'Visitas')}
        </Text>
      </View>
      {visits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText} testID="empty-planned-visits">
            {t('pastVisits.empty', 'No se encontraron visitas completadas para este cliente')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          renderItem={renderVisit}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={refreshControl}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: Colors.light.tableHeaderText,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  listContent: {
    paddingBottom: 8,
  },
  visitContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  visitDate: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    paddingVertical: 4,
  
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});

export default PlannedVisitsTable;
