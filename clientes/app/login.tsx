import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Log in con Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.light.backgroundLogin,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: 'regular',
    marginBottom: 120,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.titleText,
  },
  buttonContainer: {
    width: '75%',
    gap: 30,
  },
  button: {
    width: '100%',
    padding: 6,
    borderRadius: 69,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.light.button,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.secondaryButtonOutline,
  },
  buttonText: {
    color: Colors.light.buttonText,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  secondaryButtonText: {
    color: Colors.light.titleText,
  },
}); 
