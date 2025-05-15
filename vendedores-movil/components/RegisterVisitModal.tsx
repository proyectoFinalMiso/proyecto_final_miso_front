import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    Pressable, 
    TouchableOpacity, 
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { sendVisit } from '../services/api/clientsService';

type RegisterVisitModalProps = {
    visible: boolean;
    onClose: () => void;
    clientId: string;
    vendedorId: string;
    clientName: string;
    onSuccess: () => void;
};

const RegisterVisitModal = ({
    visible,
    onClose,
    clientId,
    vendedorId,
    clientName,
    onSuccess
}: RegisterVisitModalProps) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'programada' | 'completada'>('programada');

    const formatDate = (date: Date): string => {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formatTime = (date: Date): string => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            setSelectedDate(newDate);
        }
    };

    const handleTimeChange = (event: any, time?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (time) {
            const newDate = new Date(selectedDate);
            newDate.setHours(time.getHours(), time.getMinutes());
            setSelectedDate(newDate);
        }
    };

    const validateDateTime = (): boolean => {
        const now = new Date();
        if (selectedStatus === 'programada') {
            if (selectedDate <= now) {
                Alert.alert(
                    t('common.error'),
                    t('registerVisitModal.invalidFutureDate', 'Una visita programada debe tener fecha y hora en el futuro')
                );
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateDateTime()) {
            return;
        }

        setIsLoading(true);
        try {
            const formattedDate = 
                `${selectedDate.getFullYear()}-` +
                `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-` +
                `${String(selectedDate.getDate()).padStart(2, '0')}T` +
                `${String(selectedDate.getHours()).padStart(2, '0')}:` +
                `${String(selectedDate.getMinutes()).padStart(2, '0')}:00`;
            
            const response = await sendVisit(clientId, vendedorId, formattedDate, selectedStatus);
            
            setIsLoading(false);
            Alert.alert(
                t('common.success', 'Éxito'),
                t('registerVisitModal.success', 'La visita se ha registrado correctamente'),
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            onClose();
                            onSuccess();
                        }
                    }
                ]
            );
        } catch (error) {
            setIsLoading(false);
            Alert.alert(
                t('common.error'),
                t('registerVisitModal.error', 'Ocurrió un error al registrar la visita')
            );
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose} testID="modal-overlay">
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('registerVisitModal.title', 'Registrar visita')}</Text>
                            <TouchableOpacity onPress={onClose} testID="modal-close-button">
                                <Ionicons name="close" size={24} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.clientName}>{clientName}</Text>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{t('registerVisitModal.status', 'Estado')}</Text>
                            <View style={styles.statusContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.statusButton,
                                        selectedStatus === 'programada' && styles.statusButtonActive
                                    ]}
                                    onPress={() => setSelectedStatus('programada')}
                                >
                                    <Text 
                                        style={[
                                            styles.statusText,
                                            selectedStatus === 'programada' && styles.statusTextActive
                                        ]}
                                    >
                                        {t('registerVisitModal.scheduled', 'Programada')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.statusButton,
                                        selectedStatus === 'completada' && styles.statusButtonActive
                                    ]}
                                    onPress={() => setSelectedStatus('completada')}
                                >
                                    <Text 
                                        style={[
                                            styles.statusText,
                                            selectedStatus === 'completada' && styles.statusTextActive
                                        ]}
                                    >
                                        {t('registerVisitModal.completed', 'Completada')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{t('registerVisitModal.date', 'Fecha')}</Text>
                            <TouchableOpacity
                                style={styles.dateSelector}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{t('registerVisitModal.time', 'Hora')}</Text>
                            <TouchableOpacity
                                style={styles.dateSelector}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.dateText}>{formatTime(selectedDate)}</Text>
                                <Ionicons name="time-outline" size={20} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Text style={styles.submitButtonText}>{t('registerVisitModal.sending', 'Enviando...')}</Text>
                                ) : (
                                    <Text style={styles.submitButtonText}>{t('registerVisitModal.register', 'Registrar')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>

            {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {Platform.OS === 'android' && showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
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
    clientName: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 16,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.light.borderWidget,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: Colors.light.backgroundLogin,
    },
    statusButtonActive: {
        backgroundColor: Colors.light.button,
        borderColor: Colors.light.button,
    },
    statusText: {
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    statusTextActive: {
        color: Colors.light.buttonText,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    dateSelector: {
        height: 46,
        borderWidth: 0.8,
        borderColor: Colors.light.borderWidget,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.backgroundLogin,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.text,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: Colors.light.backgroundLogin,
        borderWidth: 1,
        borderColor: Colors.light.borderWidget,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 8,
    },
    cancelButtonText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    submitButton: {
        backgroundColor: Colors.light.button,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 8,
    },
    submitButtonText: {
        color: Colors.light.buttonText,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default RegisterVisitModal;
