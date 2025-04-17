"use client"
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import styles from "./Manufacturers.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import ProductsForm from "./manufacturerForm";

import theme from "@/theme";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, InputAdornment, Button, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import AddIcon from '@mui/icons-material/Add';

import { getManufacturers } from "./adapters/microserviceProducts";


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
    const translations = useTranslations('Manufacturers')

    const tableSchema: GridColDef[] = [
        { field: 'nombre', headerName: translations('table_col_1'), flex: 3, headerClassName: styles.Header },
        { field: 'pais', headerName: translations('table_col_2'), flex: 1, headerClassName: styles.Header },
        { field: 'acciones', headerName: translations('table_col_3'), flex: 2, headerClassName: styles.Header },
    ]

    const [manufacturers, setManufacturers] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openFileModal, setOpenFileModal] = useState(false);

    const fetchProducts = async () => {
            const manufacturerList = await getManufacturers();
            setManufacturers(manufacturerList);
        }

    useEffect(() => {
        fetchProducts();
        }, []);
        
    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Grid container>
                    <ProductsForm open={isOpen} onClose={() => setIsOpen(false)} onProductAdded={fetchProducts} title={translations('new_manufacturer_form_title')}/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text={translations('title')} />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                    <Button
                                        onClick={() => setIsOpen(true)}
                                        variant="contained"
                                        color="cpp"
                                        startIcon={<AddIcon />}
                                    >
                                        Registrar Fabricante
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                            <DataTable columns={tableSchema} rows={manufacturers} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default Products