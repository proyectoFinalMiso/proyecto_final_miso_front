import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { createSeller } from "./adapters/microserviceSeller";
import { useTranslations } from "next-intl";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
}

export default function FormSeller({ open, onClose }: ModalFormProps) {
    const [formData, setFormData] = useState({nombre: "", email: "", password: ""});
    const t = useTranslations('Sellers')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        const newSeller = await createSeller(
            {
                nombre: formData.nombre,
                email: formData.email,
                contrasena: formData.password
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
                            {t('form_title')}
                        </Typography>
                        <Typography 
                            id="modal-form-seller-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            {t('form_subtitle')}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                    fullWidth
                                    label={t('form_field_1')}
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    margin="normal"
                                    title="Nombre"
                                />
                            <TextField
                                fullWidth
                                label={t('form_field_2')}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                title="email"
                            />
                            <TextField
                                fullWidth
                                label={t('form_field_3')}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                title="seller-password"
                            />
                            <Stack 
                                direction={"row"} 
                                spacing={4} 
                                justifyContent={"center"}
                                sx={{ marginTop: "1.25rem" }}
                            >
                                <Button type="submit" variant="contained" color="cpp">
                                    {t('form_submit_button')}
                                </Button>
                                <Button onClick={onClose} variant="contained" color="error">
                                    {t('form_cancel_button')}
                                </Button>
                            </Stack>
                        </form>

                    </Grid>

                </Grid>
            </Box>
        </Modal>
    )
}