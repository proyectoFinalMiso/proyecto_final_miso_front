"use client"
import React, { useState, useEffect } from "react";
import styles from "./Sales.module.css"
import Grid from "@mui/material/Grid2";
import { ThemeProvider, Box, Stack, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { useTranslations } from "next-intl";

import ModalReport from "./ModalReport";
import { getSalesPlan, closePlan } from "./adapters/microserviceSales";
import FormCreatePlan from "./FormCreatePlan";
import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

interface Sales {
    vendedor: string;
    estado: string;
    fecha_inicio: string;
    fecha_final: string;
    meta_ventas: number;
    productos_plan: number;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const Sales: React.FC = () => {
    const t = useTranslations('Sales')

    const handleClosePlan = async (id: string) => {
        console.log(`Cerrar registro ${id}`);
        try {
            const response = await closePlan({ id });
            if (response) {
                console.log("Plan cerrado exitosamente");
            } else {
                console.error("Error al cerrar el plan");
            }
        } catch (error) {
            console.error("Error al cerrar el plan", error);
        }
    };

    const tableSchema: GridColDef[] = [
        {field: 'vendedor_nombre', headerName: t('table_col_1'), flex: 1, headerClassName: styles.Header},
        {field: 'estado', headerName: t('table_col_2'), flex: 1, headerClassName: styles.Header},
        {field: 'fecha_inicio', headerName: t('table_col_3'), flex: 1, headerClassName: styles.Header},
        {field: 'fecha_final', headerName: t('table_col_4'), flex: 1, headerClassName: styles.Header},
        {field: 'meta_ventas', headerName: t('table_col_5'), flex: 1, headerClassName: styles.Header},
        {field: 'productos_plan', headerName: t('table_col_6'), flex: 1, headerClassName: styles.Header},
        {field: 'acciones', headerName: t('table_col_7'), flex: 1, headerClassName: styles.Header,
            renderCell: (params) => (
                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                    <Button
                        variant="contained"
                        color="cpp"
                        onClick={() => handleClosePlan(params.row.id)}
                        disabled={params.row.estado == 'FINALIZADO'}
                    >
                        {t('close_plan')}
                    </Button>
                </Stack>
            )
        }
    ]

    const [isOpenReport, setIsOpenReport] = useState(false);
    const [isOpenCreatePlan, setIsOpenCreatePlan] = useState(false);
    const [sales, setSales] = useState<Sales[]>([])

    useEffect(() => {
        const fetchSalesPlan = async () => {
            const salesPlanList = await getSalesPlan();
            setSales(salesPlanList);
        };

        const interval = setInterval(() => {
            fetchSalesPlan();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Transform sales data to format dates before rendering
    const formattedSales = sales.map((sale) => ({
        ...sale,
        fecha_inicio: formatDate(sale.fecha_inicio),
        fecha_final: sale.fecha_final ? formatDate(sale.fecha_final) : "",
    }));

    return (
        <Box>
            <Grid container>
                <ModalReport open={isOpenReport} onClose={() => setIsOpenReport(false)} />
                <FormCreatePlan open={isOpenCreatePlan} onClose={() => setIsOpenCreatePlan(false)} />
                <Grid sx={{ direction: 'column' }} size="grow">
                <PageTitle text={t('title')} />
                    <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                        <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                            <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                <Button
                                    onClick={() => setIsOpenReport(true)}
                                    variant="contained"
                                    color="cpp"
                                    data-testid="openReport"
                                >
                                    {t('Report')}
                                </Button>
                                <Button
                                    onClick={() => setIsOpenCreatePlan(true)}
                                    variant="contained"
                                    color="cpp"
                                    startIcon={<AddIcon />}
                                    data-testid="addPlanForm"
                                >
                                    {t('sellers_plan')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                        <DataTable columns={tableSchema} rows={formattedSales} />
                    </Grid>
                </Grid>
                

            </Grid>
        </Box>
    )}

export default Sales;
