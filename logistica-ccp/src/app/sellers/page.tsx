"use client"
import { useState, useEffect } from "react";

import styles from "./Seller.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import FormSeller from "./FormSeller";

import theme from "@/theme";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, InputAdornment, Button, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

import { getSellers } from "./adapters/microserviceSeller";

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

interface Seller {
    nombre: string;
    email: string;
}

const Seller: React.FC = () => {

    const tableSchema: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 1, headerClassName: styles.Header },
        { field: 'email', headerName: 'Email', flex: 4, headerClassName: styles.Header },
    ]

    const[sellers, setSellers] = useState<Seller[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchSeller = async () => {
            const productList = await getSellers();
            setSellers(productList);
        }
    
    useEffect(() => {
            fetchSeller();
        }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Grid container>
                    <FormSeller open={isOpen} onClose={() => setIsOpen(false)} title="Nuevo Vendedor"/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text="Vendedores" />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow">
                            <TextField fullWidth id="buscar-vendedor" className={styles.TextField}
                                    placeholder="Buscar por Nombre o E-mail"
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
                                        Registrar Vendedor
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                            <DataTable columns={tableSchema} rows={sellers} />                        
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
        
    )

}

export default Seller