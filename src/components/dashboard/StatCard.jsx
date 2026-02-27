import styles from './StatCard.module.css'

export default function StatCard({ title, value, icon, highlight }) {
  return (
    <div className={styles.statCard}>
      
      <div className={styles.statLeft}>
        <div className={`${styles.iconWrapper} ${highlight ? styles.greenIcon : ''}`}>
          {icon}
        </div>

        <div>
          <div className={styles.statTitle}>{title}</div>
          <div className={styles.statValue}>{value}</div>
        </div>
      </div>

      {highlight && (
        <div className={styles.trend}>
          ₹{value}
        </div>
      )}
      
    </div>
  )
}