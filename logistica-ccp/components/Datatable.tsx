'use client'

import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const tableSchema: GridColDef[] = [
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 500 },
    { field: 'sku', headerName: 'SKU', width: 130, type: 'number' },
    { field: 'volumen', headerName: 'Volumen', width: 130, type: 'number' },
    { field: 'fabricante', headerName: 'Fabricante', width: 200 },
    { field: 'valorUnitario', headerName: 'Valor Unitario', width: 130, type: 'number' },
    { field: 'fechaCreacion', headerName: 'Fecha de Creación', width: 200 }
]

const mockData: Object[] = [
    { id: 1, nombreProducto: 'Lápiz CarbonGraph Caja x 12 und', 'sku': 10001, 'volumen': 0.001, 'fabricante': 'Comercializadora El Sol', 'valorUnitario': 14200, 'fechaCreacion': '2024-03-24 04:34:12' },
    { id: 2, nombreProducto: 'Cuaderno Universitario 100 hojas, Rayado, Colores Surtidos', 'sku': 10002, 'volumen': 0.002, 'fabricante': 'Distribuidora Santa Fe', 'valorUnitario': 14200, 'fechaCreacion': '2024-03-24 04:34:12' },
    { id: 3, nombreProducto: 'Mochila Escolar Reforzada, Diseño Ergonómico, Varios Compartimentos', 'sku': 10003, 'volumen': 0.012, 'fabricante': 'Suministros Express', 'valorUnitario': 14200, 'fechaCreacion': '2024-03-24 04:34:12' },
    { id: 4, nombreProducto: 'Agenda Ejecutiva Semanal, Tapa Dura, Cierre Elástico', 'sku': 10004, 'volumen': 0.002, 'fabricante': 'Suministros Express', 'valorUnitario': 14200, 'fechaCreacion': '2024-03-24 04:34:12' },
    { id: 5, nombreProducto: 'Coche a Control Remoto, Escala 1:18, Alta Velocidad', 'sku': 10005, 'volumen': 0.011, 'fabricante': 'Econotrade América', 'valorUnitario': 14200, 'fechaCreacion': '2024-03-24 04:34:12' }
]

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    return (
        <Paper sx={{ height: 400, width: '86rem', margin: 'auto', marginTop: '1.25rem' }}>
            <DataGrid
                rows={mockData}
                columns={tableSchema}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                sx={{ border: 0 }}
            />
        </Paper>
    );
}