'use client'

import { useState, useEffect } from "react";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem } from "@mui/material"
import { SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useTranslations } from "next-intl";
import { useTheme } from '@mui/material/styles';

import { createPlan } from "./adapters/microserviceSales";
import { getSellers } from "../sellers/adapters/microserviceSeller";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
}

interface Plan {
    id: string;
    vendedor_id: string;
    vendedor_nombre: string;
    estado: string;
    fecha_inicio: string;
    fecha_final: string;
    meta_ventas: number;
    productos_plan: number;
}

interface Seller {
    id: string;
    nombre: string;
    email: string;
    contrasena: string;
}

export default function FormCreatePlan({ open, onClose }: ModalFormProps) {
    const initialFormData = {
        vendedor_id: "",
        vendedor_nombre: "",
        meta_venta: "",
        productos_plan: "",
    };
    
    //'vendedor_id', 'vendedor_nombre', 'meta_ventas', 'productos_plan'
    const [formData, setFormData] = useState({vendedor_id: "", vendedor_nombre: "", meta_venta: "", productos_plan: ""});
    const [sellers, setSellers] = useState<Seller[]>([]);
    const t = useTranslations('Sales')

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
        }
        getSellers().then(setSellers);
    }, [open]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.vendedor_id || !formData.meta_venta || !formData.productos_plan) {
            alert(t('field_error_message'));
            return;
        }

        var requestData = {
            vendedor_id: formData.vendedor_id, //id vendedor
            vendedor_nombre: formData.vendedor_nombre, //nombre vendedor
            meta_ventas: formData.meta_venta, //meta de ventas
            productos_plan: formData.productos_plan, //productos del plan
        }

        const newPlan = await createPlan(
            requestData
        );
        console.log("Formulario enviado", requestData);
        onClose();
    };

    const handleSelectChangeSeller = (e: SelectChangeEvent<string>) => {
        const selectedSellerId = e.target.value;

        const selectedSeller = sellers.find((seller) => seller.id === selectedSellerId);

        if (selectedSeller) {
            setFormData((prev) => ({
                ...prev, 
                vendedor_id: selectedSellerId,
                vendedor_nombre: selectedSeller.nombre,
            }));
        }
        
    };

    const theme = useTheme();

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
                        backgroundColor: theme.palette.background.paper,
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
                            {t('form_single_title')}
                        </Typography>
                        <Typography 
                            id="modal-formulario-producto-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            {t('form_single_subtitle')}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Select
                                fullWidth
                                labelId="fabricante-select-label"
                                id="fabricante-select"
                                name="fabricante"
                                value={formData.vendedor_id}
                                onChange={handleSelectChangeSeller}
                                title="Fabricante del producto"
                            >
                                <MenuItem value="">
                                    {t('select_seller')}
                                </MenuItem>
                                {sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={seller.id}>
                                        {`${seller.nombre} - ${seller.email}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                fullWidth
                                label={t('form_single_field_1')}
                                name="meta_venta"
                                value={formData.meta_venta}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) { // Permitir solo números
                                        handleChange;
                                    }
                                }}
                                margin="normal"
                                title="Meta de venta del producto"
                            />
                            <TextField
                                fullWidth
                                label={t('form_single_field_2')}
                                name="productos_plan"
                                value={formData.productos_plan}
                                onChange={handleChange}
                                margin="normal"
                                title="Productos del plan"
                            />
                            <Stack 
                                direction={"row"} 
                                spacing={4} 
                                justifyContent={"center"}
                                sx={{ marginTop: "1.25rem" }}
                            >
                                <Button type="submit" variant="contained" color="cpp">
                                    {t('form_button_submit')}
                                </Button>
                                <Button onClick={onClose} variant="contained" color="error">
                                    {t('form_button_cancel')}
                                </Button>

                            </Stack>

                        </form>

                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}