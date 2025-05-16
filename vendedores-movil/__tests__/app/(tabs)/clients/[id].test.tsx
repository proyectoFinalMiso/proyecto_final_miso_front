import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ClientDetailsScreen from '../../../../app/(tabs)/clients/[id]';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as clientsService from '../../../../services/api/clientsService';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { Colors } from '../../../../constants/Colors';
=======
>>>>>>> main

// Mock dependencies
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../services/api/clientsService', () => ({
  fetchClientById: jest.fn(),
  fetchPastVisits: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    const MockSafeAreaView = jest.fn(({ children, ...props }) => {
        const ActualView = RN.View;
        return <ActualView {...props}>{children}</ActualView>;
    });
    Object.defineProperty(RN, 'SafeAreaView', { value: MockSafeAreaView });

    const MockRefreshControl = jest.fn(({ children, ...props }) => {
        const ActualView = RN.View;
        return <ActualView {...props}>{children}</ActualView>;
    });
    Object.defineProperty(RN, 'RefreshControl', { value: MockRefreshControl });
    return RN;
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));


jest.mock('../../../../components/LoadingIndicator', () => {
  const MockView = require('react-native').View;
  return jest.fn(props => <MockView testID="loading-indicator-mock">{props.message}</MockView>);
});

jest.mock('../../../../components/ErrorDisplay', () => {
  const MockView = require('react-native').View;
  return jest.fn(props => (
    <MockView testID="error-display-mock">
      <MockView testID="retry-button" onPress={props.onRetry} />
    </MockView>
  ));
});

jest.mock('../../../../components/PastVisitsTable', () => {
  const MockView = require('react-native').View;
  return jest.fn(props => <MockView testID="past-visits-table-mock">{props.refreshControl}</MockView>);
});

jest.mock('../../../../components/RegisterVisitModal', () => {
  const MockView = require('react-native').View;
  return jest.fn(props => (props.visible ? <MockView testID="register-visit-modal-mock" /> : null));
});

jest.mock('@/components/VideoUploadModal', () => {
  const MockView = require('react-native').View;
  return jest.fn(props => (props.visible ? <MockView testID="video-upload-modal-mock" /> : null));
});

<<<<<<< HEAD
const mockBaseFontSizes = {
  xxxs: 8, xxs: 11, xs: 12, xsPlus: 13, sm: 14, smd: 15, md: 16,
  lg: 18, xl: 20, xxl: 24, xxxl: 32, title: 42,
};
const mockFontSizeMultipliers: Record<'small' | 'medium' | 'large', number> = { small: 0.9, medium: 1.0, large: 1.1 };

const calculateMockFontSizes = (fontSizeMode: 'small' | 'medium' | 'large') => {
  const multiplier = mockFontSizeMultipliers[fontSizeMode];
  const calculated: any = {}; 
  for (const key in mockBaseFontSizes) {
  calculated[key] = mockBaseFontSizes[key as keyof typeof mockBaseFontSizes] * multiplier;
  }
  return calculated;
};

const mockDefaultFontSizeMode = 'medium' as 'small' | 'medium' | 'large';
const mockDefaultFontSizes = calculateMockFontSizes(mockDefaultFontSizeMode);

jest.mock('../../../../contexts/ThemeContext', () => {
  const ActualAppColors = jest.requireActual('../../../../constants/Colors').Colors;
  return {
      useTheme: jest.fn().mockReturnValue({
          theme: 'light',
          colors: ActualAppColors.light,
          isDark: false,
          toggleTheme: jest.fn(),
          setTheme: jest.fn(),

          fontSize: mockDefaultFontSizeMode,
            fontSizes: mockDefaultFontSizes,
            setFontSize: jest.fn(),
            increaseFontSize: jest.fn(),
            decreaseFontSize: jest.fn(),
      }),
  };
});

=======
>>>>>>> main

const mockClient = { id: '1', nombre: 'Test Client', correo: 'test@example.com' };
const mockVisits = [{ id: 'v1', fecha: '2023-01-01', descripcion: 'Visit 1' }];
const mockSellerData = { id: 'seller1', nombre: 'Test Seller' };

