import React from "react";
import { Typography } from "@mui/material";
import styles from "./PageTitle.module.css"

interface TitleProps {
  text: string;
}

const PageTitle: React.FC<TitleProps> = ({ text }) => {
  return <Typography variant="h1" className={styles.PageTitle}>{text}</Typography>;
};

export default PageTitle;
