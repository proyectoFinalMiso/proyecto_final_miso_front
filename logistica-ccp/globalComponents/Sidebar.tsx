// components/Layout.tsx
import Link from "next/link";
import styles from "./Sidebar.module.css"

const Sidebar: React.FC = () => {
    
  return (
    <div className={`${styles.Sidebar_body} flex`}>
      {/* Sidebar */}
      <aside className={`${styles.Sidebar}`}>
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
            <li className="mb-3">
              <Link href="/products" className="hover:text-gray-300">
                Products
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
