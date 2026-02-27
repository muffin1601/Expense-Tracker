import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { Plus, Trash2, Calendar, X, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./PersonExpenses.module.css"

export default function PersonExpenses() {
  const { personId } = useParams()
  const navigate = useNavigate()

  const today = new Date()

  const [person, setPerson] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [expenseDate, setExpenseDate] = useState(
    today.toISOString().split("T")[0]
  )

  useEffect(() => {
    fetchPerson()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [selectedMonth, selectedYear])

  async function fetchPerson() {
    const { data } = await supabase
      .from("site_persons")
      .select("*, sites(name)")
      .eq("id", personId)
      .single()

    setPerson(data)
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("expense_categories")
      .select("*")
    setCategories(data || [])
  }

  async function fetchExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select("*, expense_categories(name)")
      .eq("person_id", personId)
      .eq("month", selectedMonth)
      .eq("year", selectedYear)
      .order("expense_date", { ascending: false })

    const list = data || []
    setExpenses(list)

    const sum = list.reduce((acc, item) => acc + Number(item.amount), 0)
    setTotal(sum)
  }

  async function addExpense(e) {
    e.preventDefault()

    await supabase.from("expenses").insert([
      {
        person_id: personId,
        category_id: categoryId,
        amount,
        expense_date: expenseDate,
        month: selectedMonth,
        year: selectedYear
      }
    ])

    setShowModal(false)
    setAmount("")
    fetchExpenses()
  }

  async function deleteExpense(id) {
  const confirmDelete = window.confirm("Are you sure you want to delete this expense?")

  if (!confirmDelete) return

  await supabase.from("expenses").delete().eq("id", id)
  fetchExpenses()
}

  return (
  <div className={styles.wrapper}>
    <div className={styles.container}>

      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          className={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{person?.name}</h1>

          <div className={styles.metaInfo}>
            <span className={styles.subText}>
              {person?.sites?.name}
            </span>

            {person?.phone && (
              <span className={styles.phone}>
                +91 {person.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryLabel}>Total This Month</div>
        <div className={styles.totalAmount}>
          ₹{total.toLocaleString()}
        </div>
      </div>

      <div className={styles.list}>
        {expenses.map(exp => (
          <div key={exp.id} className={styles.expenseCard}>
            <div className={styles.expenseLeft}>
              <div className={styles.iconWrapper}>
                <Calendar size={14} />
              </div>

              <div>
                <div className={styles.category}>
                  {exp.expense_categories?.name}
                </div>
                <div className={styles.date}>
                  {exp.expense_date}
                </div>
              </div>
            </div>

            <div className={styles.expenseRight}>
              <div className={styles.amount}>
                ₹{Number(exp.amount).toLocaleString()}
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => deleteExpense(exp.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Expense</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className={styles.form} onSubmit={addExpense}>
              <select
                className={styles.input}
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                className={styles.input}
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />

              <input
                className={styles.input}
                type="date"
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
              />

              <button type="submit" className={styles.submitBtn}>
                Save Expense
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  </div>
)
}