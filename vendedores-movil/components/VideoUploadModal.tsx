<<<<<<< HEAD
import React, { useState, useMemo } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> main
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
<<<<<<< HEAD
import LoadingIndicator from './LoadingIndicator';
import { notifyVideoUploadComplete } from '../services/api/clientsService';
import { useTheme } from '../contexts/ThemeContext';
=======
import { Colors } from '../constants/Colors';
import LoadingIndicator from './LoadingIndicator';
import { notifyVideoUploadComplete } from '../services/api/clientsService';
>>>>>>> main

interface VideoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  clientId: string;
  vendedorId: string;
  onSuccess?: () => void;
  clientEmail: string;
  vendedorEmail: string;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  visible,
  onClose,
  clientId,
  vendedorId,
  clientEmail,
  vendedorEmail,
  onSuccess,
}) => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const { colors, fontSizes } = useTheme();
  const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const gcsBucketName = 'ccp-recommendations-videos';
=======
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const gcsBucketName = 'ccp-recommendations-videos'
>>>>>>> main

  console.log('VideoUploadModal props:', {
    visible,
    clientId,
    vendedorId,
    clientEmail,
    vendedorEmail,
  });

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
        await uploadVideoDirectlyToGCS(result.assets[0].uri);
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
        await uploadVideoDirectlyToGCS(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('clientDetails.videoRecordError', 'No se pudo grabar el video')
      );
    }
  };

  const uploadVideoDirectlyToGCS = async (videoUri: string) => {
    if (!gcsBucketName) {
        Alert.alert(t('common.error', 'Error'), "GCS Bucket name is not configured.");
        console.error("GCS Bucket name is missing.");
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Filename
      const timestamp = new Date().getTime();
      const originalFileName = videoUri.split('/').pop() || `video_${timestamp}.mp4`;
      const fileExtension = originalFileName.split('.').pop() || 'mp4';
      const filename = `client_${clientId}_${timestamp}.${fileExtension}`;
      const contentType = `video/${fileExtension}`;

      // 2. GCS Object URL
      const gcsObjectUrl = `https://storage.googleapis.com/${gcsBucketName}/${filename}`;

      console.log(`Attempting direct upload to: ${gcsObjectUrl}`);
      console.log(`Content-Type: ${contentType}`);

      // 3. Upload
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', gcsObjectUrl);
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
            console.log('GCS Direct Upload Success:', xhr.status, xhr.responseText);
            resolve();
          } else {
            console.error('GCS Direct Upload Error:', xhr.status, xhr.responseText, xhr.getAllResponseHeaders());
            let errorMessage = `GCS Upload Failed: ${xhr.status}`;
            if (xhr.responseText) {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.error && errorResponse.error.message) {
                        errorMessage += ` - ${errorResponse.error.message}`;
                    } else {
                        errorMessage += ` - ${xhr.responseText.substring(0, 100)}`;
                    }
                } catch (e) {
                    errorMessage += ` - ${xhr.responseText.substring(0, 100)}`;
                }
            } else {
                errorMessage += ' - Unknown GCS error';
            }
            reject(new Error(errorMessage));
          }
        };
        xhr.onerror = (e) => {
          console.error('Network error during GCS direct upload:', e);
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
      await notifyVideoUploadComplete(gcsObjectUrl, clientEmail, vendedorEmail);

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
<<<<<<< HEAD
              <Ionicons name="close" size={24} color={colors.text} />
=======
              <Ionicons name="close" size={24} color={Colors.light.text} />
>>>>>>> main
            </TouchableOpacity>
          </View>

          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <LoadingIndicator message={t('clientDetails.uploading', 'Subiendo video...')} />
              <Text style={styles.progressText}>{`${uploadProgress}%`}</Text>
              <View style={styles.progressBarContainer}>
<<<<<<< HEAD
                <View style={[styles.progressBar, { width: `${uploadProgress}%`, backgroundColor: colors.button }]} />
=======
                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
>>>>>>> main
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.modalSubtitle}>
                {t('clientDetails.selectVideoSource', 'Seleccione cómo desea subir el video')}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
<<<<<<< HEAD
                  style={[styles.modalButton, styles.galleryButton, { backgroundColor: colors.button }]}
=======
                  style={[styles.modalButton, styles.galleryButton]}
>>>>>>> main
                  onPress={pickVideoFromGallery}
                  disabled={isUploading}
                  testID="pick-gallery-button"
                >
<<<<<<< HEAD
                  <Ionicons name="images-outline" size={24} color={colors.buttonText} />
=======
                  <Ionicons name="images-outline" size={24} color={Colors.light.buttonText} />
>>>>>>> main
                  <Text style={styles.modalButtonText}>
                    {t('clientDetails.fromGallery', 'Galería')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
<<<<<<< HEAD
                  style={[styles.modalButton, styles.cameraButton, { backgroundColor: colors.button }]}
=======
                  style={[styles.modalButton, styles.cameraButton]}
>>>>>>> main
                  onPress={recordVideo}
                  disabled={isUploading}
                  testID="record-video-button"
                >
<<<<<<< HEAD
                  <Ionicons name="videocam-outline" size={24} color={colors.buttonText} />
=======
                  <Ionicons name="videocam-outline" size={24} color={Colors.light.buttonText} />
>>>>>>> main
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

<<<<<<< HEAD
const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
=======
const styles = StyleSheet.create({
>>>>>>> main
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    width: '85%',
<<<<<<< HEAD
    backgroundColor: colors.backgroundLogin,
=======
    backgroundColor: Colors.light.backgroundLogin,
>>>>>>> main
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
<<<<<<< HEAD
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.titleText,
=======
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.titleText,
>>>>>>> main
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  
  modalSubtitle: {
<<<<<<< HEAD
    fontSize: fontSizes.md,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
=======
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.light.text,
>>>>>>> main
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
  
<<<<<<< HEAD
  galleryButton: {},
  
  cameraButton: {},
  
  modalButtonText: {
    fontSize: fontSizes.md,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginLeft: 8,
    color: colors.buttonText,
=======
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
>>>>>>> main
  },

  uploadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  progressText: {
    marginTop: 10,
<<<<<<< HEAD
    fontSize: fontSizes.md,
    color: colors.text,
=======
    fontSize: 16,
    color: Colors.light.text,
>>>>>>> main
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
<<<<<<< HEAD
=======
    backgroundColor: Colors.light.button,
>>>>>>> main
  }
});

export default VideoUploadModal;
