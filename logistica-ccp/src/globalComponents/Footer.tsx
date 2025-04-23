"use client"

import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import styles from "./Footer.module.css"
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

const COOKIE_NAME = 'NEXT_LOCALE'

const Footer: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname();
  const translations = useTranslations('Footer')

  const [language, setLanguage] = useState('es');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Try to infer initial language from URL
    const localeFromUrl = pathname.split('/')[1];
    if (['es', 'en'].includes(localeFromUrl)) {
      setLanguage(localeFromUrl);
    }
  }, [pathname])

  const handleChange = (event: SelectChangeEvent) => {
    const selectedLanguage = event.target.value as string
    setLanguage(selectedLanguage);
    document.cookie = `${COOKIE_NAME}=${selectedLanguage}; path=/`;

    if (isMounted) {
      // Replace the locale part of the current URL
      const segments = pathname.split('/');
      segments[1] = selectedLanguage;
      const newPath = segments.join('/');

      router.push(newPath);
    }
  };

  return (
      <Box sx={{ marginInline: "3.125rem" }} data-testid="footer">
        <Divider flexItem />
        <Grid container sx={{ alignItems: "center" }}>
          <Grid size={6}>
            <p className={`${styles.Copyright}`} data-testid="copyright-title">{translations('copyright')}</p>
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
                <MenuItem value={"es"}>{translations('language_selector_1')}</MenuItem>
                <MenuItem value={"en"}>{translations('language_selector_2')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
  );
};

export default Footer;
