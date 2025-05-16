<<<<<<< HEAD
import React, { useMemo } from 'react';
=======
import React from 'react';
>>>>>>> main
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  UIManager,
  RefreshControlProps,
} from 'react-native';
<<<<<<< HEAD
import { Visit } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';
import { getLocaleFromLanguage } from '../utils/localeUtils';
import { useTheme } from '../contexts/ThemeContext';
=======
import { Colors } from '../constants/Colors';
import { Visit } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';
import { getLocaleFromLanguage } from '../utils/localeUtils';
>>>>>>> main

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
<<<<<<< HEAD
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
=======
>>>>>>> main

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

<<<<<<< HEAD
const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLogin,
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
>>>>>>> main
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: colors.tableBorder,
  },
  header: {
    backgroundColor: colors.primary,
=======
    borderColor: '#f0f0f0',
  },
  header: {
    backgroundColor: Colors.light.primary,
>>>>>>> main
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
<<<<<<< HEAD
    color: colors.tableHeaderText,
    fontSize: fontSizes.xxs,
=======
    color: Colors.light.tableHeaderText,
    fontSize: 11,
>>>>>>> main
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  listContent: {
    paddingBottom: 8,
  },
  visitContainer: {
    borderBottomWidth: 1,
<<<<<<< HEAD
    borderBottomColor: colors.tableBorder,
=======
    borderBottomColor: '#f0f0f0',
>>>>>>> main
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  visitDate: {
<<<<<<< HEAD
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    paddingVertical: 4,
=======
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    paddingVertical: 4,
  
>>>>>>> main
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
<<<<<<< HEAD
    fontSize: fontSizes.sm,
    color: colors.text,
=======
    fontSize: 14,
    color: Colors.light.text,
>>>>>>> main
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});

export default PlannedVisitsTable;
