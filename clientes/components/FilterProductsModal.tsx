import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

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
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrar productos</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Precio</Text>
                        <View style={styles.priceInputsContainer}>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>Mínimo</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={tempPriceRange.min}
                                    onChangeText={(text) => onTempPriceChange('min', text)}
                                    placeholder="Mín"
                                    placeholderTextColor={Colors.light.searchHint}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>Máximo</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={tempPriceRange.max}
                                    onChangeText={(text) => onTempPriceChange('max', text)}
                                    placeholder="Máx"
                                    placeholderTextColor={Colors.light.searchHint}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.filterActions}>
                        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                            <Text style={styles.clearButtonText}>Limpiar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                            <Text style={styles.applyButtonText}>Aplicar</Text>
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
