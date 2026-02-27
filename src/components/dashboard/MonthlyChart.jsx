import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts"

import {
  Info,
  ChevronRight,
  TrendingUp
} from "lucide-react"

import styles from "./MonthlyChart.module.css"

export default function MonthlyChart({ data }) {
  const lastIndex = data.length - 1
  const lastValue = data[lastIndex]?.value || 0

  return (
    <div className={styles.monthlyCard}>

      {/* HEADER */}
      <div className={styles.monthlyHeader}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.monthlyTitle}>
            Monthly Expenses
          </h3>

          <div className={styles.infoIcon}>
            <Info size={14} />
          </div>
        </div>

        <button className={styles.manageBtn} onClick={() => (window.location.href = "/sites")}>
          Manage Sites
          <ChevronRight size={16} />
        </button>
      </div>

      {/* CHART */}
      <div className={styles.chartWrapper}>

        <ResponsiveContainer width="88%" height={260}>
          <BarChart data={data}>

            {/* GRADIENTS */}
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.5} />
              </linearGradient>

              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ecf8e" stopOpacity={1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.85} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.06)"
              }}
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
            >
              {data.map((entry, index) => {
                const isLast = index === lastIndex
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isLast ? "url(#greenGradient)" : "url(#blueGradient)"}
                    fillOpacity={isLast ? 1 : entry.opacity || 0.6}
                  />
                )
              })}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

        {/* SUMMARY */}
        <div className={styles.monthSummary}>
          <div className={styles.monthAmount}>
            ₹{lastValue.toLocaleString()}
          </div>

          <div className={styles.monthGrowth}>
            <TrendingUp size={14} />
            +10.5%
          </div>
        </div>

      </div>
    </div>
  )
}