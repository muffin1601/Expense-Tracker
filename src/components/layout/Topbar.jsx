import { Search, ChevronDown, LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styles from "./Topbar.module.css"

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <div className={styles.topbar}>

      {/* Search */}
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>

      {/* User Profile */}
      <div className={styles.profileWrapper} ref={dropdownRef}>

        <div
          className={styles.profile}
          onClick={() => setOpen(prev => !prev)}
        >
          <img
            src="/avatar.png"
            alt="User"
            className={styles.avatar}
          />


          <span className={styles.username}>
            {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
          </span>
          <ChevronDown size={16} />
        </div>

        {open && (
          <div className={styles.dropdown}>
            <div
              className={styles.dropdownItem}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </div>
          </div>
        )}

      </div>

    </div>
  )
}