describe('ClientDetailsScreen', () => {
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseAuth = useAuth as jest.Mock;
  const mockFetchClientById = clientsService.fetchClientById as jest.Mock;
  const mockFetchPastVisits = clientsService.fetchPastVisits as jest.Mock;
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuth.mockReturnValue({ vendedorData: mockSellerData });
    mockFetchClientById.mockResolvedValue({ cliente: mockClient });
    mockFetchPastVisits.mockResolvedValue(mockVisits);
<<<<<<< HEAD

    const mockUseTheme = require('../../../../contexts/ThemeContext').useTheme;
                    mockUseTheme.mockReturnValue({
                        theme: 'light',
                        colors: Colors.light,
                        isDark: false,
                        toggleTheme: jest.fn(),
                        setTheme: jest.fn(),

                        fontSize: mockDefaultFontSizeMode,
                            fontSizes: mockDefaultFontSizes,
                            setFontSize: jest.fn(),
                            increaseFontSize: jest.fn(),
                            decreaseFontSize: jest.fn(),
                    });
=======
>>>>>>> main
  });

  it('should show loading indicator initially', async () => {
    mockFetchClientById.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ cliente: mockClient }), 100)));
    const { getByTestId } = render(<ClientDetailsScreen />);
    expect(getByTestId('loading-indicator-mock')).toBeTruthy();
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());
  });

  it('should show error display if fetching client fails', async () => {
    mockFetchClientById.mockRejectedValue(new Error('Failed to fetch client'));
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(getByTestId('error-display-mock')).toBeTruthy());
  });

  it('should show error display if fetching visits fails', async () => {
    mockFetchPastVisits.mockRejectedValue(new Error('Failed to fetch visits'));
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(getByTestId('error-display-mock')).toBeTruthy());
  });

  it('should display client details and visits on successful fetch', async () => {
    const { getByText, getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => {
      expect(getByText('Test Client')).toBeTruthy();
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByTestId('past-visits-table-mock')).toBeTruthy();
    });
  });

  it('should call fetchData on refresh', async () => {
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(1));

    const PastVisitsTable = require('../../../../components/PastVisitsTable');
    const refreshControl = PastVisitsTable.mock.calls[0][0].refreshControl;
    
    await act(async () => {
      refreshControl.props.onRefresh();
    });

    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(2));
  });

  it('should navigate back when back button is pressed', async () => {
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());
    fireEvent.press(getByTestId('back-button'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/clients');
  });

  it('should open and close register visit modal', async () => {
    const { getByTestId, queryByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());

    fireEvent.press(getByTestId('register-visit-button'));
    expect(getByTestId('register-visit-modal-mock')).toBeTruthy();

    const RegisterVisitModal = require('../../../../components/RegisterVisitModal');
    act(() => {
        RegisterVisitModal.mock.calls[RegisterVisitModal.mock.calls.length -1][0].onClose();
    });
    render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());
  });
  
  it('should call fetchData on successful visit registration', async () => {
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(1));
    
    fireEvent.press(getByTestId('register-visit-button'));
    const RegisterVisitModal = require('../../../../components/RegisterVisitModal');
    
    act(() => {
        RegisterVisitModal.mock.calls[RegisterVisitModal.mock.calls.length -1][0].onSuccess();
    });
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(2));
  });

  it('should open and close video upload modal', async () => {
    const { getByTestId, queryByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());

    fireEvent.press(getByTestId('upload-video-button'));
    expect(getByTestId('video-upload-modal-mock')).toBeTruthy();
    
    const VideoUploadModal = require('@/components/VideoUploadModal');
     act(() => {
        VideoUploadModal.mock.calls[VideoUploadModal.mock.calls.length -1][0].onClose();
    });
    render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalled());
  });

  it('should call fetchData on successful video upload', async () => {
    const { getByTestId } = render(<ClientDetailsScreen />);
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(1));

    fireEvent.press(getByTestId('upload-video-button'));
    const VideoUploadModal = require('@/components/VideoUploadModal');
    act(() => {
        VideoUploadModal.mock.calls[VideoUploadModal.mock.calls.length -1][0].onSuccess();
    });
    await waitFor(() => expect(mockFetchClientById).toHaveBeenCalledTimes(2));
  });
});
