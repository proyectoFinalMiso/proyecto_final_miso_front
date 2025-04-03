import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem, InputLabel } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { createProduct, getManufacturers } from "./adapters/microserviceProducts";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string
}
interface Manufacturer {
    id: string;
    nombre: string;
}

export default function ProductsForm({ open, onClose, title = "Formulario" }: ModalFormProps) {
    const [formData, setFormData] = useState({ nombre: "", valorUnitario: "", id_fabricante: "", volumen: "" });
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    useEffect(() => {
        getManufacturers().then(setManufacturers);
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        await createProduct(
            {
                nombre: formData.nombre,
                valorUnitario: parseInt(formData.valorUnitario),
                id_fabricante: formData.id_fabricante,
                volumen: formData.volumen
            }
        );
        onClose();
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData((prev) => ({ ...prev, id_fabricante: e.target.value }));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-formulario-producto"
            aria-describedby="modal-formulario-producto-descripcion"
            sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: "RGBA(248, 248, 248, 0.6)",
                    backdropFilter: "blur(4px)"
                }
            }}
        >
            <Box sx={{ height: "100%" }}>
                <Grid container sx={{ height: "100%" }}>
                    <Grid sx={{ 
                        backgroundColor: "white", 
                        borderRadius: "16px",
                        boxShadow: "3",
                        direction: "column", 
                        minHeight: "28.75rem", 
                        margin: "auto",
                        padding: "1.25rem",
                        width: "40rem",
                        }}
                        title="Formulario nuevo producto"
                    >
                        <Typography id="modal-formulario-producto-title" variant="h6" title="Form title" gutterBottom>
                            {title}
                        </Typography>
                        <Typography 
                            id="modal-formulario-producto-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            Agregar un producto a la plataforma
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                margin="normal"
                                title="Nombre del producto"
                            />
                            <TextField
                                fullWidth
                                label="Valor Unitario ($COP)"
                                name="valorUnitario"
                                value={formData.valorUnitario}
                                onChange={handleChange}
                                margin="normal"
                                title="Valor unitario del producto"
                            />
                            <Select
                                fullWidth
                                labelId="fabricante-select-label"
                                id="fabricante-select"
                                name="fabricante"
                                value={formData.id_fabricante}
                                onChange={handleSelectChange}
                                title="Fabricante del producto"
                            >
                                <MenuItem value="" disabled>
                                    Seleccione un fabricante
                                </MenuItem>
                                {manufacturers.map((manufacturer) => (
                                    <MenuItem key={manufacturer.id} value={manufacturer.id}>
                                        {manufacturer.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                fullWidth
                                label="Volumen"
                                name="volumen"
                                value={formData.volumen}
                                onChange={handleChange}
                                margin="normal"
                                type="number"
                                title="Volumen del producto"
                            />
                            <Stack 
                                direction={"row"} 
                                spacing={4} 
                                justifyContent={"center"}
                                sx={{ marginTop: "1.25rem" }}
                            >
                                <Button type="submit" variant="contained" color="cpp">
                                    Confirmar
                                </Button>
                                <Button onClick={onClose} variant="contained" color="error">
                                    Cancelar
                                </Button>
                            </Stack>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )

}