import { useState } from 'react'
import PeriodSelector from './components/PeriodSelector.jsx'
import StatsCards from './components/StatsCards.jsx'
import PnLChart from './components/PnLChart.jsx'
import EdgeDistributionChart from './components/EdgeDistributionChart.jsx'
import SignalsTable from './components/SignalsTable.jsx'
import { useData } from './hooks/useData.js'
import { fetchStats, fetchPnlChart, fetchSignals, fetchEdgeDistribution } from './lib/api.js'

const STATUS_FILTERS = ['ALL', 'PENDING', 'NOTIFIED', 'EXECUTED', 'RESOLVED', 'CANCELLED']

function Section({ title, children, action }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
      Loading…
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ color: 'var(--red)', padding: 20, fontSize: 12 }}>
      {msg?.includes('ENOENT') || msg?.includes('no such table')
        ? 'Database not found. Make sure alphaSIG has run at least once.'
        : msg}
    </div>
  )
}

export default function App() {
  const [period, setPeriod] = useState('7d')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const stats = useData(() => fetchStats(period), [period])
  const chart = useData(() => fetchPnlChart(period), [period])
  const edge = useData(() => fetchEdgeDistribution(period), [period])
  const signals = useData(() => fetchSignals(period, statusFilter), [period, statusFilter])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>◈</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>DayaView</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>alphaSIG Analytics</div>
          </div>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats Row */}
        {stats.loading ? <Spinner /> : stats.error ? <ErrorMsg msg={stats.error} /> : <StatsCards stats={stats.data} />}

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <Section title="PnL Over Time">
            {chart.loading ? <Spinner /> : chart.error ? <ErrorMsg msg={chart.error} /> : <PnLChart data={chart.data} />}
          </Section>
          <Section title="Edge Distribution">
            {edge.loading ? <Spinner /> : edge.error ? <ErrorMsg msg={edge.error} /> : <EdgeDistributionChart data={edge.data} />}
          </Section>
        </div>

        {/* Signals Table */}
        <Section
          title={`Signals ${signals.data ? `(${signals.data.length})` : ''}`}
          action={
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: statusFilter === s ? 'var(--blue)' : 'var(--border)',
                    background: statusFilter === s ? 'rgba(88,166,255,0.15)' : 'transparent',
                    color: statusFilter === s ? 'var(--blue)' : 'var(--text-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          }
        >
          {signals.loading ? <Spinner /> : signals.error ? <ErrorMsg msg={signals.error} /> : <SignalsTable signals={signals.data} />}
        </Section>
      </div>
    </div>
  )
}
