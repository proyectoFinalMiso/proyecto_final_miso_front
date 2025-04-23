'use client'

import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES, enUS } from "@mui/x-data-grid/locales"
import styles from './Datatable.module.css'
import { useLocale } from "next-intl";

const paginationModel = { page: 0, pageSize: 10 };

type DataTableProps = {
    columns: GridColDef[];
    rows: object[];
}

export default function DataTable({ columns, rows }: DataTableProps) {
    const styledColumns = columns.map(col => ({
        ...col,
        headerClassName: styles.Header
    }))

    const locale = useLocale()

    const getLocaleText = () => {
        switch (locale) {
            case 'en':
                return enUS.components.MuiDataGrid.defaultProps.localeText;
            case 'es':
                default:
                    return esES.components.MuiDataGrid.defaultProps.localeText;
        }
    }
    return (
        <Paper sx={{ height: '100%', width: '100%', marginTop: '1.25rem', borderRadius: "16px" }}>
            <DataGrid
                rows={rows}
                columns={styledColumns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{ border: 0, borderRadius: "16px" }}
                getRowHeight={(params) => null}
                localeText={getLocaleText()}
            />  
        </Paper>
    );
}