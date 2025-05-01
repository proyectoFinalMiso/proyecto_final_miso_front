import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchClientById, Cliente } from '../../../services/api/clientsService';
import { Colors } from '../../../constants/Colors';

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [client, setClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClientById(id as string);
        setClient(data);
      } catch (err) {
        setError('No se pudo cargar la información del cliente.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadClient();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Cliente no encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Detalles del Cliente</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{client.nombre}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{client.correo}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.titleText,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    width: 90,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  value: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_400Regular',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
