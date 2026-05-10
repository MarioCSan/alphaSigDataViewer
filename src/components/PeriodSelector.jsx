const PERIODS = [
  { value: '1d',  label: '1D' },
  { value: '7d',  label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'all', label: 'All' },
]

export default function PeriodSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {PERIODS.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid',
            borderColor: value === p.value ? 'var(--blue)' : 'var(--border)',
            background: value === p.value ? 'rgba(88,166,255,0.15)' : 'var(--surface2)',
            color: value === p.value ? 'var(--blue)' : 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
