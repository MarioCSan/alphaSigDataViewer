const STATUS_COLOR = {
  PENDING: 'var(--text-muted)',
  NOTIFIED: 'var(--blue)',
  EXECUTED: 'var(--purple)',
  RESOLVED: 'var(--green)',
  CANCELLED: 'var(--text-muted)',
}

const DIR_COLOR = {
  BUY_YES: 'var(--green)',
  BUY_NO: 'var(--red)',
  NO_EDGE: 'var(--text-muted)',
}

function Badge({ value, color }) {
  return (
    <span style={{
      color,
      background: color + '22',
      padding: '2px 7px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {value}
    </span>
  )
}

export default function SignalsTable({ signals }) {
  if (!signals?.length) return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
      No signals in this period
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Date', 'Market', 'Direction', 'Edge', 'Market Price', 'Est. Prob', 'Size', 'PnL', 'Status'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {signals.map((s, i) => {
            const pnl = s.realized_pnl
            const pnlColor = pnl > 0 ? 'var(--green)' : pnl < 0 ? 'var(--red)' : 'var(--text-muted)'
            return (
              <tr
                key={s.signal_id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <td style={{ padding: '8px 12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s.generated_at.slice(0, 10)}
                </td>
                <td style={{ padding: '8px 12px', maxWidth: 300 }}>
                  {s.slug ? (
                    <a
                      href={`https://polymarket.com/markets/${s.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--text)', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.color = 'var(--blue)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text)'}
                      title={s.question}
                    >
                      {s.question.length > 60 ? s.question.slice(0, 60) + '…' : s.question}
                    </a>
                  ) : (
                    <span title={s.question}>
                      {s.question.length > 60 ? s.question.slice(0, 60) + '…' : s.question}
                    </span>
                  )}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <Badge value={s.direction} color={DIR_COLOR[s.direction] || 'var(--text)'} />
                </td>
                <td style={{ padding: '8px 12px', fontVariantNumeric: 'tabular-nums' }}>
                  {(s.edge * 100).toFixed(1)}%
                </td>
                <td style={{ padding: '8px 12px', fontVariantNumeric: 'tabular-nums' }}>
                  {s.market_price.toFixed(3)}
                </td>
                <td style={{ padding: '8px 12px', fontVariantNumeric: 'tabular-nums' }}>
                  {s.estimated_prob.toFixed(3)}
                </td>
                <td style={{ padding: '8px 12px', fontVariantNumeric: 'tabular-nums' }}>
                  ${s.position_size.toFixed(2)}
                </td>
                <td style={{ padding: '8px 12px', color: pnlColor, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {pnl != null ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}` : '—'}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <Badge value={s.status} color={STATUS_COLOR[s.status] || 'var(--text-muted)'} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
