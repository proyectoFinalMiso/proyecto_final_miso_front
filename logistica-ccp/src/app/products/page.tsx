"use client"
import { useState } from "react";

import styles from "./Products.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import FormularioProducto from "./FormularioProducto";

import theme from "@/theme";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, InputAdornment, Button, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';


declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

const Products: React.FC = () => {
    const tableSchema: GridColDef[] = [
        { field: 'sku', headerName: 'SKU', flex: 1, headerClassName: styles.Header },
        { field: 'nombreProducto', headerName: 'Nombre Producto', flex: 4, headerClassName: styles.Header },
        { field: 'volumen', headerName: 'Volumen', flex: 1, type: 'number', headerClassName: styles.Header },
        { field: 'fabricante', headerName: 'Fabricante', flex: 2, headerClassName: styles.Header },
        { field: 'valorUnitario', headerName: 'Valor Unitario', flex: 1, headerClassName: styles.Header },
        { field: 'fechaCreacion', headerName: 'Fecha de Creación', flex: 2, headerClassName: styles.Header }
    ]

    const mockData: Object[] = [
        { id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' },
        { id: 2, nombreProducto: 'Cuaderno Universitario 100 hojas, Rayado, Colores Surtidos', 'sku': 10002, 'volumen': 0.002, 'fabricante': 'Distribuidora Santa Fe', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' },
        { id: 3, nombreProducto: 'Mochila Escolar Reforzada, Diseño Ergonómico, Varios Compartimentos', 'sku': 10003, 'volumen': 0.012, 'fabricante': 'Suministros Express', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' },
        { id: 4, nombreProducto: 'Agenda Ejecutiva Semanal, Tapa Dura, Cierre Elástico', 'sku': 10004, 'volumen': 0.002, 'fabricante': 'Suministros Express', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' },
        { id: 5, nombreProducto: 'Coche a Control Remoto, Escala 1:18, Alta Velocidad', 'sku': 10005, 'volumen': 0.011, 'fabricante': 'Econotrade América', 'valorUnitario': '$14200 COP', 'fechaCreacion': '2024-03-24 04:34:12' }
    ]

    const [isOpen, setIsOpen] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Grid container>
                    <FormularioProducto open={isOpen} onClose={() => setIsOpen(false)} title="Nuevo Producto"/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text="Productos" />
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
                            <DataTable columns={tableSchema} rows={mockData} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default Products