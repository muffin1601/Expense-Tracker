import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import styles from "./Sites.module.css"

export default function Sites() {
  const navigate = useNavigate()

  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    fetchSites()
  }, [])

  async function fetchSites() {
    setLoading(true)
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: false })

    setSites(data || [])
    setLoading(false)
  }

  function openModal(site = null) {
    setEditingSite(site)
    setName(site?.name || "")
    setLocation(site?.location || "")
    setShowModal(true)
  }

  async function saveSite(e) {
    e.preventDefault()

    if (editingSite) {
      await supabase
        .from("sites")
        .update({ name, location })
        .eq("id", editingSite.id)
    } else {
      await supabase
        .from("sites")
        .insert([{ name, location }])
    }

    setShowModal(false)
    fetchSites()
  }

  async function deleteSite(id) {
    if (!window.confirm("Delete this site?")) return
    await supabase.from("sites").delete().eq("id", id)
    fetchSites()
  }

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <h1>Sites</h1>

        <button
          className={styles.addBtn}
          onClick={() => openModal()}
        >
          <Plus size={16} />
          Add Site
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search size={16} />
        <input
          placeholder="Search sites..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : filteredSites.length === 0 ? (
        <div className={styles.empty}>No sites found</div>
      ) : (
        <div className={styles.list}>
          {filteredSites.map(site => (
            <div
              key={site.id}
              className={styles.card}
              onClick={() => navigate(`/sites/${site.id}`)}
            >
              <div>
                <div className={styles.name}>{site.name}</div>
                <div className={styles.location}>{site.location}</div>
              </div>

              <div
                className={styles.actions}
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil
                  size={16}
                  onClick={() => openModal(site)}
                />
                <Trash2
                  size={16}
                  onClick={() => deleteSite(site.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <div className={styles.modalHeader}>
              <h3>{editingSite ? "Edit Site" : "Add Site"}</h3>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={saveSite}>
              <input
                placeholder="Site Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <button type="submit">Save</button>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}