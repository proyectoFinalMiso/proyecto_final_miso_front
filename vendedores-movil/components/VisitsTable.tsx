import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  UIManager,
  RefreshControlProps,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Visit } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type VisitsTableProps = {
  visits: Visit[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  title: string;
};

const VisitsTable = ({ visits, refreshControl, title }: VisitsTableProps) => {
  const { t } = useTranslation();

  const isToday = title === 'TODAY';

  const renderVisit = ({ item }: { item: Visit }) => {
    return (
      <View style={styles.clientContainer}>
        <TouchableOpacity
          style={styles.clientRow}
          activeOpacity={0.7}
          testID={`visit-${item.id}`}
        >
          <Text style={styles.clientName}>{item.cliente_nombre}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID="visit-title">
          {isToday
            ? t('visitsTable.todayTitle', 'Hoy')
            : t('visitsTable.tomorrowTitle', 'Mañana')}
        </Text>
      </View>
      {visits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText} testID="empty-visits">
            {isToday
              ? t(
                  'visitsTable.noTodayVisits',
                  'No tienes visitas programadas para hoy'
                )
              : t(
                  'visitsTable.noTomorrowVisits',
                  'No tienes visitas programadas para mañana'
                )}
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
  clientContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  eyeIconContainer: {
    backgroundColor: Colors.light.expandableButtonBackground,
    padding: 2,
    borderRadius: 8,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  expandedContent: {
    backgroundColor: Colors.light.backgroundLogin,
    paddingVertical: 6,
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.expandableDetailLabel,
    width: 100,
    marginRight: 15,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.light.expandableDetailValue,
    flex: 1,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  detailButton: {
    backgroundColor: Colors.light.button,
    borderRadius: 69,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    color: Colors.light.buttonText,
    fontSize: 8,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.expandableQuantityButtonBorder,
  },
  quantityButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.expandableQuantityButtonBorder,
    borderRightWidth: 1,
    borderRightColor: Colors.light.expandableQuantityButtonBorder,
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

export default VisitsTable;
