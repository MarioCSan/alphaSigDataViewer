import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, fontVariantNumeric: 'tabular-nums' }}>
          {p.name}: {p.value >= 0 ? '+' : ''}${Number(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  )
}

export default function PnLChart({ data }) {
  if (!data?.length) return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
      No resolved trades in this period
    </div>
  )

  const isPositive = data[data.length - 1]?.cumulative >= 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Cumulative PnL
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#3fb950' : '#f85149'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? '#3fb950' : '#f85149'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${v}`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
            <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              name="Cumulative PnL"
              stroke={isPositive ? '#3fb950' : '#f85149'}
              fill="url(#pnlGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Per-Trade PnL
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${v}`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="pnl"
              name="Trade PnL"
              radius={[3, 3, 0, 0]}
              fill="#58a6ff"
              label={false}
              cell={(entry) => entry.pnl >= 0 ? '#3fb950' : '#f85149'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
