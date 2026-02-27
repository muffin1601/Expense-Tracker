import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Building2, Users, Wallet } from 'lucide-react'

import StatCard from '../components/dashboard/StatCard'
import MonthlyChart from '../components/dashboard/MonthlyChart'
import SitesTable from '../components/dashboard/SitesTable'
import SalaryPanel from '../components/dashboard/SalaryPanel'

import styles from './Dashboard.module.css'

export default function Dashboard() {
  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const [totalSites, setTotalSites] = useState(0)
  const [totalPersons, setTotalPersons] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  async function fetchStats() {
    const { count: siteCount } = await supabase
      .from('sites')
      .select('*', { count: 'exact', head: true })

    const { count: personCount } = await supabase
      .from('site_persons')
      .select('*', { count: 'exact', head: true })

    const { data } = await supabase
      .from('expenses')
      .select('amount')
      .eq('month', month)
      .eq('year', year)

    const total = (data || []).reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    setTotalSites(siteCount || 0)
    setTotalPersons(personCount || 0)
    setMonthTotal(total)
  }

  async function fetchChartData() {
    const { data } = await supabase
      .from('expenses')
      .select('month, amount')
      .eq('year', year)

    const grouped = {}

    data?.forEach(item => {
      if (!grouped[item.month]) grouped[item.month] = 0
      grouped[item.month] += Number(item.amount)
    })

    const formatted = Array.from({ length: 12 }, (_, i) => {
      const value = grouped[i + 1] || 0

      const opacity = 0.4 + (i / 11) * 0.6

      return {
        name: new Date(0, i).toLocaleString('default', { month: 'short' }),
        value,
        opacity
      }
    })

    setChartData(formatted)
  }

  return (
    <div className={styles.wrapper}>

      {/* Page Title */}
      {/* <h1 className={styles.pageTitle}>Dashboard</h1> */}

      {/* Stats */}
      <div className={styles.statsRow}>
        <StatCard
          title="Total Sites"
          value={totalSites}
          icon={<Building2 size={25} />}
        />

        <StatCard
          title="Total Persons"
          value={totalPersons}
          icon={<Users size={25} />}
        />

        <StatCard
          title="Current Month Expenses"
          value={`₹${monthTotal.toLocaleString()}`}
          icon={<Wallet size={25} />}
          highlight
        />
      </div>


      <div className={styles.middleRow}>
        <div className={styles.centercard}>
          <div className={`${styles.card} ${styles.chartCard}`}>
             <MonthlyChart data={chartData} />
          </div>
          <div className={styles.card}>
            
            <SitesTable />
          </div>
        </div>

        <div className={`${styles.card} ${styles.salaryCard}`}>
          {/* <div className={styles.cardTitle}>Monthly Salary Report</div> */}
          <SalaryPanel />
        </div>
      </div>
    </div>
  )
}