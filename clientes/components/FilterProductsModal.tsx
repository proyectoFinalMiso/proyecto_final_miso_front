import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

type FilterModalProps = {
    visible: boolean;
    onClose: () => void;
    tempPriceRange: { min: string; max: string };
    onTempPriceChange: (field: 'min' | 'max', value: string) => void;
    onApply: () => void;
    onClear: () => void;
};

const FilterModal = ({
    visible,
    onClose,
    tempPriceRange,
    onTempPriceChange,
    onApply,
    onClear,
}: FilterModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose} testID="modal-overlay">
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('home.filterProducts')}</Text>
                        <TouchableOpacity onPress={onClose} testID="modal-close-button">
                            <Ionicons name="close" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>{t('products.price')}</Text>
                        <View style={styles.priceInputsContainer}>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>{t('products.minPrice')}</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={tempPriceRange.min}
                                    onChangeText={(text) => onTempPriceChange('min', text)}
                                    placeholder={t('filters.min', 'Mín')}
                                    placeholderTextColor={Colors.light.searchHint}
                                    keyboardType="numeric"
                                    testID="filter-min-price-input"
                                    accessibilityLabel={t('filters.minPriceInput', 'Input precio mínimo')}
                                />
                            </View>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>{t('products.maxPrice')}</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={tempPriceRange.max}
                                    onChangeText={(text) => onTempPriceChange('max', text)}
                                    placeholder={t('filters.max', 'Máx')}
                                    placeholderTextColor={Colors.light.searchHint}
                                    keyboardType="numeric"
                                    testID="filter-max-price-input"
                                    accessibilityLabel={t('filters.maxPriceInput', 'Input precio máximo')}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.filterActions}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={onClear}
                            testID="filter-clear-button"
                            accessibilityLabel={t('home.clearFilters')}
                        >
                            <Text style={styles.clearButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={onApply}
                            testID="filter-apply-button"
                            accessibilityLabel={t('filters.applyFilters', 'Aplicar filtros')}
                        >
                            <Text style={styles.applyButtonText}>{t('filters.apply', 'Aplicar')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
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
        width: '80%',
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
    filterSection: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: Colors.light.text,
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
        fontSize: 14,
        marginBottom: 4,
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    priceInput: {
        height: 40,
        borderWidth: 0.8,
        borderColor: Colors.light.borderWidget,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.backgroundLogin,
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    clearButton: {
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
    clearButtonText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    applyButton: {
        backgroundColor: Colors.light.button,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 8,
    },
    applyButtonText: {
        color: Colors.light.buttonText,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});

export default FilterModal;
