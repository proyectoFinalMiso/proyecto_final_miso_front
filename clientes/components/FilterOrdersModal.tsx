import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

type FilterModalProps = {
    visible: boolean;
    onClose: () => void;
    tempPriceRange: { min: string; max: string };
    tempDateRange: { start: string; end: string };
    onTempPriceChange: (field: 'min' | 'max', value: string) => void;
    onTempDateChange: (field: 'start' | 'end', value: string) => void;
    onApply: () => void;
    onClear: () => void;
};

const FilterModal = ({
    visible,
    onClose,
    tempPriceRange,
    tempDateRange,
    onTempPriceChange,
    onTempDateChange,
    onApply,
    onClear,
}: FilterModalProps) => {
    const { t } = useTranslation();
    const [datePickerMode, setDatePickerMode] = useState<'start' | 'end' | null>(null);
    const [priceErrors, setPriceErrors] = useState({ min: '', max: '' });
    const [dateErrors, setDateErrors] = useState({ start: '', end: '' });

    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);

    const parseDate = (dateString: string): Date => {
        if (!dateString) return new Date();

        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }

        return new Date();
    };

    const handleDateChange = (field: 'start' | 'end', event: any, date?: Date) => {

        if (!date) {
            setDatePickerMode(null);
            return;
        };

        const dateString = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        onTempDateChange(field, dateString);
        setDatePickerMode(null);
    };

    const validatePriceInput = (field: 'min' | 'max', value: string) => {
        const numValue = parseFloat(value);

        if (value && isNaN(numValue)) {
            setPriceErrors(prev => ({ ...prev, [field]: t('filterOrdersModal.numericError', 'Ingrese un valor numérico válido') }));
            return false;
        }

        if (field === 'min' && numValue < 0) {
            setPriceErrors(prev => ({ ...prev, [field]: t('filterOrdersModal.minNegativeError', 'El valor mínimo no puede ser negativo') }));
            return false;
        }

        if (field === 'max' && tempPriceRange.min && numValue < parseFloat(tempPriceRange.min)) {
            setPriceErrors(prev => ({ ...prev, [field]: t('filterOrdersModal.maxLessThanMinError', 'El valor máximo debe ser mayor que el mínimo') }));
            return false;
        }

        setPriceErrors(prev => ({ ...prev, [field]: '' }));
        return true;
    };

    const handlePriceChange = (field: 'min' | 'max', value: string) => {
        onTempPriceChange(field, value);
        validatePriceInput(field, value);
    };

    const validateDateRange = () => {
        let isValid = true;
        const errors = { start: '', end: '' };

        if (tempDateRange.start && tempDateRange.end) {
            const startDate = parseDate(tempDateRange.start);
            const endDate = parseDate(tempDateRange.end);

            if (startDate > endDate) {
                errors.end = t('filterOrdersModal.dateRangeError', 'La fecha final debe ser posterior a la inicial');
                isValid = false;
            }
        }

        setDateErrors(errors);
        return isValid;
    };

    const handleApplyFilters = () => {
        const isPriceValid =
            validatePriceInput('min', tempPriceRange.min) &&
            validatePriceInput('max', tempPriceRange.max);
        const isDateValid = validateDateRange();

        if (isPriceValid && isDateValid) {
            onApply();
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
                        <Text style={styles.modalTitle}>{t('filterOrdersModal.title', 'Filtrar pedidos')}</Text>
                        <TouchableOpacity onPress={onClose} testID="modal-close-button">
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>{t('filterOrdersModal.totalValue', 'Valor total')}</Text>
                        <View style={styles.priceInputsContainer}>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>{t('filterOrdersModal.min', 'Mínimo')}</Text>
                                <TextInput
                                    style={[styles.priceInput, priceErrors.min ? styles.inputError : null]}
                                    value={tempPriceRange.min}
                                    onChangeText={(text) => handlePriceChange('min', text)}
                                    placeholder={t('filterOrdersModal.minPlaceholder', 'Mín')}
                                    placeholderTextColor={colors.searchHint}
                                    keyboardType="numeric"
                                    testID="filter-min-price-input"
                                    accessibilityLabel={t('filters.minPriceInput', 'Input precio mínimo')}
                                />
                                {priceErrors.min ? <Text style={styles.errorText}>{priceErrors.min}</Text> : null}
                            </View>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>{t('filterOrdersModal.max', 'Máximo')}</Text>
                                <TextInput
                                    style={[styles.priceInput, priceErrors.max ? styles.inputError : null]}
                                    value={tempPriceRange.max}
                                    onChangeText={(text) => handlePriceChange('max', text)}
                                    placeholder={t('filterOrdersModal.maxPlaceholder', 'Máx')}
                                    placeholderTextColor={colors.searchHint}
                                    keyboardType="numeric"
                                    testID="filter-max-price-input"
                                    accessibilityLabel={t('filters.maxPriceInput', 'Input precio máximo')}
                                />
                                {priceErrors.max ? <Text style={styles.errorText}>{priceErrors.max}</Text> : null}
                            </View>
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>{t('filterOrdersModal.date', 'Fecha')}</Text>
                        <View style={styles.dateInputsContainer}>
                            <View style={styles.dateInputWrapper}>
                                <Text style={styles.dateInputLabel}>{t('filterOrdersModal.from', 'Desde')}</Text>
                                <TouchableOpacity
                                    style={[styles.dateInput, dateErrors.start ? styles.inputError : null]}
                                    onPress={() => setDatePickerMode('start')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.dateInputText,
                                        !tempDateRange.start && styles.placeholderText
                                    ]} testID="start-date-input">
                                        {tempDateRange.start || t('filterOrdersModal.datePlaceholder', 'DD/MM/YYYY')}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={18} color={colors.text} />
                                </TouchableOpacity>
                                {dateErrors.start ? <Text style={styles.errorText}>{dateErrors.start}</Text> : null}
                            </View>
                            <View style={styles.dateInputWrapper}>
                                <Text style={styles.dateInputLabel}>{t('filterOrdersModal.to', 'Hasta')}</Text>
                                <TouchableOpacity
                                    style={[styles.dateInput, dateErrors.end ? styles.inputError : null]}
                                    onPress={() => setDatePickerMode('end')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.dateInputText,
                                        !tempDateRange.end && styles.placeholderText
                                    ]} testID="end-date-input">
                                        {tempDateRange.end || t('filterOrdersModal.datePlaceholder', 'DD/MM/YYYY')}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={18} color={colors.text} />
                                </TouchableOpacity>
                                {dateErrors.end ? <Text style={styles.errorText}>{dateErrors.end}</Text> : null}
                            </View>
                        </View>
                    </View>

                    <View style={styles.filterActions}>
                        <TouchableOpacity style={styles.clearButton} onPress={onClear} testID="filter-clear-button" accessibilityLabel={t('filterOrdersModal.clear', 'Limpiar filtros')}>
                            <Text style={styles.clearButtonText}>{t('filterOrdersModal.clear', 'Limpiar')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters} testID="filter-apply-button" accessibilityLabel={t('filterOrdersModal.apply', 'Aplicar filtros')}>
                            <Text style={styles.applyButtonText}>{t('filterOrdersModal.apply', 'Aplicar')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Pressable>

            {Platform.OS === 'android' && datePickerMode && (
                <DateTimePicker
                    testID={`datePicker-${datePickerMode}`}
                    value={parseDate(datePickerMode === 'start' ? tempDateRange.start : tempDateRange.end)}
                    mode="date"
                    display="default"
                    onChange={(event, date) => handleDateChange(datePickerMode, event, date)}
                    maximumDate={new Date()}
                />
            )}
        </Modal>
    );
};

