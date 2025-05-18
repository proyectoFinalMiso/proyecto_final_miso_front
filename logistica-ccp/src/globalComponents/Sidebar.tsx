'use client'
import Link from "next/link";
import styles from "./Sidebar.module.css"
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Grid2";

import ConfigMenu from '../globalComponents/ConfigMenu'
import { useTheme } from "@mui/material";

import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {

  if (typeof window !== 'undefined') { }

  const translations = useTranslations('Sidebar')
  const theme = useTheme()

  const pathname = usePathname()
  const isRootRoute = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);
  if (isRootRoute) return null;

  return (
    <div 
      className={`${styles.Sidebar_body} flex`} 
      data-testid="sidebar" 
      title="CPP Menu"
      style={{ backgroundColor: theme.palette.background.sidebar, color: theme.palette.text.sidebar }}
    >
      <aside className={`${styles.Sidebar}`}>
        <Grid container direction='column' 
        sx={{ 
          height: '100%',
          display: 'flex', 
          flexDirection: 'column' 
          }}>

          <Grid sx={{ marginBottom: '2rem' }}>
            <h1 className="text-xl font-bold">CPP</h1>
          </Grid>

          <Grid sx={{ flexGrow: 1 }}>
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
                <li className="mb-3">
                  <Link href="/sales" className="hover:text-gray-300">
                    {translations("option_6")}
                  </Link>
                </li>
              </ul>
            </nav>
            </Grid>

            <Grid sx={{ margin: '1.25rem 0' }}>
                <ConfigMenu />
            </Grid>

        </Grid>
      </aside>
    </div>
  );
};

export default Sidebar;
