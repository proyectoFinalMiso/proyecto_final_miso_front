import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterVisitModal from '../../components/RegisterVisitModal';
import { Alert } from 'react-native';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: { [key: string]: string } = {
        'registerVisitModal.title': 'Registrar visita',
        'registerVisitModal.status': 'Estado',
        'registerVisitModal.scheduled': 'Programada',
        'registerVisitModal.completed': 'Completada',
        'registerVisitModal.date': 'Fecha',
        'registerVisitModal.time': 'Hora',
        'registerVisitModal.register': 'Registrar',
        'registerVisitModal.sending': 'Enviando...',
        'registerVisitModal.success': 'La visita se ha registrado correctamente',
        'registerVisitModal.error': 'Ocurrió un error al registrar la visita',
        'registerVisitModal.invalidFutureDate': 'Una visita programada debe tener fecha y hora en el futuro',
        'common.cancel': 'Cancelar',
        'common.success': 'Éxito',
        'common.error': 'Error'
      };
      return translations[key] || fallback || key;
    }
  })
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const mockComponent = jest.fn(props => {
    return {
      type: 'DateTimePicker',
      props,
      children: []
    };
  });
  return mockComponent;
});

jest.mock('../../services/api/clientsService', () => ({
  sendVisit: jest.fn()
}));

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0 && buttons[0].onPress) {
    buttons[0].onPress();
  }
  return null;
});

describe('RegisterVisitModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    clientId: 'client-123',
    vendedorId: 'seller-456',
    clientName: 'Test Client',
    onSuccess: mockOnSuccess
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText, getByTestId } = render(<RegisterVisitModal {...defaultProps} />);

    expect(getByText('Registrar visita')).toBeTruthy();
    expect(getByText('Test Client')).toBeTruthy();
    expect(getByText('Estado')).toBeTruthy();
    expect(getByText('Programada')).toBeTruthy();
    expect(getByText('Completada')).toBeTruthy();
    expect(getByText('Fecha')).toBeTruthy();
    expect(getByText('Hora')).toBeTruthy();
    expect(getByText('Registrar')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByTestId('modal-close-button')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(<RegisterVisitModal {...defaultProps} visible={false} />);
    expect(queryByText('Registrar visita')).toBeNull();
  });

  it('calls onClose when close icon is pressed', () => {
    const { getByTestId } = render(<RegisterVisitModal {...defaultProps} />);
    fireEvent.press(getByTestId('modal-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing outside the modal content', () => {
    const { getByTestId } = render(<RegisterVisitModal {...defaultProps} />);
    fireEvent.press(getByTestId('modal-overlay'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is pressed', () => {
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);
    fireEvent.press(getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('toggles between scheduled and completed status', () => {
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);

    const scheduledButton = getByText('Programada');
    const completedButton = getByText('Completada');

    fireEvent.press(completedButton);
    
    fireEvent.press(scheduledButton);
  });

  it('validates future date for scheduled visits', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 1));
    
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);
    
    const sendVisit = require('../../services/api/clientsService').sendVisit;
    
    fireEvent.press(getByText('Registrar'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Una visita programada debe tener fecha y hora en el futuro'
      );
    });
    
    expect(sendVisit).not.toHaveBeenCalled();
    
    jest.useRealTimers();
  });

  it('handles successful visit registration for completed status', async () => {
    const sendVisit = require('../../services/api/clientsService').sendVisit;
    sendVisit.mockResolvedValue({ success: true });
    
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);

    fireEvent.press(getByText('Completada'));

    fireEvent.press(getByText('Registrar'));
    
    await waitFor(() => {
      expect(sendVisit).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Éxito',
        'La visita se ha registrado correctamente',
        expect.anything()
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles errors in visit registration', async () => {
    const sendVisit = require('../../services/api/clientsService').sendVisit;
    sendVisit.mockRejectedValue(new Error('Network error'));
    
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);
    
    fireEvent.press(getByText('Completada'));
    
    fireEvent.press(getByText('Registrar'));
    
    await waitFor(() => {
      expect(sendVisit).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Ocurrió un error al registrar la visita'
      );
    });
  });

  it('shows sending state while submitting', async () => {
    const sendVisit = require('../../services/api/clientsService').sendVisit;
    
    let resolvePromise: ((value: any) => void) | null = null;
    const visitPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    sendVisit.mockReturnValue(visitPromise);
    
    const { getByText, queryByText } = render(<RegisterVisitModal {...defaultProps} />);
    
    expect(getByText('Registrar')).toBeTruthy();
    expect(queryByText('Enviando...')).toBeNull();

    fireEvent.press(getByText('Completada'));

    fireEvent.press(getByText('Registrar'));

    await waitFor(() => {
      expect(queryByText('Registrar')).toBeNull();
      expect(getByText('Enviando...')).toBeTruthy();
    });
  });

  it('formats date correctly', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 4, 15, 14, 30));
    
    const { getByText } = render(<RegisterVisitModal {...defaultProps} />);

    expect(getByText('15/05/2025')).toBeTruthy();

    expect(getByText('14:30')).toBeTruthy();
    
    jest.useRealTimers();
  });
});
