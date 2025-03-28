import styles from "./Products.module.css"

import DataTable from "../../../globalComponents/Datatable";
import PageTitle from "../../../globalComponents/PageTitle";
import theme from "@/theme";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";    
import Button from "@mui/material/Button";

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
      cpp: true;
      dark: true;
    }
  }

const Products: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Grid container>
                    <Grid sx={{ direction: 'column' }} size="grow">
                        <PageTitle text="Productos" />
                        <Grid container size="grow" sx={{ direction: 'row', marginLeft: '6.25rem', height: '40px' }}>
                            <Grid size="grow">
                                <TextField fullWidth id="buscar-producto" className={styles.TextField}
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
                                        borderRadius: "16px",
                                        height: "40px",
                                    },
                                    "& .MuiInputBase-input": {
                                        height: "40px",                                 
                                        padding: "10px", // Adjust padding to align text properly
                                    },
                                }} />                                
                            </Grid>
                            <Grid size="grow" sx={{ marginRight: '6.25rem' }}>
                                <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
                                    <Button variant="outlined" color="dark" endIcon={<FilterListIcon />}>Filtrar</Button>
                                    <Button variant="contained" color="cpp" startIcon={<AddIcon />}>Registrar Producto</Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid size="grow" sx={{ margin: '1.25rem 6.25rem' }}>
                            <DataTable />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default Products