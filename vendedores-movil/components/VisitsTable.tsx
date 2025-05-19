import React, { useMemo } from 'react';
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
import { Visit } from '../services/api/clientsService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type VisitsTableProps = {
  visits: Visit[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  title: 'TODAY' | 'TOMORROW';
};

const VisitsTable = ({ visits, refreshControl, title }: VisitsTableProps) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

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
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={refreshControl}
        />
      )}
    </View>
  );
};

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLogin,
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.tableBorder,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: colors.tableHeaderText,
    fontSize: fontSizes.xxs,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  listContent: {
    paddingBottom: 8,
  },
  clientContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.tableBorder,
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  eyeIconContainer: {
    backgroundColor: colors.expandableButtonBackground,
    padding: 2,
    borderRadius: 8,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientName: {
    fontSize: fontSizes.sm,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  expandedContent: {
    backgroundColor: colors.backgroundLogin,
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
    fontSize: fontSizes.smd,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.expandableDetailLabel,
    width: 100,
    marginRight: 15,
  },
  detailValue: {
    fontSize: fontSizes.smd,
    color: colors.expandableDetailValue,
    flex: 1,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  detailButton: {
    backgroundColor: colors.button,
    borderRadius: 69,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxxs,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.expandableQuantityButtonBorder,
  },
  quantityButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: fontSizes.xsPlus,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
    borderLeftWidth: 1,
    borderLeftColor: colors.expandableQuantityButtonBorder,
    borderRightWidth: 1,
    borderRightColor: colors.expandableQuantityButtonBorder,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});


export default VisitsTable;