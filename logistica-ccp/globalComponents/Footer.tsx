// components/Layout.tsx
"use client"

import { useState } from "react";
import { Divider } from "@mui/material";
import styles from "./Footer.module.css"
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Footer: React.FC = () => {

  const [language, setLanguage] = useState('ES_LA');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
      <Box sx={{ marginInline: "3.125rem" }} data-testid="footer">
        <Divider flexItem />
        <Grid container sx={{ alignItems: "center" }}>
          <Grid size={6}>
            <p className={`${styles.Copyright}`}>Copyright © 2025. All rights reserved. </p>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              {/* <InputLabel id="language-select-label">Age</InputLabel> */}
              <Select
                labelId="language-select-label"
                id="language-select"
                label="Language"
                title="language-selector"
                onChange={handleChange}
                value={language}
                variant="standard"
                disableUnderline
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value={"ES_LA"}>Español (Latinoamérica)</MenuItem>
                <MenuItem value={"EN_US"}>English (United States)</MenuItem>
                <MenuItem value={"EN_UK"}>English (United Kingdom)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
  );
};

export default Footer;
