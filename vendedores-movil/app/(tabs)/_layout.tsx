import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { View, StyleSheet } from 'react-native';
import HomeIcon from '../../assets/icons/HomeIcon';
import CartIcon from '../../assets/icons/CartIcon';

export default function TabLayout() {
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
          title: 'Inicio',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground}>
              <HomeIcon fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconBackground : styles.iconBackground}>
              <CartIcon fill={color} />
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
