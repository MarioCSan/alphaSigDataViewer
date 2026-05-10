import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Edge {label}</div>
      <div style={{ color: 'var(--blue)' }}>Signals: {payload[0]?.value}</div>
    </div>
  )
}

export default function EdgeDistributionChart({ data }) {
  if (!data?.length) return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
      No data in this period
    </div>
  )

  return (
    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        Edge Distribution
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Signals" fill="var(--purple)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