const getStyles = (colors: any, fontSizes: any) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: colors.backgroundLogin,
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
        fontSize: fontSizes.lg,
        fontWeight: '600',
        color: colors.titleText,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    filterSection: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.text,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    priceInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceInputWrapper: {
        width: '48%',
    },
    priceInputLabel: {
        fontSize: fontSizes.sm,
        marginBottom: 4,
        color: colors.text,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    priceInput: {
        height: 40,
        borderWidth: 0.8,
        borderColor: colors.borderWidget,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
    },
    dateInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInputWrapper: {
        width: '48%',
    },
    dateInputLabel: {
        fontSize: fontSizes.sm,
        marginBottom: 4,
        color: colors.text,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    dateInput: {
        height: 40,
        borderWidth: 0.8,
        borderColor: colors.borderWidget,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: colors.text,
    },
    dateInputText: {
        fontSize: fontSizes.sm,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: colors.text,
    },
    placeholderText: {
        color: colors.searchHint,
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    clearButton: {
        backgroundColor: colors.backgroundLogin,
        borderWidth: 1,
        borderColor: colors.secondaryButtonOutline,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 8,
    },
    clearButtonText: {
        color: colors.text,
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    applyButton: {
        backgroundColor: colors.button,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 8,
    },
    applyButtonText: {
        color: colors.buttonText,
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    inputError: {
        borderColor: '#E53935',
    },
    errorText: {
        color: '#E53935',
        fontSize: fontSizes.xs,
        marginTop: 2,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    datePickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.backgroundLogin,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.borderWidget,
    },
    datePickerTitle: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        color: colors.text,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    datePickerCancel: {
        color: '#E53935',
        fontSize: fontSizes.md,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    datePickerDone: {
        color: colors.button,
        fontSize: fontSizes.md,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    iosDatePicker: {
        height: 200,
        width: '100%',
    },
});

export default FilterModal;


