import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'app_language';

const resources = {
    en: {
        translation: require('../locales/en.json')
    },
    es: {
        translation: require('../locales/es.json')
    }
};

const getDeviceLanguage = (): string => {
    try {
        const locales = Localization.getLocales();
        if (locales && locales.length > 0 && locales[0].languageCode) {
            const languageCode = locales[0].languageCode;
            return (languageCode in resources) ? languageCode : 'es';
        }
    } catch (error) {
        console.error('Error al obtener el idioma del dispositivo:', error);
    }
    return 'es';
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: getDeviceLanguage(),
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        },
    });

i18next.on('languageChanged', (lng) => {
    AsyncStorage.setItem(LANGUAGE_KEY, lng).catch(error => {
        console.error('Error guardando idioma:', error);
    });
});

export const initializeLanguage = async (): Promise<void> => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && savedLanguage in resources) {
            await i18next.changeLanguage(savedLanguage);
        }
    } catch (error) {
        console.error('Error cargando idioma guardado:', error);
    }
};

export default i18next; 
