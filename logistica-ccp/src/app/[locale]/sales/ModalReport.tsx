import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Modal, Box, Select, Typography, TextField, Button, Stack, MenuItem, InputLabel } from "@mui/material"
import Grid from "@mui/material/Grid2";

import { useTranslations } from "next-intl";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ModalReport({ open, onClose }: ModalProps) {
    const t = useTranslations('Sales')

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
                        minHeight: "40rem", 
                        margin: "auto",
                        padding: "2rem",
                        width: "60rem",
                        }}
                        title="Formulario Ingresar Producto a Stock"
                    >
                        <Typography id="modal-formulario-producto-title"
                                variant="h6"
                                title="Form title"
                                gutterBottom>
                            {t('modal_title')}
                        </Typography>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                                width="850"
                                height="600"
                                src="https://lookerstudio.google.com/embed/reporting/dded8e5f-cdcb-4201-8842-943b616ab40f/page/eEUJF"
                                // frameborder="0"
                                style={{ border: 0, display: 'block', margin: '0 auto' }} 
                                allowFullScreen
                                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
                            </iframe>
                        </div>
                        
                        <Button onClick={onClose} variant="contained" color="error" sx={{ display: 'block', margin: '1rem auto' }}>
                            {t('modal_button_close')}
                        </Button>

                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}