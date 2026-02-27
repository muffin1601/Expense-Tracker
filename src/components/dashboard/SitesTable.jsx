import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import styles from './SitesTable.module.css'

export default function SitesTable() {
  const navigate = useNavigate()

  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const [sites, setSites] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    fetchSites()
  }, [])

  async function fetchSites() {
    const { data } = await supabase
      .from('sites')
      .select(`
        id,
        name,
        location,
        site_persons (
          id,
          expenses (
            amount,
            month,
            year
          )
        )
      `)

    const formatted = data?.map(site => {
      const persons = site.site_persons || []

      const monthTotal = persons.reduce((sum, person) => {
        const personExpenses =
          person.expenses?.filter(
            e => e.month === month && e.year === year
          ) || []

        const personTotal = personExpenses.reduce(
          (s, e) => s + Number(e.amount),
          0
        )

        return sum + personTotal
      }, 0)

      return {
        id: site.id,
        name: site.name,
        location: site.location,
        persons: persons.length,
        currentMonth: monthTotal,
        total: monthTotal
      }
    }) || []

    const totalAll = formatted.reduce(
      (sum, site) => sum + site.currentMonth,
      0
    )

    setSites(formatted)
    setGrandTotal(totalAll)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Sites Overview</h3>
        <button
          className={styles.manageBtn}
          onClick={() => navigate('/sites')}
        >
          Manage Sites
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Site Name</th>
              <th>Location</th>
              <th>Persons</th>
              <th>Current Month</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sites.map(site => (
              <tr
                key={site.id}
                className={styles.clickableRow}
                onClick={() => navigate(`/sites/${site.id}`)}
              >
                <td className={styles.siteName}>{site.name}</td>
                <td className={styles.location}>{site.location}</td>
                <td className={styles.center}>{site.persons}</td>
                <td className={styles.amount}>
                  ₹{site.currentMonth.toLocaleString()}
                </td>
                <td className={styles.amount}>
                  ₹{site.total.toLocaleString()}
                </td>
                <td className={styles.arrow}>
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}

            <tr className={styles.totalRow}>
              <td colSpan="4">Total</td>
              <td className={styles.amount}>
                ₹{grandTotal.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}