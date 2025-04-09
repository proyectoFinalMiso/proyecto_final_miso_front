import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { updateStock } from "./adapters/microserviceStock";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string
}

export default function FormStock({ open, onClose, title = "Formulario" }: ModalFormProps) {
    const [formData, setFormData] = useState({ nombre: "",bodega: "", posicion: "", lote: "", cantidad: "", sku: "", valorUnitario:""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault();
        // console.log("Formulario enviado:", formData)
        // const changeStock  = await updateStock(
        //     {
        //         id_producto: formData.id_producto,
        //         cantidad: parseInt(formData.cantidad),
        //     }
        // );
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-formulario-crear-producto"
            aria-describedby="modal-formulario-crear-producto-descripcion"
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
                        title="Ingresar Lote"
                    >
                        <Typography id="modal-formulario-producto-title" variant="h6" title="Form title" gutterBottom>
                            {title}
                        </Typography>
                        <Typography 
                            id="modal-formulario-producto-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            Ingresar un nuevo producto al Inventario
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                margin="normal"
                                title="Nombre"
                            />
                            <TextField
                                fullWidth
                                label="Bodega"
                                name="bodega"
                                value={formData.bodega}
                                onChange={handleChange}
                                margin="normal"
                                title="Bodega"
                            />
                            <TextField
                                fullWidth
                                label="Posicion"
                                name="posicion"
                                value={formData.posicion}
                                onChange={handleChange}
                                margin="normal"
                                title="Posicion"
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