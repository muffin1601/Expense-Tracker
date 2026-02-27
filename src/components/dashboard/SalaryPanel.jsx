import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { X, ChevronDown, ChevronRight } from "lucide-react"
import styles from "./SalaryPanel.module.css"

export default function SalaryPanel() {
  const today = new Date()

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [data, setData] = useState([])

  useEffect(() => {
    fetchSalaryData()
  }, [selectedMonth, selectedYear])

  async function fetchSalaryData() {
    const { data } = await supabase
      .from("expenses")
      .select(`
        amount,
        site_persons (
          id,
          name,
          sites ( name )
        )
      `)
      .eq("month", selectedMonth)
      .eq("year", selectedYear)

    const grouped = {}

    data?.forEach(item => {
      const person = item.site_persons
      if (!person) return

      if (!grouped[person.id]) {
        grouped[person.id] = {
          person_name: person.name,
          site_name: person.sites?.name,
          total_amount: 0
        }
      }

      grouped[person.id].total_amount += Number(item.amount)
    })

    setData(Object.values(grouped))
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" })
  }))

  return (
    <div className={styles.salaryCard}>

      {/* Header */}
      <div className={styles.header}>
        <h3>Monthly Salary Report</h3>
        <X size={16} className={styles.closeIcon} />
      </div>

      {/* Month Selector */}
      <div className={styles.monthSelector}>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
        >
          {monthOptions.map(month => (
            <option key={month.value} value={month.value}>
              {month.label} {selectedYear}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.dropdownIcon} />
      </div>

      {/* Column Headers */}
      <div className={styles.tableHeader}>
        <span>Person</span>
        <span>Total</span>
      </div>

      {/* List */}
      <div className={styles.list}>
        {data.map((person, index) => (
          <div key={index} className={styles.row}>
            <div>
              <div className={styles.personName}>
                {person.person_name}
              </div>
              <div className={styles.siteName}>
                {person.site_name}
              </div>
            </div>

            <div className={styles.amount}>
              ₹{person.total_amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer} onClick={() => (window.location.href = "/sites")}>
        <span>View Full Report</span>
        <ChevronRight size={16} />
      </div>

    </div>
  )
}