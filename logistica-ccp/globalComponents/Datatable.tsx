'use client'

import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales"
import styles from './Datatable.module.css'

const tableSchema: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', flex: 1, headerClassName: styles.Header},
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

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    return (
        <Paper sx={{ height: '100%', width: '100%', marginTop: '1.25rem', borderRadius: "16px" }}>
            <DataGrid
                rows={mockData}
                columns={tableSchema}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                sx={{ border: 0, borderRadius: "16px" }}
                getRowHeight={(params) => null}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />  
        </Paper>
    );
}