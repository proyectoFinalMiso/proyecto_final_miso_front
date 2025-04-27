'use client'

import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem, InputLabel } from "@mui/material"
import Grid from "@mui/material/Grid2";
import { useTheme } from '@mui/material/styles';

import { createManufacturer } from "./adapters/microserviceProducts";
import { useTranslations } from "next-intl";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

interface Manufacturer {
    id: string;
    nombre: string;
    pais: string;
}

export default function ProductsForm({ open, onClose, onProductAdded }: ModalFormProps) {
    const [formData, setFormData] = useState({ nombre: "", pais: "" });
    const translations = useTranslations('Manufacturers')

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

    const theme = useTheme()

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
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "16px",
                        boxShadow: "3",
                        direction: "column",
                        minHeight: "28.75rem",
                        margin: "auto",
                        padding: "1.25rem",
                        maxWidth: "40rem",
                    }}
                        title="Formulario nuevo fabricante"
                    >
                        <Typography id="modal-formulario-fabricante-title" variant="h6" title="Form title" gutterBottom>
                            {translations('form_title')}
                        </Typography>
                        <Typography
                            id="modal-formulario-fabricante-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            {translations('form_subtitle')}
                        </Typography>
                        <form onSubmit={handleSubmit} style={{ height: "20rem" }}>
                            <TextField
                                fullWidth
                                label={translations('form_field_1_placeholder')}
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                margin="normal"
                                title="Nombre del fabricante"
                            />
                            <TextField
                                fullWidth
                                label={translations('form_field_2_placeholder')}
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
                                sx={{ marginTop: "1.25rem", flexGrow: "1" }}
                            >
                                <Button type="submit" variant="contained" color="cpp">
                                    {translations('form_submit_button')}
                                </Button>
                                <Button onClick={onClose} variant="contained" color="error">
                                    {translations('form_cancel_button')}
                                </Button>
                            </Stack>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )

}