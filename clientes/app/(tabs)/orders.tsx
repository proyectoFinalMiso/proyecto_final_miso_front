import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function OrdersScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Aquí irá el contenido de los pedidos */}
        <Text style={styles.placeholder}>Contenido de pedidos próximamente...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 20,
  },
}); 
