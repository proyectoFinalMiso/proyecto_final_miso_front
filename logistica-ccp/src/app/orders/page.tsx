'use client';
import { useState, useEffect } from 'react';

import styles from './Orders.module.css';
import DataTable from '../../globalComponents/Datatable';
import PageTitle from '../../globalComponents/PageTitle';
import theme from '@/theme';
import Grid from '@mui/material/Grid2';
import { ThemeProvider, Box, InputAdornment, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import { getOrders } from './adapters/microserviceOrders';
import RouteModal from './routeModal';

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
  const tableSchema: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id Pedido',
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'fechaIngreso',
      headerName: 'Fecha Generación',
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      flex: 1,
      headerClassName: styles.Header,
      align: 'left',
    },
    {
      field: 'latitud',
      headerName: 'Latitud',
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'longitud',
      headerName: 'Longitud',
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
    },
    {
      field: 'verRuta',
      headerName: 'Ver Ruta de Entrega',
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

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = (value: string) => {
    setSearchTerm(value);
    const filtered = allOrders.filter((order) =>
      order.id.toLowerCase().includes(value.toLowerCase())
    );
    setOrders(filtered);
  };

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
            <PageTitle text="Pedidos" />
            <Grid
              container
              size="grow"
              sx={{
                direction: 'row',
                marginLeft: '6.25rem',
                height: '40px',
              }}
            >
              <Grid size="grow">
                <TextField
                  fullWidth
                  id="buscar-producto"
                  className={styles.TextField}
                  placeholder="Buscar por ID"
                  value={searchTerm}
                  onChange={(e) => filteredOrders(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '16px',
                      height: '40px',
                    },
                    '& .MuiInputBase-input': {
                      height: '40px',
                      padding: '10px',
                    },
                  }}
                />
              </Grid>
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
