import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
=======
import { Colors } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
>>>>>>> main

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
<<<<<<< HEAD
    const { colors, fontSizes } = useTheme();
    const styles = useMemo(() => getStyles(colors, fontSizes), [colors, fontSizes]);
=======
>>>>>>> main

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
                            <Ionicons name="close" size={24} color={colors.text} />
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
<<<<<<< HEAD
                                    placeholderTextColor={colors.searchHint}
=======
                                    placeholderTextColor={Colors.light.searchHint}
>>>>>>> main
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
<<<<<<< HEAD
                                    placeholderTextColor={colors.searchHint}
=======
                                    placeholderTextColor={Colors.light.searchHint}
>>>>>>> main
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
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});

export default FilterModal;
