'use client';
import { useState, useEffect } from 'react';

import styles from './Orders.module.css';
import DataTable from '../../../globalComponents/Datatable';
import PageTitle from '../../../globalComponents/PageTitle';
import theme from '@/theme';
import Grid from '@mui/material/Grid2';
import { ThemeProvider, Box, InputAdornment, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import { getOrders } from './adapters/microserviceOrders';
import RouteModal from './routeModal';
import { useTranslations } from 'next-intl';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    cpp: true;
    dark: true;
  }
}

interface Order {
  id: string;
  estado: string;
  fechaIngreso: string;
  cliente: string;
  vendedor: string;
  latitud: string;
  longitud: string;
  packingList: string;
  valorFactura: string;
  direccion: string;
}

const Orders: React.FC = () => {
  const t = useTranslations('Orders')
  const tableSchema: GridColDef[] = [
    {
      field: 'id',
      headerName: t('table_col_1'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'estado',
      headerName: t('table_col_2'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'fechaIngreso',
      headerName: t('table_col_3'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'cliente',
      headerName: t('table_col_4'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'vendedor',
      headerName: t('table_col_5'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'latitud',
      headerName: t('table_col_6'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'longitud',
      headerName: t('table_col_7'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'verRuta',
      headerName: t('table_col_8'),
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <RemoveRedEye
            sx={{ color: 'gray', cursor: 'pointer' }}
            onClick={() => {
              const order: Order | undefined = getOrderById(params.row.id);
              setmodalRouteData({
                pedidoId: order?.id || '',
                clienteId: order?.cliente || '',
                direccion: order?.direccion || '',
              });
              setOpenRouteModal(true);
            }}
          />
        );
      },
    },
  ];

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [openRouteModal, setOpenRouteModal] = useState(false);

  const [modalRouteData, setmodalRouteData] = useState({
    pedidoId: '',
    clienteId: '',
    direccion: '',
  });

  const getOrderById = (id: string) =>
    allOrders.find((order) => order.id === id);

  const fetchOrders = async () => {
    const ordersList = await getOrders();
    setAllOrders(ordersList);
    setOrders(ordersList);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container>
          <RouteModal
            open={openRouteModal}
            onClose={() => setOpenRouteModal(false)}
            routeInfo={modalRouteData}
          />
          <Grid sx={{ direction: 'column' }} size="grow">
            <PageTitle text={t('title')} />
            <Grid
              container
              size="grow"
              sx={{
                direction: 'row',
                marginLeft: '6.25rem',
                height: '40px',
              }}
            >
            </Grid>
            <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
              <DataTable columns={tableSchema} rows={orders} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Orders;
