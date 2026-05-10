function Card({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 140,
      flex: 1,
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span style={{ fontSize: 24, fontWeight: 700, color: color || 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  )
}

export default function StatsCards({ stats }) {
  if (!stats) return null

  const pnl = stats.total_pnl
  const pnlColor = pnl > 0 ? 'var(--green)' : pnl < 0 ? 'var(--red)' : 'var(--text)'
  const winColor = stats.win_rate >= 0.5 ? 'var(--green)' : 'var(--red)'

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Card
        label="Total PnL"
        value={`${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`}
        sub={`avg ${stats.avg_pnl >= 0 ? '+' : ''}$${stats.avg_pnl.toFixed(2)} / trade`}
        color={pnlColor}
      />
      <Card
        label="Win Rate"
        value={`${(stats.win_rate * 100).toFixed(1)}%`}
        sub={`${stats.wins} / ${stats.resolved} resolved`}
        color={winColor}
      />
      <Card
        label="Signals"
        value={stats.total_signals}
        sub={`${stats.resolved} resolved`}
        color="var(--blue)"
      />
      <Card
        label="Sharpe"
        value={stats.sharpe ?? '—'}
        sub="risk-adjusted return"
        color={stats.sharpe > 1 ? 'var(--green)' : stats.sharpe < 0 ? 'var(--red)' : 'var(--text)'}
      />
      <Card
        label="Max Drawdown"
        value={`-$${stats.max_drawdown.toFixed(2)}`}
        sub={`best $${stats.best_trade?.toFixed(2)}`}
        color="var(--yellow)"
      />
      <Card
        label="Worst Trade"
        value={`$${stats.worst_trade?.toFixed(2)}`}
        sub={`best $${stats.best_trade?.toFixed(2)}`}
        color="var(--red)"
      />
    </div>
  )
}
