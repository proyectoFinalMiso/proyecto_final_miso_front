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
    const [formData, setFormData] = useState({ id_producto: "", cantidad: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        const changeStock  = await updateStock(
            {
                id_producto: formData.id_producto,
                cantidad: parseInt(formData.cantidad),
            }
        );
        onClose();
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
                            Ingresar los datos del nuevo stock del producto
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="ID Producto"
                                name="id_producto"
                                value={formData.id_producto}
                                onChange={handleChange}
                                margin="normal"
                                title="Producto"
                            />
                            {/* <TextField
                                fullWidth
                                label="Lote"
                                name="lote"
                                value={formData.lote}
                                onChange={handleChange}
                                margin="normal"
                                title="Lote"
                            /> */}
                            <TextField
                                fullWidth
                                label="Cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                margin="normal"
                                title="Cantidad"
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