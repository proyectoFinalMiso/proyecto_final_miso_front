/**
 * Maps language codes to appropriate locale formats for date formatting
 * Used for consistent date display across the application
 */
export const LANGUAGE_TO_LOCALE: Record<string, string> = {
  'es': 'es-CO',
  'en': 'en-US',
  // Add more mappings as the application supports more languages
  // 'fr': 'fr-FR',
  // 'de': 'de-DE',
};

/**
 * Gets the appropriate locale string for the current language
 * @param language The current language code (e.g., 'es', 'en')
 * @returns The corresponding locale string (e.g., 'es-CO', 'en-US')
 */
export const getLocaleFromLanguage = (language: string): string => {
  return LANGUAGE_TO_LOCALE[language] || 'en-US';
};
