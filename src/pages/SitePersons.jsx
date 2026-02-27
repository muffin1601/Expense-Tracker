import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useParams, useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, Search, ArrowLeft, X } from "lucide-react"
import styles from "./SitePersons.module.css"

export default function SitePersons() {
  const { siteId } = useParams()
  const navigate = useNavigate()

  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const [siteName, setSiteName] = useState("")
  const [persons, setPersons] = useState([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSite()
    fetchPersons()
  }, [])

  async function fetchSite() {
    const { data } = await supabase
      .from("sites")
      .select("name")
      .eq("id", siteId)
      .single()

    setSiteName(data?.name || "")
  }

  async function fetchPersons() {
    setLoading(true)

    const { data: personsData } = await supabase
      .from("site_persons")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false })

    const result = []

    for (const person of personsData || []) {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("person_id", person.id)
        .eq("month", month)
        .eq("year", year)

      const total = (expenses || []).reduce(
        (sum, e) => sum + Number(e.amount),
        0
      )

      result.push({
        ...person,
        total
      })
    }

    setPersons(result)
    setLoading(false)
  }

  function openModal(person = null) {
    setEditingPerson(person)
    setName(person?.name || "")
    setPhone(person?.phone || "")
    setShowModal(true)
  }

  async function savePerson(e) {
    e.preventDefault()

    if (editingPerson) {
      await supabase
        .from("site_persons")
        .update({ name, phone })
        .eq("id", editingPerson.id)
    } else {
      await supabase
        .from("site_persons")
        .insert([{ name, phone, site_id: siteId }])
    }

    setShowModal(false)
    fetchPersons()
  }

  async function deletePerson(id) {
    if (!window.confirm("Delete this person?")) return
    await supabase.from("site_persons").delete().eq("id", id)
    fetchPersons()
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.phone && p.phone.includes(search))
  )

  const totalMonthly = persons.reduce((sum, p) => sum + p.total, 0)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/sites")}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            className={styles.addBtn}
            onClick={() => openModal()}
          >
            <Plus size={16} />
            Add Person
          </button>
        </div>

        <div className={styles.header}>
          <h1>{siteName}</h1>
          <span>{persons.length} Persons</span>
        </div>

        <div className={styles.summaryCard}>
          <div>Current Month Total</div>
          <div className={styles.totalAmount}>
            ₹{totalMonthly.toLocaleString()}
          </div>
        </div>

        <div className={styles.searchBar}>
          <Search size={16} />
          <input
            placeholder="Search name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No persons found</div>
        ) : (
          <div className={styles.list}>
            {filtered.map(person => (
              <div
                key={person.id}
                className={styles.card}
                onClick={() => navigate(`/persons/${person.id}`)}
              >
                <div className={styles.personInfo}>
                  <div className={styles.name}>{person.name}</div>
                  <div className={styles.phone}>
                    {person.phone || "No phone"}
                  </div>
                  <div className={styles.amount}>
                    ₹{person.total.toLocaleString()}
                  </div>
                </div>

                <div
                  className={styles.actions}
                  onClick={e => e.stopPropagation()}
                >
                  <Pencil
                    size={16}
                    onClick={() => openModal(person)}
                  />
                  <Trash2
                    size={16}
                    onClick={() => deletePerson(person.id)}
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
                <h3>{editingPerson ? "Edit Person" : "Add Person"}</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={savePerson}>
                <input
                  placeholder="Person Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />

                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />

                <button type="submit">Save</button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}