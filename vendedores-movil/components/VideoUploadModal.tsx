import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Colors } from '../constants/Colors';
import LoadingIndicator from './LoadingIndicator';

interface VideoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  clientId: string;
  vendedorId: string;
  onSuccess?: () => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  visible,
  onClose,
  clientId,
  vendedorId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const pickVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        t('common.permissionRequired', 'Permiso requerido'),
        t('clientDetails.galleryPermission', 'Se necesita permiso para acceder a la galería')
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadVideo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('clientDetails.videoPickError', 'No se pudo seleccionar el video')
      );
    }
  };

  const recordVideo = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
    
    if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
      Alert.alert(
        t('common.permissionRequired', 'Permiso requerido'),
        t('clientDetails.cameraPermission', 'Se necesitan permisos de cámara y micrófono')
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadVideo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('clientDetails.videoRecordError', 'No se pudo grabar el video')
      );
    }
  };

  const uploadVideo = async (videoUri: string) => {
    setIsUploading(true);
    try {
      // Here you would implement your API call to upload the video
      // For example:
      // await uploadClientVideo(clientId, videoUri, vendedorId);
      
      // Simulating an upload with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        t('common.success', 'Éxito'),
        t('clientDetails.videoUploadSuccess', 'El video se ha subido correctamente')
      );
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('clientDetails.videoUploadError', 'No se pudo subir el video')
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('clientDetails.videoUpload', 'Subir Video')}</Text>
            <TouchableOpacity onPress={onClose} testID="modal-close-button">
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            {t('clientDetails.selectVideoSource', 'Seleccione cómo desea subir el video')}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.galleryButton]}
              onPress={pickVideoFromGallery}
              disabled={isUploading}
              testID="pick-gallery-button"
            >
              <Ionicons name="images-outline" size={24} color={Colors.light.text} />
              <Text style={styles.modalButtonText}>
                {t('clientDetails.fromGallery', 'Galería')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cameraButton]}
              onPress={recordVideo}
              disabled={isUploading}
              testID="record-video-button"
            >
              <Ionicons name="videocam-outline" size={24} color={Colors.light.buttonText} />
              <Text style={styles.modalButtonText}>
                {t('clientDetails.recordNew', 'Grabar')}
              </Text>
            </TouchableOpacity>
          </View>

          {isUploading && (
            <LoadingIndicator message={t('clientDetails.uploading', 'Subiendo video...')} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    width: '85%',
    backgroundColor: Colors.light.backgroundLogin,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.titleText,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
    marginBottom: 20,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  galleryButton: {
    backgroundColor: Colors.light.backgroundLogin,
    borderWidth: 1,
    borderColor: Colors.light.borderWidget,
  },
  
  cameraButton: {
    backgroundColor: Colors.light.button,
  },
  
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginLeft: 8,
    color: Colors.light.text,
  },
});

export default VideoUploadModal;
