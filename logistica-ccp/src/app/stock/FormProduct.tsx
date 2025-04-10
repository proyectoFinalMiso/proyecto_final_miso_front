import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem, InputLabel } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { insertStock, getProducts, getBodega } from "./adapters/microserviceStock";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string
}

interface Product {
    id: string;
    nombre: string;
    sku: string;
    volumen: string,
    id_fabricante: string,
    fabricante: string,
    valorUnitario: string,
    fechaCreacion: string,
}

interface Bodega {
    id: string;
    nombre: string;
    direccion: string;
    latitude: string;
    longitude: string,
}

export default function FormStock({ open, onClose, title = "Formulario" }: ModalFormProps) {
    
    const [formData, setFormData] = useState({id_producto: "", producto: "", bodega: "", posicion: "", lote: "", cantidad: "", sku: "", valorUnitario:""});
    const [products, setProducts] = useState<Product[]>([]);
    const [bodegas, setBodegas] = useState<Bodega[]>([]);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    useEffect(() => {
        getBodega().then(setBodegas);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
        const changeStock  = await insertStock(
            {
                // id_producto: formData.id_producto,
                // cantidad: parseInt(formData.cantidad),

                nombre: formData.producto, //nombre producto
                bodega: formData.bodega, //id bodega
                posicion: "0317dd40-c3c9-46dc-bd65-a49e0cef27e4", //id posicion
                lote: formData.lote, //lote
                cantidad: formData.cantidad, //cantidad
                sku: formData.sku, //sku
                valorUnitario: formData.valorUnitario, //valor unitario
            }
        );
        onClose();
    };

    const handleSelectChangeProduct = (e: SelectChangeEvent<string>) => {
        const selectedProductId = e.target.value;

        // Busca el producto seleccionado en la lista de productos
        const selectedProduct = products.find((product) => product.id === selectedProductId);

        if (selectedProduct) {
            // Actualiza el estado con los datos del producto seleccionado
            setFormData((prev) => ({
                ...prev,
                id_producto: selectedProductId,
                producto: selectedProduct.nombre,
                sku: selectedProduct.sku,
                valorUnitario: selectedProduct.valorUnitario,
            }));
        }
        // setFormData((prev) => ({ ...prev, producto: e.target.value }));
    };

    const handleSelectChangeBodega = (e: SelectChangeEvent<string>) => {
        setFormData((prev) => ({ ...prev, bodega: e.target.value }));
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
                            <Select
                                fullWidth
                                labelId="product-select-label"
                                id="product-select"
                                name="producto"
                                value={formData.id_producto}
                                onChange={handleSelectChangeProduct}
                                title="Producto"
                            >
                                <MenuItem value="" disabled>
                                    Seleccionar un producto
                                </MenuItem>
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {`${product.sku} - ${product.nombre}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                fullWidth
                                label="Lote"
                                name="lote"
                                value={formData.lote}
                                onChange={handleChange}
                                margin="normal"
                                title="Lote"
                            />
                            <TextField
                                fullWidth
                                label="Cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                margin="normal"
                                title="Cantidad"
                            />
                            <Select
                                fullWidth
                                labelId="bodega-select-label"
                                id="bodega-select"
                                name="bodega"
                                value={formData.bodega}
                                onChange={handleSelectChangeBodega}
                                title="Bodega"
                            >
                                <MenuItem value="" disabled>
                                    Seleccionar una bodega
                                </MenuItem>
                                {bodegas.map((bodega) => (
                                    <MenuItem key={bodega.id} value={bodega.id}>
                                        {`${bodega.nombre}`}
                                    </MenuItem>
                                ))}
                            </Select>
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