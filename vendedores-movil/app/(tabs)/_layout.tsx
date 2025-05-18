import { Tabs, usePathname } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { View, StyleSheet } from 'react-native';
import HomeIcon from '../../assets/icons/HomeIcon';
import CartIcon from '../../assets/icons/CartIcon';
import ClientIcon from '../../assets/icons/ClientIcon';
import SettingsIcon from '../../assets/icons/SettingsIcon';
import { useTranslation } from 'react-i18next';
import VisitsICon from '@/assets/icons/VisitsIcon';

export default function TabLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabTint,
        tabBarInactiveTintColor: Colors.light.tabTint,
        tabBarStyle: {
          backgroundColor: Colors.light.backgroundLogin,
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
            <View
              style={
                focused ? styles.activeIconBackground : styles.iconBackground
              }
            >
              <HomeIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tab.cart'),
          tabBarIcon: ({ focused, color }) => (
            <View
              style={
                focused ? styles.activeIconBackground : styles.iconBackground
              }
            >
              <CartIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: t('tab.clients'),
          tabBarIcon: ({ color }) => {
            const isClientsFocused = pathname === '/clients' || pathname.startsWith('/clients/');
            return (
              <View
                style={
                  isClientsFocused ? styles.activeIconBackground : styles.iconBackground
                }
              >
                <ClientIcon fill={color} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t('tab.visits'),
          tabBarIcon: ({ focused, color }) => (
            <View
              style={
                focused ? styles.activeIconBackground : styles.iconBackground
              }
            >
              <VisitsICon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="clients/[id]"
        options={{
          href: null,
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

const styles = StyleSheet.create({
  activeIconBackground: {
    backgroundColor: Colors.light.tabActiveBackground,
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
