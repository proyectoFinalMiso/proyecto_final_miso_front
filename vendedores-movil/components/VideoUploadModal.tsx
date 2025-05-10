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
import { getVideoUploadSignedUrl, notifyVideoUploadComplete } from '../services/api/clientsService';

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadVideoWithSignedUrl(result.assets[0].uri);
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
    
    if (cameraStatus !== 'granted') {
      Alert.alert(
        t('common.permissionRequired', 'Permiso requerido'),
        t('clientDetails.cameraPermission', 'Se necesitan permisos de cámara')
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadVideoWithSignedUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('clientDetails.videoRecordError', 'No se pudo grabar el video')
      );
    }
  };

  const uploadVideoWithSignedUrl = async (videoUri: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Filename
      const timestamp = new Date().getTime();
      const originalFileName = videoUri.split('/').pop() || `video_${timestamp}.mp4`;
      const fileExtension = originalFileName.split('.').pop() || 'mp4';
      const filename = `client_${clientId}_${timestamp}.${fileExtension}`;
      const contentType = `video/${fileExtension}`;

      // 2. Signed URL
      const { signedUrl, gcsPath } = await getVideoUploadSignedUrl(clientId, filename, contentType);

      // 3. Upload
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            console.error('GCS Upload Error:', xhr.status, xhr.responseText);
            reject(new Error(`GCS Upload Failed: ${xhr.status} ${xhr.responseText || 'Unknown error'}`));
          }
        };
        xhr.onerror = (e) => {
          console.error('Network error during GCS upload:', e);
          reject(new Error('Network error during upload.'));
        };

        fetch(videoUri)
          .then(res => res.blob())
          .then(blob => {
            xhr.send(blob);
          })
          .catch(blobError => {
            console.error('Error creating blob from videoUri:', blobError);
            reject(new Error('Could not process video file.'));
          });
      });

      // 4. Notify
      await notifyVideoUploadComplete(gcsPath, clientId, vendedorId);

      Alert.alert(
        t('common.success', 'Éxito'),
        t('clientDetails.videoUploadSuccess', 'El video se ha subido correctamente')
      );

      if (onSuccess) {
        onSuccess();
      }
      onClose();

    } catch (error: any) {
      console.error('Error during video upload process:', error);
      Alert.alert(
        t('common.error', 'Error'),
        error.message || t('clientDetails.videoUploadError', 'No se pudo subir el video')
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => !isUploading && onClose()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('clientDetails.videoUpload', 'Subir Video')}</Text>
            <TouchableOpacity onPress={onClose} testID="modal-close-button" disabled={isUploading}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <LoadingIndicator message={t('clientDetails.uploading', 'Subiendo video...')} />
              <Text style={styles.progressText}>{`${uploadProgress}%`}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          ) : (
            <>
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
                  <Ionicons name="images-outline" size={24} color={Colors.light.buttonText} />
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
            </>
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
    backgroundColor: Colors.light.button,
  },
  
  cameraButton: {
    backgroundColor: Colors.light.button,
  },
  
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginLeft: 8,
    color: Colors.light.buttonText,
  },

  uploadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.button,
  }
});

export default VideoUploadModal;
