import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { View, StyleSheet } from 'react-native';
import HomeIcon from '../../assets/icons/HomeIcon';
import CartIcon from '../../assets/icons/CartIcon';
import OrdersIcon from '../../assets/icons/OrdersIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useMemo } from 'react';

export default function TabLayout() {
  const { t } = useTranslation();

  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabTint,
        tabBarInactiveTintColor: colors.tabTint,
        tabBarStyle: {
          backgroundColor: colors.backgroundLogin,
          borderTopWidth: 0,
          borderTopColor: '#E5E5E5',
          height: 66,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'semibold',
          fontFamily: 'PlusJakartaSans_600SemiBold',
          marginTop: 6,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.home'),
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground} testID='home-icon' accessibilityLabel='home-icon'>
              <HomeIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tab.orders'),
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground} testID='orders-icon' accessibilityLabel='orders-icon'>
              <OrdersIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tab.cart'),
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground} testID='cart-icon' accessibilityLabel='cart-icon'>
              <CartIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground} testID='settings-icon' accessibilityLabel='settings-icon'>
              <SettingsIcon fill={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  activeIconBackground: {
    backgroundColor: colors.tabActiveBackground,
    borderRadius: 85,
    padding: 8,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 10,
  },
  iconBackground: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 10,
  },
});
