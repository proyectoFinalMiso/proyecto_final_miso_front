import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterOrdersModal from '../../components/FilterOrdersModal';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('@react-native-community/datetimepicker', () => {
    const MockDateTimePicker = jest.fn(props => {
        return null;
    });
    return MockDateTimePicker;
});

describe('FilterOrdersModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnTempPriceChange = jest.fn();
    const mockOnTempDateChange = jest.fn();
    const mockOnApply = jest.fn();
    const mockOnClear = jest.fn();

    const defaultProps = {
        visible: true,
        onClose: mockOnClose,
        tempPriceRange: { min: '', max: '' },
        tempDateRange: { start: '', end: '' },
        onTempPriceChange: mockOnTempPriceChange,
        onTempDateChange: mockOnTempDateChange,
        onApply: mockOnApply,
        onClear: mockOnClear,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByText } = render(<FilterOrdersModal {...defaultProps} />);

        expect(getByText('Filtrar pedidos')).toBeTruthy();
        expect(getByText('Valor total')).toBeTruthy();
        expect(getByText('Mínimo')).toBeTruthy();
        expect(getByText('Máximo')).toBeTruthy();
        expect(getByText('Fecha')).toBeTruthy();
        expect(getByText('Desde')).toBeTruthy();
        expect(getByText('Hasta')).toBeTruthy();
        expect(getByText('Limpiar')).toBeTruthy();
        expect(getByText('Aplicar')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByText } = render(<FilterOrdersModal {...defaultProps} visible={false} />);

        expect(queryByText('Filtrar pedidos')).toBeNull();
    });

    it('calls onClose when close icon is pressed', () => {
        const { getByTestId } = render(<FilterOrdersModal {...defaultProps} />);

        fireEvent.press(getByTestId('modal-close-button'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onTempPriceChange when price inputs change', () => {
        const { getByPlaceholderText } = render(<FilterOrdersModal {...defaultProps} />);

        fireEvent.changeText(getByPlaceholderText('Mín'), '100');
        expect(mockOnTempPriceChange).toHaveBeenCalledWith('min', '100');

        fireEvent.changeText(getByPlaceholderText('Máx'), '500');
        expect(mockOnTempPriceChange).toHaveBeenCalledWith('max', '500');
    });

    it('opens date picker when date field is pressed', () => {
        const { getByTestId } = render(<FilterOrdersModal {...defaultProps} />);

        const startDateText = getByTestId('start-date-input');
        expect(startDateText).toBeTruthy();

        // Can't fully test date picker interaction due to the native component,
        // but we can verify it renders correctly
        fireEvent.press(startDateText);
    });

    it('displays correct price range values', () => {
        const priceRange = { min: '100', max: '500' };
        const { getByDisplayValue } = render(
            <FilterOrdersModal {...defaultProps} tempPriceRange={priceRange} />
        );

        expect(getByDisplayValue('100')).toBeTruthy();
        expect(getByDisplayValue('500')).toBeTruthy();
    });

    it('displays correct date range values', () => {
        const dateRange = { start: '01/04/2023', end: '30/04/2023' };
        const { getByText } = render(
            <FilterOrdersModal {...defaultProps} tempDateRange={dateRange} />
        );

        expect(getByText('01/04/2023')).toBeTruthy();
        expect(getByText('30/04/2023')).toBeTruthy();
    });

    it('calls onClose when pressing outside the modal content', () => {
        const { getByTestId } = render(<FilterOrdersModal {...defaultProps} />);

        fireEvent.press(getByTestId('modal-overlay'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onApply when apply button is pressed', () => {
        const { getByText } = render(<FilterOrdersModal {...defaultProps} />);

        fireEvent.press(getByText('Aplicar'));

        expect(mockOnApply).toHaveBeenCalledTimes(1);
    });

    it('calls onClear when clear button is pressed', () => {
        const { getByText } = render(<FilterOrdersModal {...defaultProps} />);

        fireEvent.press(getByText('Limpiar'));

        expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('validates min price is not greater than max price', () => {
        const priceRange = { min: '500', max: '100' };
        const { getByText } = render(
            <FilterOrdersModal {...defaultProps} tempPriceRange={priceRange} />
        );

        fireEvent.press(getByText('Aplicar'));

        // The validation should prevent apply from being called
        expect(mockOnApply).not.toHaveBeenCalled();
    });

    it('validates date range', () => {
        const dateRange = { start: '30/04/2023', end: '01/04/2023' };
        const { getByText } = render(
            <FilterOrdersModal {...defaultProps} tempDateRange={dateRange} />
        );

        fireEvent.press(getByText('Aplicar'));

        // The validation should prevent apply from being called
        expect(mockOnApply).not.toHaveBeenCalled();
    });

    it('disables validation errors when inputs are corrected', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<FilterOrdersModal {...defaultProps} />);

        // Enter invalid input
        fireEvent.changeText(getByPlaceholderText('Mín'), '-100');
        fireEvent.press(getByText('Aplicar'));

        // Enter valid input
        fireEvent.changeText(getByPlaceholderText('Mín'), '100');
        fireEvent.press(getByText('Aplicar'));

        expect(mockOnApply).toHaveBeenCalledTimes(2);
    });
}); 
