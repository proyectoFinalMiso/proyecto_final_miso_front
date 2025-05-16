import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { preloadImage, getOptimizedImageProps } from '../utils/imageUtils';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [imageReady, setImageReady] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

  // Preload the login image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const loginImage = require('../assets/images/login.webp');
        await preloadImage(loginImage);
        setImageReady(true);
      } catch (error) {
        console.error('Failed to preload image:', error);
        setImageReady(true);
      }
    };

    loadImage();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return;
    }
    setEmailError(emailRegex.test(email) ? '' : t('auth.invalidEmail'));
  };

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert(t('common.error'), t('auth.requiredFields'));
      return;
    }

    try {
      await login({ correo, contrasena });
      router.replace('/(tabs)');
    } catch (error) {
      let message = t('auth.loginError');
      if (error instanceof Error) {
        message += `: ${error.message}`;
      }
      Alert.alert(t('common.error'), message);
    }
  };

  const handleRegister = () => {
    router.push('/register')
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {imageLoading && <View style={[styles.logoImage, styles.imagePlaceholder]} />}
        <Image
          source={require('../assets/images/login.webp')}
          style={styles.logoImage}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          {...getOptimizedImageProps()}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>{t('common.welcomeText')}</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder={t('auth.email')}
                placeholderTextColor="#888"
                value={correo}
                onChangeText={(text) => {
                  setCorreo(text);
                  validateEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="loginEmailInput"
                accessibilityLabel="loginEmailInput"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.password')}
                placeholderTextColor="#888"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!showPassword}
                testID="loginPasswordInput"
                accessibilityLabel="loginPasswordInput"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              testID="loginSubmitButton"
              accessibilityLabel="loginSubmitButton"
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.buttonText} size="small" />
              ) : (
                <Text style={styles.buttonText}>{t('common.login')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleRegister}
              disabled={isLoading}
              testID="loginRegisterButton"
              accessibilityLabel="loginRegisterButton"
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>{t('common.register')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    backgroundColor: colors.background,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 42,
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.titleText,
  },
  formContainer: {
    width: '80%',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderWidget,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: colors.backgroundLogin,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  buttonContainer: {
    width: '75%',
    gap: 20,
  },
  button: {
    width: '100%',
    padding: 11,
    borderRadius: 69,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.button,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondaryButtonOutline,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  secondaryButtonText: {
    color: colors.titleText,
  },
  logoImage: {
    width: '100%',
    height: 250,
    marginBottom: 60,
  },
  imagePlaceholder: {
    backgroundColor: '#e1e1e1',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
