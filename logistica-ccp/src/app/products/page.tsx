import DataTable from "../../../globalComponents/Datatable";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./Products.module.css"

import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from "@mui/material";

const Products: React.FC = () => {
    return (
        <Box>
            <Grid container>
                <Grid sx={{ direction: 'column' }}>
                    <h1>Productos</h1>
                    <Grid container size="grow" sx={{ direction: 'row', marginInline: '1.25rem', height: '40px' }}>
                        <Grid size="grow" sx={{ marginLeft: '6.25rem', paddingInline: '1.25rem' }}>
                            <TextField fullWidth id="buscar-producto" label="Buscar Producto" className={styles.TextField}
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
                                    height: "40px",
                                    margin: "auto",
                                },
                                "& .MuiInputBase-input": {
                                    height: "40px",                                    
                                    padding: "10px", // Adjust padding to align text properly
                                },
                            }} />                                
                        </Grid>
                        <Grid size="grow" sx={{ marginRight: '6.25rem', paddingInline: '1.25rem' }}>
                            <Button variant="outlined">Filtrar</Button>
                            <Button variant="contained">Registrar Producto</Button>
                        </Grid>
                    </Grid>
                    <Grid size="grow" sx={{ margin: '1.25rem' }}>
                        <DataTable />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Products