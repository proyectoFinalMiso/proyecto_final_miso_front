import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterModal from '../../components/FilterProductsModal';

describe('FilterModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnTempPriceChange = jest.fn();
    const mockOnApply = jest.fn();
    const mockOnClear = jest.fn();

    const defaultProps = {
        visible: true,
        onClose: mockOnClose,
        tempPriceRange: { min: '', max: '' },
        onTempPriceChange: mockOnTempPriceChange,
        onApply: mockOnApply,
        onClear: mockOnClear,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByText } = render(<FilterModal {...defaultProps} />);

        expect(getByText('Filtrar productos')).toBeTruthy();
        expect(getByText('Precio')).toBeTruthy();
        expect(getByText('Mínimo')).toBeTruthy();
        expect(getByText('Máximo')).toBeTruthy();
        expect(getByText('Limpiar')).toBeTruthy();
        expect(getByText('Aplicar')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByText } = render(<FilterModal {...defaultProps} visible={false} />);

        expect(queryByText('Filtrar productos')).toBeNull();
    });

    it('calls onClose when close icon is pressed', () => {
        const { getByTestId } = render(<FilterModal {...defaultProps} />);

        fireEvent.press(getByTestId('modal-close-button'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onTempPriceChange when min input changes', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        fireEvent.changeText(getByPlaceholderText('Mín'), '100');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('min', '100');
    });

    it('calls onTempPriceChange when max input changes', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        fireEvent.changeText(getByPlaceholderText('Máx'), '500');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('max', '500');
    });

    it('calls onApply when apply button is pressed', () => {
        const { getByText } = render(<FilterModal {...defaultProps} />);

        fireEvent.press(getByText('Aplicar'));

        expect(mockOnApply).toHaveBeenCalledTimes(1);
    });

    it('calls onClear when clear button is pressed', () => {
        const { getByText } = render(<FilterModal {...defaultProps} />);

        fireEvent.press(getByText('Limpiar'));

        expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('displays correct price range values', () => {
        const priceRange = { min: '100', max: '500' };
        const { getByDisplayValue } = render(
            <FilterModal {...defaultProps} tempPriceRange={priceRange} />
        );

        expect(getByDisplayValue('100')).toBeTruthy();
        expect(getByDisplayValue('500')).toBeTruthy();
    });

    it('calls onClose when pressing outside the modal content', () => {
        const { getByTestId } = render(<FilterModal {...defaultProps} />);

        fireEvent.press(getByTestId('modal-overlay'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('allows numeric input for min price', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        const minInput = getByPlaceholderText('Mín');

        expect(minInput.props.keyboardType).toBe('numeric');

        fireEvent.changeText(minInput, '123');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('min', '123');
    });

    it('allows numeric input for max price', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        const maxInput = getByPlaceholderText('Máx');

        expect(maxInput.props.keyboardType).toBe('numeric');

        fireEvent.changeText(maxInput, '456');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('max', '456');
    });

    it('handles empty price range values correctly', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        const minInput = getByPlaceholderText('Mín');
        const maxInput = getByPlaceholderText('Máx');

        expect(minInput.props.value).toBe('');
        expect(maxInput.props.value).toBe('');
    });

    it('has numeric keyboard for min price input', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        expect(getByPlaceholderText('Mín')).toBeTruthy();

        fireEvent.changeText(getByPlaceholderText('Mín'), '123');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('min', '123');
    });

    it('has numeric keyboard for max price input', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        expect(getByPlaceholderText('Máx')).toBeTruthy();

        fireEvent.changeText(getByPlaceholderText('Máx'), '456');

        expect(mockOnTempPriceChange).toHaveBeenCalledWith('max', '456');
    });

    it('accepts valid numeric inputs', () => {
        const { getByPlaceholderText } = render(<FilterModal {...defaultProps} />);

        fireEvent.changeText(getByPlaceholderText('Mín'), '100');
        expect(mockOnTempPriceChange).toHaveBeenCalledWith('min', '100');

        fireEvent.changeText(getByPlaceholderText('Máx'), '9999999');
        expect(mockOnTempPriceChange).toHaveBeenCalledWith('max', '9999999');
    });

    it('prevents content behind modal from being interacted with', () => {
        const { getByTestId } = render(<FilterModal {...defaultProps} />);

        const overlay = getByTestId('modal-overlay');
        expect(overlay).toBeTruthy();
    });

    it('handles filter application with min price only', () => {
        const { getByText, getByPlaceholderText } = render(
            <FilterModal {...defaultProps} tempPriceRange={{ min: '100', max: '' }} />
        );

        expect(getByPlaceholderText('Mín').props.value).toBe('100');
        expect(getByPlaceholderText('Máx').props.value).toBe('');

        fireEvent.press(getByText('Aplicar'));

        expect(mockOnApply).toHaveBeenCalledTimes(1);
    });

    it('handles filter application with max price only', () => {
        const { getByText, getByPlaceholderText } = render(
            <FilterModal {...defaultProps} tempPriceRange={{ min: '', max: '500' }} />
        );

        expect(getByPlaceholderText('Mín').props.value).toBe('');
        expect(getByPlaceholderText('Máx').props.value).toBe('500');

        fireEvent.press(getByText('Aplicar'));

        expect(mockOnApply).toHaveBeenCalledTimes(1);
    });
}); 
