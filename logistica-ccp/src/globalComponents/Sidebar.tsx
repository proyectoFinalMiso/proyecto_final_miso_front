'use client'
import Link from "next/link";
import styles from "./Sidebar.module.css"
import { useTranslations } from "next-intl";
import { useThemeMode } from "../themeContext";
import { Button } from "@mui/material";

const Sidebar: React.FC = () => {
  const { toggleTheme, mode } = useThemeMode();
  const translations = useTranslations('Sidebar')

  return (
    <div className={`${styles.Sidebar_body} flex`} data-testid="sidebar" title="CPP Menu">
      <aside className={`${styles.Sidebar}`}>
        <h1 className="text-xl font-bold">CPP</h1>
        <nav className="mt-5">
          <ul>
            <li className="mb-3">
              <Link href="/manufacturers" className="hover:text-gray-300">
                {translations("option_1")}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/products" className="hover:text-gray-300">
                {translations("option_2")}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/stock" className="hover:text-gray-300">
                {translations("option_3")}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/sellers" className="hover:text-gray-300">
                {translations("option_4")}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/orders" className="hover:text-gray-300">
                {translations("option_5")}
              </Link>
            </li>
          </ul>
          <Button onClick={toggleTheme} variant="outlined" className="mt-4">
            Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
