import React, { useMemo } from 'react';
import { StyleSheet, SafeAreaView, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import CartTable from '../../components/CartTable';
import OrderSummary from '../../components/OrderSummary';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

export default function CartScreen() {
  const { t } = useTranslation();
  const { items } = useCart();
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

  return (
    <SafeAreaView style={styles.container} testID="cart-container">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content} testID="cart-content">
          <View style={styles.header}>
            <Text style={styles.title}>{t('cart.title')}</Text>
          </View>
          <CartTable />
        </View>
        {items.length > 0 && (
          <View
            style={styles.orderSummaryContainer}
            testID="order-summary-container"
          >
            <OrderSummary />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '600',
    color: colors.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  orderSummaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 8
  }
});
