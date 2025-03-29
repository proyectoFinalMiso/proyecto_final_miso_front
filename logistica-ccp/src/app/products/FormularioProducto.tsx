import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2";


interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title?: string
}

export default function FormularioProducto({ open, onClose, title = "Formulario" }: ModalFormProps) {
    const [formData, setFormData] = useState({ nombre: "", valorUnitario: "", fabricante: "", volumen: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData)
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
                        }}>
                        <Typography id="modal-formulario-producto-title" variant="h6" gutterBottom>
                            {title}
                        </Typography>
                        <Typography 
                            id="modal-formulario-producto-subtitle"
                            sx={{ color: "#B0B0B0" }}
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
                            />
                            <TextField
                                fullWidth
                                label="Valor Unitario"
                                name="valor-unitario"
                                value={formData.valorUnitario}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Fabricante"
                                name="fabricante"
                                value={formData.fabricante}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Volumen"
                                name="volumen"
                                value={formData.volumen}
                                onChange={handleChange}
                                margin="normal"
                                type="number"
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