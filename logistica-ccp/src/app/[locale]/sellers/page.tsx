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

import AddIcon from '@mui/icons-material/Add';

import { getSellers } from "./adapters/microserviceSeller";
import { useTranslations } from "next-intl";

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
    const t = useTranslations('Sellers')

    const tableSchema: GridColDef[] = [
        { field: 'nombre', headerName: t('table_col_1'), flex: 1, headerClassName: styles.Header },
        { field: 'email', headerName: t('table_col_2'), flex: 4, headerClassName: styles.Header },
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
                    <FormSeller open={isOpen} onClose={() => setIsOpen(false)}/>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text={t('title')} />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                    <Button
                                        onClick={() => setIsOpen(true)}
                                        variant="contained"
                                        color="cpp"
                                        startIcon={<AddIcon />}
                                    >
                                        {t('new_seller')}
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