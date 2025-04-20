'use client';
import { useState, useEffect } from 'react';

import styles from './Products.module.css';
import DataTable from '../../../globalComponents/Datatable';
import PageTitle from '../../../globalComponents/PageTitle';
import ProductsForm from './productsForm';
import UploadProductsModal from './uploadModal';

import theme from '@/theme';
import Grid from '@mui/material/Grid2';
import { ThemeProvider, Box, Stack, Button, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';

import { getProducts } from './adapters/microserviceProducts';
import { getStock } from '../stock/adapters/microserviceStock';
import LocationModal from './locationModal';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    cpp: true;
    dark: true;
  }
}

interface Product {
  sku: string;
  nombre: string;
  volumen: number;
  fabricante: string;
  valorUnitario: number;
  fechaCreacion: string;
}

const Products: React.FC = () => {
  const tableSchema: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
      headerClassName: styles.Header,
    },
    {
      field: 'nombre',
      headerName: 'Nombre Producto',
      flex: 4,
      headerClassName: styles.Header,
    },
    {
      field: 'volumen',
      headerName: 'Volumen',
      flex: 1,
      type: 'number',
      headerClassName: styles.Header,
    },
    {
      field: 'fabricante',
      headerName: 'Fabricante',
      flex: 2,
      headerClassName: styles.Header,
    },
    {
      field: 'valorUnitario',
      headerName: 'Valor Unitario',
      flex: 1,
      headerClassName: styles.Header,
    },
    {
      field: 'fechaCreacion',
      headerName: 'Fecha de Creación',
      flex: 2,
      headerClassName: styles.Header,
    },
    {
      field: 'verUbicacionGeografica',
      headerName: 'Ver Ubicación Geográfica',
      flex: 1,
      headerClassName: styles.Header,
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        const hasStock = stock.find((item) => item.sku === params?.row?.sku);
        return hasStock ? (
          <RemoveRedEye
            sx={{ color: 'gray', cursor: 'pointer' }}
            onClick={() => {
              console.log({ hasStock });
              setlocationModal({
                sku: params?.row?.sku || '',
                storeId: hasStock?.bodega || '',
              });
              setOpenLocationModal(true);
            }}
          />
        ) : (
          <Tooltip title="Sin stock disponible">
            <ReportGmailerrorredOutlinedIcon
              sx={{ color: '#C62828' }}
              fontSize="small"
            />
          </Tooltip>
        );
      },
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);

  const [stock, setStock] = useState<any[]>([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [locationModal, setlocationModal] = useState({
    sku: '',
    storeId: '',
  });

  const fetchProducts = async () => {
    const productList = await getProducts();
    setProducts(productList);
  };

  const fetchStock = async () => {
    const stockData = await getStock();
    setStock(stockData);
  };

  useEffect(() => {
    fetchStock();
    fetchProducts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Grid container>
          <LocationModal
            open={openLocationModal}
            onClose={() => setOpenLocationModal(false)}
            locationInfo={locationModal}
          />
          <ProductsForm
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onProductAdded={fetchProducts}
            title="Nuevo Producto"
          />
          <UploadProductsModal
            open={openFileModal}
            onClose={() => setOpenFileModal(false)}
            onProductAdded={fetchProducts}
            title="Nuevo Producto"
          />
          <Grid sx={{ direction: 'column' }} size="grow">
            <PageTitle text="Productos" />
            <Grid
              container
              size="grow"
              sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}
            >
              {/* <Grid size="grow">
                                <TextField fullWidth id="buscar-producto" className={styles.TextField}
                                    placeholder="Buscar por Nombre o SKU"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            borderRadius: "16px",
                                            height: "40px",
                                        },
                                        "& .MuiInputBase-input": {
                                            height: "40px",
                                            padding: "10px",
                                        },
                                    }} />
                            </Grid> */}
              <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                  <Button
                    onClick={() => setOpenFileModal(true)}
                    variant="outlined"
                    color="dark"
                    endIcon={<FileUploadIcon />}
                  >
                    Cargar con archivo
                  </Button>
                  <Button
                    onClick={() => setIsOpen(true)}
                    variant="contained"
                    color="cpp"
                    startIcon={<AddIcon />}
                  >
                    Registrar Producto
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
              <DataTable columns={tableSchema} rows={products} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Products;
