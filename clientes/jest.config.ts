import type { Config } from 'jest';

const config: Config = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/coverage/**',
        '!**/node_modules/**',
        '!**/babel.config.js',
        '!**/jest.setup.ts',
        '!**/jest.config.ts',
    ],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/coverage/',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/coverage/',
        '/jest.config.ts',
        '/jest.setup.ts',
        '/clientes/app/_layout.tsx',
        '/clientes/app/index.tsx',
    ],
    coverageThreshold: {
        global: {
            lines: 70,
            statements: 70
        }
    }
};

export default config; 
