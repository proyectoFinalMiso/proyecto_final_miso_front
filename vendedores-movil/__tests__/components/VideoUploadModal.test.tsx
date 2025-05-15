import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VideoUploadModal from '../../components/VideoUploadModal';
import { Alert } from 'react-native';
import { Colors } from '../../constants/Colors';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: { [key: string]: string } = {
        'common.permissionRequired': 'Permiso requerido',
        'clientDetails.galleryPermission': 'Se necesita permiso para acceder a la galería',
        'common.error': 'Error',
        'clientDetails.videoPickError': 'No se pudo seleccionar el video',
        'clientDetails.cameraPermission': 'Se necesitan permisos de cámara y micrófono',
        'clientDetails.videoRecordError': 'No se pudo grabar el video',
        'common.success': 'Éxito',
        'clientDetails.videoUploadSuccess': 'El video se ha subido correctamente',
        'clientDetails.videoUploadError': 'No se pudo subir el video',
        'clientDetails.videoUpload': 'Subir Video',
        'clientDetails.selectVideoSource': 'Seleccione cómo desea subir el video',
        'clientDetails.fromGallery': 'Galería',
        'clientDetails.recordNew': 'Grabar',
        'clientDetails.uploading': 'Subiendo video...'
      };
      return translations[key] || fallback || key;
    }
  })
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Videos: 'Videos'
  }
}));

jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(),
    requestMicrophonePermissionsAsync: jest.fn()
  }
}));

jest.mock('@/services/api/clientsService', () => ({
  uploadClientVideo: jest.fn()
}));

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0 && buttons[0].onPress) {
    buttons[0].onPress();
  }
  return null;
});

jest.mock('../../contexts/ThemeContext', () => {
  const ActualAppColors = jest.requireActual('../../constants/Colors').Colors;
  return {
      useTheme: jest.fn().mockReturnValue({
          theme: 'light',
          colors: ActualAppColors.light,
          isDark: false,
          toggleTheme: jest.fn(),
          setTheme: jest.fn(),
      }),
  };
});

describe('VideoUploadModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  
  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    clientId: 'client-123',
    vendedorId: 'seller-456',
    onSuccess: mockOnSuccess
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const mockUseTheme = require('../../contexts/ThemeContext').useTheme;
                    mockUseTheme.mockReturnValue({
                        theme: 'light',
                        colors: Colors.light,
                        isDark: false,
                        toggleTheme: jest.fn(),
                        setTheme: jest.fn(),
                    });
  });

  it('renders correctly when visible', () => {
    const { getByText, getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    expect(getByText('Subir Video')).toBeTruthy();
    expect(getByText('Seleccione cómo desea subir el video')).toBeTruthy();
    expect(getByText('Galería')).toBeTruthy();
    expect(getByText('Grabar')).toBeTruthy();
    expect(getByTestId('modal-close-button')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(<VideoUploadModal {...defaultProps} visible={false} />);

    expect(queryByText('Subir Video')).toBeNull();
  });

  it('calls onClose when close icon is pressed', () => {
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('modal-close-button'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows gallery permissions alert when permission is denied', async () => {
    const ImagePicker = require('expo-image-picker');
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'denied' });
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('pick-gallery-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permiso requerido',
        'Se necesita permiso para acceder a la galería'
      );
    });
  });

  it('shows camera permissions alert when permission is denied', async () => {
    const Camera = require('expo-camera').Camera;
    Camera.requestCameraPermissionsAsync.mockResolvedValue({ status: 'denied' });
    Camera.requestMicrophonePermissionsAsync.mockResolvedValue({ status: 'granted' });
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('record-video-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permiso requerido',
        'Se necesitan permisos de cámara y micrófono'
      );
    });
  });

  it('handles gallery picker cancellation', async () => {
    const ImagePicker = require('expo-image-picker');
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('pick-gallery-button'));
    
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
    
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('handles camera recorder cancellation', async () => {
    const ImagePicker = require('expo-image-picker');
    const Camera = require('expo-camera').Camera;
    
    Camera.requestCameraPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Camera.requestMicrophonePermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchCameraAsync.mockResolvedValue({ canceled: true });
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('record-video-button'));
    
    await waitFor(() => {
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
    
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('handles gallery picker error', async () => {
    const ImagePicker = require('expo-image-picker');
    
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockRejectedValue(new Error('Gallery error'));
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('pick-gallery-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'No se pudo seleccionar el video'
      );
    });
  });

  it('handles camera recorder error', async () => {
    const ImagePicker = require('expo-image-picker');
    const Camera = require('expo-camera').Camera;
    
    Camera.requestCameraPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Camera.requestMicrophonePermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchCameraAsync.mockRejectedValue(new Error('Camera error'));
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('record-video-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'No se pudo grabar el video'
      );
    });
  });

  it('handles video upload error', async () => {
    const ImagePicker = require('expo-image-picker');
    const uploadClientVideo = require('@/services/api/clientsService').uploadClientVideo;
    
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///mock-video-path.mp4' }]
    });
    
    jest.useFakeTimers();
    
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { getByTestId } = render(<VideoUploadModal {...defaultProps} />);

    fireEvent.press(getByTestId('pick-gallery-button'));
    
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
    
    jest.useRealTimers();
    mockConsoleError.mockRestore();
  });

});
