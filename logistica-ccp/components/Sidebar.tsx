// components/Layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css"

const Sidebar: React.FC = () => {
    
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`${styles.Sidebar} w-64 p-5`}>
        <h2 className="text-xl font-bold">My App</h2>
        <nav className="mt-5">
          <ul>
            <li className="mb-3">
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/settings" className="hover:text-gray-300">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">{}</main>
    </div>
  );
};

export default Sidebar;
