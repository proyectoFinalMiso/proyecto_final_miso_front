"use client"
import { useState, useEffect } from "react";

import styles from "./Stock.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import FormStock from "./FormStock";
import FormProduct from "./FormProduct";

import theme from "@/theme";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, InputAdornment, Button, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

import { getStock } from "./adapters/microserviceStock";


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
    const tableSchema: GridColDef[] = [
        {field: 'nombre', headerName: 'Nombre Producto', flex: 4, headerClassName: styles.Header},
        {field: 'bodega', headerName: 'Bodega', flex: 1, headerClassName: styles.Header},
        {field: 'posicion', headerName: 'Posición', flex: 1, headerClassName: styles.Header},
        {field: 'sku', headerName: 'SKU', flex: 1, headerClassName: styles.Header},
        {field: 'lote', headerName: 'Lote', flex: 1, headerClassName: styles.Header},
        {field: 'cantidad', headerName: 'Cantidad', flex: 1, type: 'number', headerClassName: styles.Header},
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
                    <FormProduct open={isOpenProducto} onClose={() => setIsOpenProducto(false)} title="Nuevo Producto"/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text="Stock" />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow">
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
                            </Grid>
                            <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                    <Button
                                        variant="outlined"
                                        color="dark"
                                        endIcon={<FilterListIcon />}
                                    >
                                        Filtrar
                                    </Button>
                                    <Button
                                        onClick={() => setIsOpenProducto(true)}
                                        variant="contained"
                                        color="cpp"
                                        startIcon={<AddIcon />}
                                    >
                                        Ingresar Producto
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