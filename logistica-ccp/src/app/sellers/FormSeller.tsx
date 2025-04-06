import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { createSeller } from "./adapters/microserviceSeller";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

export default function FormSeller({ open, onClose, title = "Formulario"}: ModalFormProps) {
    const [formData, setFormData] = useState({nombre: "", email: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        const newSeller = await createSeller(
            {
                nombre: formData.nombre,
                email: formData.email
            }
        );
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-form-seller"
            aria-describedby="modal-form-seller-descripcion"
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
                        title="Formulario nuevo vendedor"
                    >
                        <Typography id="modal-form-seller-title" variant="h6" title="Form title" gutterBottom>
                            {title}
                        </Typography>
                        <Typography 
                            id="modal-form-seller-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            Agregar vendedor
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
                                label="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                title="email"
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