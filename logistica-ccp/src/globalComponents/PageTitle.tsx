import React from 'react';
import { Typography } from '@mui/material';
import styles from './PageTitle.module.css';

interface TitleProps {
  text: string;
  isCustom?: boolean;
  customClass?: string;
}

const PageTitle: React.FC<TitleProps> = ({
  text,
  isCustom = false,
  customClass = '',
}) => {
  return (
    <Typography
      variant="h1"
      className={isCustom ? customClass : styles.PageTitle}
    >
      {text}
    </Typography>
  );
};

export default PageTitle;
