import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function CartScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Carrito</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
}); 
