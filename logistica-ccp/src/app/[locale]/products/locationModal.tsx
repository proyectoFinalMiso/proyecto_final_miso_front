import {
  Modal,
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { getStore } from './adapters/microserviceProducts';
import { useTranslations } from 'next-intl';
interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  locationInfo: { sku: string; storeId: string };
}

export default function LocationModal({
  open,
  onClose,
  locationInfo,
}: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const t = useTranslations('Products')

  useEffect(() => {
    if (!open || !locationInfo.sku) return;

    const getStoreByKey = async () => {
      setLoading(true);
      const response = await getStore(locationInfo.storeId);
      setLoading(false);
      console.log({ response });
      setStore(response);
    };

    getStoreByKey();
  }, [open, locationInfo.sku]);

  const handleClose = async () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-ruta-entrega"
      aria-describedby="modal-ruta-entrega-descripcion"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'RGBA(248, 248, 248, 0.6)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '3',
          direction: 'column',
          minHeight: '28.75rem',
          padding: '1.25rem',
          width: '40rem',
          display: 'flex',
          flexDirection: 'column',
        }}
        title={t('location_modal_title')}
      >
        <Box
          sx={{
            flex: '1',
            marginBottom: '20px',
          }}
          title={t('location_modal_title')}
        >
          <Typography
            id="modal-formulario-route-title"
            variant="h6"
            title="Form title"
            gutterBottom
          >
            {t('location_modal_title')}
          </Typography>
          <Typography
            id="modal-formulario-route-subtitle"
            sx={{ color: '#B0B0B0', marginBottom: '20px' }}
            title="Form subtitle"
          >
            {t('location_modal_subtitle')} {locationInfo?.sku || ''}
          </Typography>
          {loading ? (
            <div className="h-[14.25rem] w-full flex justify-center items-center">
              <CircularProgress size={30} color="inherit" />
            </div>
          ) : (
            <div>
              <iframe
                title="Google Maps Location"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                src={`https://www.google.com/maps?q=${
                  store[0]?.latitude || ''
                },${store[0]?.longitude || ''}&z=15&output=embed`}
                allowFullScreen
              />
            </div>
          )}
        </Box>
        <Stack direction={'row'} spacing={4} justifyContent={'center'}>
          <Button onClick={onClose} variant="contained" color="error">
            {t('button_close')}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
