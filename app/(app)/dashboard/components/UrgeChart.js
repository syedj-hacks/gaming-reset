'use client'

// Split out of the dashboard page so recharts is code-split into its own chunk
// (loaded on demand via next/dynamic) rather than the main dashboard bundle.
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../dashboard.module.css'

export default function UrgeChart({ weeks }) {
  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeks} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
          <XAxis dataKey="week" stroke="transparent" tickLine={false}
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          <YAxis stroke="transparent" tickLine={false} width={40} allowDecimals={false}
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{
            background: '#0d1017', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '10px', color: '#f1f5f9',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px',
          }} labelStyle={{ color: '#3b82f6' }} />
          <Bar dataKey="Resisted" stackId="a" fill="#22c55e" maxBarSize={38} />
          <Bar dataKey="Gave in" stackId="a" fill="#ef4444" maxBarSize={38} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
