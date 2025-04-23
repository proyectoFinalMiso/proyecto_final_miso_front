import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { preloadImage, getOptimizedImageProps } from '../utils/imageUtils';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const [imageReady, setImageReady] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
        setEmailError(emailRegex.test(email) ? '' : 'Email inválido');
    };

    const validateNombre = (name: string) => {
        if (!name) {
            setNombreError('');
            return;
        }
        setNombreError(name.length < 3 ? 'Nombre demasiado corto' : '');
    };

    const validatePassword = (pass: string) => {
        if (!pass) {
            setPasswordError('');
            return;
        }
        setPasswordError(pass.length < 3 ? 'Contraseña demasiado corta' : '');
    };

    const handleRegister = async () => {
        if (!nombre || !correo || !contrasena) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        if (emailError || nombreError || passwordError) {
            Alert.alert('Error', 'Por favor, corrige los errores en el formulario');
            return;
        }

        try {
            await register({ nombre, correo, contrasena });
            router.replace('/(tabs)');
        } catch (error) {
            let message = 'Error al registrarse';
            if (error instanceof Error) {
                message += `: ${error.message}`;
            }
            Alert.alert('Error', message);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
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
                        <Text style={styles.title}>Crear cuenta</Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, nombreError ? styles.inputError : null]}
                                    placeholder="Nombre completo"
                                    placeholderTextColor="#888"
                                    value={nombre}
                                    onChangeText={(text) => {
                                        setNombre(text);
                                        validateNombre(text);
                                    }}
                                    autoCapitalize="words"
                                    testID='registerNameInput'
                                    accessibilityLabel="registerNameInput"
                                />
                            </View>
                            {nombreError ? <Text style={styles.errorText}>{nombreError}</Text> : null}

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, emailError ? styles.inputError : null]}
                                    placeholder="Correo electrónico"
                                    placeholderTextColor="#888"
                                    value={correo}
                                    onChangeText={(text) => {
                                        setCorreo(text);
                                        validateEmail(text);
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    testID='registerEmailInput'
                                    accessibilityLabel="registerEmailInput"
                                />
                            </View>
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, passwordError ? styles.inputError : null]}
                                    placeholder="Contraseña"
                                    placeholderTextColor="#888"
                                    value={contrasena}
                                    onChangeText={(text) => {
                                        setContrasena(text);
                                        validatePassword(text);
                                    }}
                                    secureTextEntry={!showPassword}
                                    testID='registerPasswordInput'
                                    accessibilityLabel="registerPasswordInput"
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                    testID='togglePasswordVisibility'
                                    accessibilityLabel="togglePasswordVisibility"
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#888"
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
                                onPress={handleRegister}
                                disabled={isLoading}
                                testID='registerSubmitButton'
                                accessibilityLabel="registerSubmitButton"
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={Colors.light.buttonText} size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Registrarse</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton]}
                                onPress={handleBack}
                                disabled={isLoading}
                                testID='registerCancelButton'
                                accessibilityLabel="registerCancelButton"
                            >
                                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 0,
        backgroundColor: Colors.light.backgroundLogin,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 42,
        marginBottom: 40,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.titleText,
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
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
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
        backgroundColor: Colors.light.button,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.secondaryButtonOutline,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.light.buttonText,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    secondaryButtonText: {
        color: Colors.light.titleText,
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
