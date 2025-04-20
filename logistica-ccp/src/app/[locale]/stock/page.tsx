"use client"
import { useState, useEffect } from "react";

import styles from "./Stock.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import FormProduct from "./FormProduct";

import theme from "@/theme";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import AddIcon from '@mui/icons-material/Add';

import { getStock } from "./adapters/microserviceStock";
import { useTranslations } from "next-intl";


declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

interface Stock {
    nombre: string;
    bodega: string;
    posicion: string;
    sku: string;
    lote: string;
    cantidad: number;
}

const Stock: React.FC = () => {
    const t = useTranslations('Stock')

    const tableSchema: GridColDef[] = [
        {field: 'nombre', headerName: t('table_col_1'), flex: 4, headerClassName: styles.Header},
        {field: 'bodega', headerName: t('table_col_2'), flex: 1, headerClassName: styles.Header},
        {field: 'posicion', headerName: t('table_col_3'), flex: 1, headerClassName: styles.Header},
        {field: 'sku', headerName: t('table_col_4'), flex: 1, headerClassName: styles.Header},
        {field: 'lote', headerName: t('table_col_5'), flex: 1, headerClassName: styles.Header},
        {field: 'cantidadDisponible', headerName: t('table_col_6'), flex: 1, type: 'number', headerClassName: styles.Header},
        {field: 'cantidadReservada', headerName: t('table_col_7'), flex: 1, type: 'number', headerClassName: styles.Header}
    ]

    const [stock, setStock] = useState<Stock[]>([])
    const [isOpenProducto, setIsOpenProducto] = useState(false);

    const fetchStock = async () => {
                const stockList = await getStock();
                setStock(stockList);
            }
    
    useEffect(() => {
            fetchStock();
        }, []);    

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Grid container>
                    <FormProduct open={isOpenProducto} onClose={() => setIsOpenProducto(false)}/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text="Stock" />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                    <Button
                                        onClick={() => setIsOpenProducto(true)}
                                        variant="contained"
                                        color="cpp"
                                        startIcon={<AddIcon />}
                                        data-testid="addStock"
                                    >
                                        {t('store_product')}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                            <DataTable columns={tableSchema} rows={stock} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default Stock;