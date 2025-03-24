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
    <div className={`${styles.Footer}`}>
      <Divider flexItem />
      <Box>
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
                value={language}
                label="Language"
                onChange={handleChange}
                variant="standard"
                disableUnderline
              >
                <MenuItem value={"ES_LA"}>Español (Latinoamérica)</MenuItem>
                <MenuItem value={"EN_US"}>English (Estados Unidos)</MenuItem>
                <MenuItem value={"EN_UK"}>English (United Kingdom)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Footer;
