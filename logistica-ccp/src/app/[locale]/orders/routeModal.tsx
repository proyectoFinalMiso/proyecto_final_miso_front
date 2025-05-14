'use client';

import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import styles from './Orders.module.css';
import { GridColDef } from '@mui/x-data-grid';
import { createDeliveryRoute } from './adapters/microserviceOrders';
import DataTable from '../../../globalComponents/Datatable';
import { useTranslations } from 'next-intl';
interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  routeInfo: { pedidoId: string; clienteId: string; direccion: string };
}

export default function RouteModal({
  open,
  onClose,
  routeInfo,
}: ModalFormProps) {
  const t = useTranslations('Orders');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<any[]>([]);
  useEffect(() => {
    if (!open || !routeInfo.pedidoId) return;

    const createRoute = async () => {
      setLoading(true);
      const response = await createDeliveryRoute(routeInfo.pedidoId);
      setLoading(false);
      setRoute(response);
    };

    createRoute();
  }, [open, routeInfo.pedidoId]);

  const handleClose = async () => {
    onClose();
  };

  const theme = useTheme();

  const tableSchema: GridColDef[] = [
    {
      field: 'id',
      headerName: t('route_modal_table_col_1'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'direccion',
      headerName: t('route_modal_table_col_2'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'cantidadDisponible',
      headerName: t('route_modal_table_col_3'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'cantidadRequerida',
      headerName: t('route_modal_table_col_4'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
  ];

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
          backgroundColor: theme.palette.background.paper,
          borderRadius: '16px',
          boxShadow: '3',
          direction: 'column',
          minHeight: '28.75rem',
          padding: '1.25rem',
          width: '40rem',
          display: 'flex',
          flexDirection: 'column',
        }}
        title="Modal ruta de entrega"
      >
        <Typography
          id="modal-formulario-route-title"
          variant="h6"
          title="Form title"
          gutterBottom
        >
          {t('route_modal_title')}
        </Typography>
        <Typography
          id="modal-formulario-route-subtitle"
          sx={{ color: '#B0B0B0' }}
          title="Form subtitle"
        >
          {t('route_modal_order')} {routeInfo.pedidoId}
        </Typography>
        <Typography
          id="modal-formulario-route-subtitle"
          sx={{ color: '#B0B0B0' }}
          title="Form subtitle"
        >
          {t('route_modal_customer')} {routeInfo.clienteId}
        </Typography>
        <Typography
          id="modal-formulario-route-subtitle"
          sx={{ color: '#B0B0B0' }}
          title="Form subtitle"
        >
          {t('route_modal_address')} {routeInfo.direccion}
        </Typography>
        <Box
          sx={{
            my: '1.25rem',
            overflowY: 'scroll',
            height: '14.25rem',
          }}
        >
          <div
            style={{
              minHeight: '14.25rem',
              height: 'auto',
              width: '100%',
            }}
          >
            {loading ? (
              <div className="h-[14.25rem] w-full flex justify-center items-center">
                <CircularProgress size={30} color="inherit" />
              </div>
            ) : (
              <Grid size="grow">
                <DataTable columns={tableSchema} rows={route} />
              </Grid>
            )}
          </div>
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
