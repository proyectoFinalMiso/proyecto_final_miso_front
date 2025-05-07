"use client"
import React, { useState, useEffect } from "react";
import styles from "./Sales.module.css"
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { useTranslations } from "next-intl";
import ModalReport from "./ModalReport";

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

interface Sales {
    id: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    meta_ventas: number;
    productos: number;
}


const Sales: React.FC = () => {
    const t = useTranslations('Sales')

    const tableSchema: GridColDef[] = [
        {field: 'ID Plan Ventas', headerName: t('table_col_1'), flex: 1, headerClassName: styles.Header},
        {field: 'Estado', headerName: t('table_col_2'), flex: 1, headerClassName: styles.Header},
        {field: 'Fecha Inicio', headerName: t('table_col_3'), flex: 1, headerClassName: styles.Header},
        {field: 'Fecha Fin', headerName: t('table_col_4'), flex: 1, headerClassName: styles.Header},
        {field: 'Meta Ventas', headerName: t('table_col_5'), flex: 1, headerClassName: styles.Header},
        {field: 'Productos', headerName: t('table_col_6'), flex: 1, headerClassName: styles.Header}
    ]

    const [isOpenReport, setIsOpenReport] = useState(false);
    const [sales, setSales] = useState<Sales[]>([])


    return (
        <Box>
            <Grid container>
                <ModalReport open={isOpenReport} onClose={() => setIsOpenReport(false)} />
                <Grid sx={{ direction: 'column' }} size="grow">
                <PageTitle text={t('title')} />
                    <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                        <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                            <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                <Button
                                    onClick={() => setIsOpenReport(true)}
                                    variant="contained"
                                    color="cpp"
                                    startIcon={<AddIcon />}
                                    data-testid="addStock"
                                >
                                    {t('Report')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                        <DataTable columns={tableSchema} rows={sales} />
                    </Grid>
                </Grid>
                

            </Grid>
        </Box>
    )}

export default Sales;
