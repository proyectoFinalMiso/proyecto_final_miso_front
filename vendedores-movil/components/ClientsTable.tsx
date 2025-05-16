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
<<<<<<< HEAD
import { Cliente } from '../services/api/clientsService';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMemo } from 'react';
=======
import { Colors } from '../constants/Colors';
import { Cliente } from '../services/api/clientsService';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
>>>>>>> main

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type ClientTableProps = {
  clients: Cliente[];
  onClientPress?: (client: Cliente) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

const ClientTable = ({
  clients,
  onClientPress,
  refreshControl,
}: ClientTableProps) => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

=======
>>>>>>> main
  const renderClient = ({ item }: { item: Cliente }) => {
    return (
      <View style={styles.clientContainer}>
        <TouchableOpacity
          style={styles.clientRow}
          onPress={() => onClientPress && onClientPress(item)}
          activeOpacity={0.7}
          testID={`client-${item.id}`}
        >
          <Text style={styles.clientName}>{item.nombre}</Text>
          <View style={styles.eyeIconContainer}>
            <Ionicons
              name="eye-outline"
              size={20}
<<<<<<< HEAD
              color={colors.text}
=======
              color={Colors.light.text}
>>>>>>> main
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID='clients-title'>{t('clientsModal.clients', 'Clientes')}</Text>
      </View>
      {clients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText} testID='empty-clients'>{t('clientsModal.empty', 'No tienes clientes asignados')}</Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
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
  clientContainer: {
    borderBottomWidth: 1,
<<<<<<< HEAD
    borderBottomColor: colors.tableBorder,
=======
    borderBottomColor: '#f0f0f0',
>>>>>>> main
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  eyeIconContainer: {
<<<<<<< HEAD
    backgroundColor: colors.expandableButtonBackground,
=======
    backgroundColor: Colors.light.expandableButtonBackground,
>>>>>>> main
    padding: 2,
    borderRadius: 8,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientName: {
<<<<<<< HEAD
    fontSize: fontSizes.sm,
    color: colors.text,
=======
    fontSize: 14,
    color: Colors.light.text,
>>>>>>> main
    flex: 1,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  expandedContent: {
<<<<<<< HEAD
    backgroundColor: colors.backgroundLogin,
=======
    backgroundColor: Colors.light.backgroundLogin,
>>>>>>> main
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
<<<<<<< HEAD
    fontSize: fontSizes.smd,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.expandableDetailLabel,
=======
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.expandableDetailLabel,
>>>>>>> main
    width: 100,
    marginRight: 15,
  },
  detailValue: {
<<<<<<< HEAD
    fontSize: fontSizes.smd,
    color: colors.expandableDetailValue,
=======
    fontSize: 15,
    color: Colors.light.expandableDetailValue,
>>>>>>> main
    flex: 1,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  detailButton: {
<<<<<<< HEAD
    backgroundColor: colors.button,
=======
    backgroundColor: Colors.light.button,
>>>>>>> main
    borderRadius: 69,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
<<<<<<< HEAD
    color: colors.buttonText,
    fontSize: fontSizes.xxxs,
=======
    color: Colors.light.buttonText,
    fontSize: 8,
>>>>>>> main
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: colors.expandableQuantityButtonBorder,
=======
    borderColor: Colors.light.expandableQuantityButtonBorder,
>>>>>>> main
  },
  quantityButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    paddingVertical: 2,
    paddingHorizontal: 8,
<<<<<<< HEAD
    fontSize: fontSizes.xsPlus,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
    borderLeftWidth: 1,
    borderLeftColor: colors.expandableQuantityButtonBorder,
    borderRightWidth: 1,
    borderRightColor: colors.expandableQuantityButtonBorder,
=======
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.expandableQuantityButtonBorder,
    borderRightWidth: 1,
    borderRightColor: Colors.light.expandableQuantityButtonBorder,
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

export default ClientTable;
