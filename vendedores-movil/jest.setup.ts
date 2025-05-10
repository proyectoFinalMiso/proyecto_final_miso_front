// No need to import @testing-library/jest-native/extend-expect anymore
// The matchers are now built into @testing-library/react-native

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-splash-screen');
jest.mock('expo-router', () => ({
    Stack: () => 'Stack',
    Redirect: () => 'Redirect',
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
}));

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(() => Promise.resolve()), // Ensure setItem returns a Promise
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

// Mock Platform specific APIs
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: jest.fn(() => ({})),
}));

// Mock UIManager for LayoutAnimation
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');

    RN.UIManager = {
        ...RN.UIManager,
        setLayoutAnimationEnabledExperimental: jest.fn(),
    };

    return RN;
});
