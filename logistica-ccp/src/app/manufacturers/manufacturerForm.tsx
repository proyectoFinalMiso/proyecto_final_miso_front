import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem, InputLabel } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { createManufacturer } from "./adapters/microserviceProducts";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string
    onProductAdded: () => void;
}

interface Manufacturer {
    id: string;
    nombre: string;
    pais: string;
}

export default function ProductsForm({ open, onClose, title = "Formulario", onProductAdded }: ModalFormProps) {
    const [formData, setFormData] = useState({ nombre: "", pais: "" });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        const newManufacturer = await createManufacturer(
            {
                nombre: formData.nombre,
                pais: formData.pais
            }
        );
        await onProductAdded();
        onClose();
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData((prev) => ({ ...prev, id_fabricante: e.target.value }));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-formulario-fabricante"
            aria-describedby="modal-formulario-fabricante-descripcion"
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
                        title="Formulario nuevo fabricante"
                    >
                        <Typography id="modal-formulario-fabricante-title" variant="h6" title="Form title" gutterBottom>
                            {title}
                        </Typography>
                        <Typography 
                            id="modal-formulario-fabricante-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            Agregar un fabricante a la plataforma
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                margin="normal"
                                title="Nombre del fabricante"
                            />
                            <TextField
                                fullWidth
                                label="País"
                                name="pais"
                                value={formData.pais}
                                onChange={handleChange}
                                margin="normal"
                                title="País del fabricante"
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