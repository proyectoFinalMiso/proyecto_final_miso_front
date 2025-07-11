'use client'

import { useState, useCallback } from "react";
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from "@mui/material";
import { Modal, Box, Typography, Button, Stack } from "@mui/material"
import Grid from "@mui/material/Grid2";
import { FileRejection, useDropzone } from "react-dropzone";
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { createProductsWithFile } from "./adapters/microserviceProducts";
import { useTranslations } from "next-intl";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

export default function UploadProductsModal({ open, onClose, onProductAdded }: ModalFormProps) {

    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const translations = useTranslations('Products')

    const handleClose = async () => {
        setConfirmDisabled(true);
        setError(null);
        setSelectedFile(null);
        await onProductAdded();
        onClose()
    }

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        await createProductsWithFile(selectedFile);
        setLoading(false);
        handleClose();        
    }

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            setError("Archivo inválido. Solo se permiten .xlsx, .csv o .json");
            setSelectedFile(null);
            setConfirmDisabled(true);
            return;
          }
          setError(null);
          setConfirmDisabled(false);
          setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv'],
            'application/json': ['.json'],
        },
    });

    const theme = useTheme()

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-carga-producto"
            aria-describedby="modal-carga-producto-descripcion"
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
                        title="Modal de carga de productos"
                    >
                        <Typography id="modal-formulario-producto-title" variant="h6" title="Form title" gutterBottom>
                            {translations('form_file_title')}
                        </Typography>
                        <Typography
                            id="modal-formulario-producto-subtitle"
                            sx={{ color: "#B0B0B0" }}
                            title="Form subtitle"
                        >
                            {translations('form_file_subtitle')}
                        </Typography>
                        
                        <Grid container sx={{ margin: "1.25rem 0" }}>
                            {error && <Typography color="error">{error}</Typography>}
                            <Grid sx={{ minHeight: "250px", padding: "auto", width: "100%" }} display={'flex'} flexDirection={'column'}>
                                <Grid {...getRootProps()} sx={[{
                                    alignContent: "center",
                                    alignItems: "center",
                                    background: theme.palette.background.default,
                                    border: "dashed",
                                    borderWidth: "1px",
                                    borderRadius: "6px",
                                    flexGrow: 1,
                                    margin: "auto",
                                    padding: "1.25rem",
                                    textAlign: "center",
                                    width: "100%",
                                },
                                {
                                    "&:hover": {
                                        backgroundColor: theme.palette.background.paper
                                    }
                                }]}>
                                    <UploadFileIcon sx={{ height: "4rem", width: "100%" }} />
                                    <input {...getInputProps()} title="Espacio de envio de archivos"/>
                                    <Typography id="modal-carga-producto-dropzone" title="Dropzone" variant="body2">
                                        {isDragActive ? translations('form_file_dropzone_drag') : translations('form_file_dropzone_text')}
                                    </Typography>
                                    {selectedFile && <Typography mt={1} variant="caption">{selectedFile.name}</Typography>}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Stack
                            direction={"row"}
                            spacing={4}
                            justifyContent={"center"}
                            sx={{ marginTop: "1.25rem" }}
                        >
                            <Button disabled={confirmDisabled} type="submit" variant="contained" color="cpp" onClick={handleUpload}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : translations('form_button_submit')}
                            </Button>
                            <Button onClick={onClose} variant="contained" color="error">
                                {translations('form_button_cancel')}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )

}