'use client'

import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales"
import styles from './Datatable.module.css'

const paginationModel = { page: 0, pageSize: 5 };

type DataTableProps = {
    columns: GridColDef[];
    rows: Object[];
}

export default function DataTable({ columns, rows }: DataTableProps) {
    const styledColumns = columns.map(col => ({
        ...col,
        headerClassName: styles.Header
    }))
    return (
        <Paper sx={{ height: '100%', width: '100%', marginTop: '1.25rem', borderRadius: "16px" }}>
            <DataGrid
                rows={rows}
                columns={styledColumns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                sx={{ border: 0, borderRadius: "16px" }}
                getRowHeight={(params) => null}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />  
        </Paper>
    );
}