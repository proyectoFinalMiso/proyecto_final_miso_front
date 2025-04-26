import { Button, Menu, MenuItem, Stack, Tooltip, Box } from '@mui/material'
import Grid from "@mui/material/Grid2";
import { useState, MouseEvent } from 'react';
import { useThemeMode } from "../themeContext";

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        cpp: true;
        dark: true;
    }
}

export default function ConfigMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const { toggleTheme, mode, toggleFont, font, setFontSize, fontSize } = useThemeMode();

    return (
        <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button variant="text" color='dark' onClick={handleClick}>
                ⚙️
            </Button>
            <Menu
                id='fade-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem sx={{ borderRadius: '30px' }}>
                    <Grid direction="column" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button onClick={toggleTheme} variant="outlined" className="mt-4">
                            Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
                        </Button>

                        <Tooltip title={`Cambiar a ${font === 'plusJakartaSans' ? 'Lexend Deca' : 'Plus Jakarta Sans'}`}>
                            <Button onClick={toggleFont} variant="outlined" className="mt-4">
                                Toggle Font
                            </Button>
                        </Tooltip>

                        <Button onClick={() => {
                            setFontSize((s) => {
                                const newSize = Math.max(s - 1, 10);
                                localStorage.setItem('fontSize', newSize.toString());
                                return newSize;
                            });
                        }}>A-</Button>

                        <Button onClick={() => {
                            setFontSize((s) => {
                                const newSize = Math.min(s + 1, 32);
                                localStorage.setItem('fontSize', newSize.toString());
                                return newSize;
                            });
                        }}>A+</Button>

                        <p style={{ fontSize }}>Current Font Size: {fontSize}px</p>
                    </Grid>
                </MenuItem>
            </Menu>
        </Grid>
    )
}