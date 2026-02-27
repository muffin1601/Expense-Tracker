import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings
} from "lucide-react"
import { NavLink } from "react-router-dom"
import styles from "./Sidebar.module.css"

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <img
          src="/logo.webp"
          alt="Company Logo"
          className={styles.logo}
        />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/sites"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Building2 size={18} />
          <span>Sites</span>
        </NavLink>

        {/* <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <BarChart3 size={18} />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink> */}
      </nav>

    </div>
  )
}