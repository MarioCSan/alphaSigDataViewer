import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../alphaSIGCore/alphaSIG.sqlite')

function getDb() {
  return new Database(DB_PATH, { readonly: true })
}

function periodToDate(period) {
  const now = new Date()
  switch (period) {
    case '1d':  now.setDate(now.getDate() - 1); break
    case '7d':  now.setDate(now.getDate() - 7); break
    case '30d': now.setDate(now.getDate() - 30); break
    case '90d': now.setDate(now.getDate() - 90); break
    default:    return null
  }
  return now.toISOString()
}

// GET /api/stats?period=7d
app.get('/api/stats', (req, res) => {
  try {
    const db = getDb()
    const since = periodToDate(req.query.period)
    const whereClause = since ? `WHERE generated_at >= '${since}'` : ''

    const total = db.prepare(`SELECT COUNT(*) as count FROM signals ${whereClause}`).get()
    const resolved = db.prepare(
      `SELECT COUNT(*) as count FROM signals ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'RESOLVED'`
    ).get()
    const wins = db.prepare(
      `SELECT COUNT(*) as count FROM signals ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'RESOLVED' AND realized_pnl > 0`
    ).get()
    const pnlRow = db.prepare(
      `SELECT SUM(realized_pnl) as total, AVG(realized_pnl) as avg, MAX(realized_pnl) as best, MIN(realized_pnl) as worst FROM signals ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'RESOLVED'`
    ).get()

    const pnlList = db.prepare(
      `SELECT realized_pnl FROM signals ${whereClause ? whereClause + ' AND' : 'WHERE'} status = 'RESOLVED' ORDER BY generated_at ASC`
    ).all().map(r => r.realized_pnl)

    let sharpe = null
    if (pnlList.length > 1) {
      const mean = pnlList.reduce((a, b) => a + b, 0) / pnlList.length
      const std = Math.sqrt(pnlList.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / pnlList.length)
      sharpe = std > 0 ? (mean / std).toFixed(2) : null
    }

    let maxDrawdown = 0
    let peak = 0
    let cumulative = 0
    for (const pnl of pnlList) {
      cumulative += pnl
      if (cumulative > peak) peak = cumulative
      const drawdown = peak - cumulative
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    db.close()
    res.json({
      total_signals: total.count,
      resolved: resolved.count,
      wins: wins.count,
      win_rate: resolved.count > 0 ? (wins.count / resolved.count) : 0,
      total_pnl: pnlRow.total ?? 0,
      avg_pnl: pnlRow.avg ?? 0,
      best_trade: pnlRow.best ?? 0,
      worst_trade: pnlRow.worst ?? 0,
      sharpe,
      max_drawdown: maxDrawdown,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/pnl-chart?period=7d
app.get('/api/pnl-chart', (req, res) => {
  try {
    const db = getDb()
    const since = periodToDate(req.query.period)
    const whereClause = since
      ? `WHERE status = 'RESOLVED' AND generated_at >= '${since}'`
      : `WHERE status = 'RESOLVED'`

    const rows = db.prepare(
      `SELECT generated_at, realized_pnl, question FROM signals ${whereClause} ORDER BY generated_at ASC`
    ).all()

    let cumulative = 0
    const chart = rows.map(r => {
      cumulative += r.realized_pnl ?? 0
      return {
        date: r.generated_at.slice(0, 10),
        pnl: parseFloat((r.realized_pnl ?? 0).toFixed(2)),
        cumulative: parseFloat(cumulative.toFixed(2)),
        question: r.question,
      }
    })

    db.close()
    res.json(chart)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/signals?period=7d&status=RESOLVED
app.get('/api/signals', (req, res) => {
  try {
    const db = getDb()
    const since = periodToDate(req.query.period)
    const status = req.query.status

    let conditions = []
    if (since) conditions.push(`generated_at >= '${since}'`)
    if (status && status !== 'ALL') conditions.push(`status = '${status}'`)
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

    const rows = db.prepare(
      `SELECT * FROM signals ${where} ORDER BY generated_at DESC LIMIT 200`
    ).all()

    db.close()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/edge-distribution?period=7d
app.get('/api/edge-distribution', (req, res) => {
  try {
    const db = getDb()
    const since = periodToDate(req.query.period)
    const whereClause = since ? `WHERE generated_at >= '${since}'` : ''

    const rows = db.prepare(
      `SELECT edge, direction, status FROM signals ${whereClause}`
    ).all()

    const buckets = {}
    for (const r of rows) {
      const bucket = Math.floor(r.edge * 100 / 5) * 5
      const key = `${bucket}-${bucket + 5}%`
      if (!buckets[key]) buckets[key] = { range: key, count: 0, wins: 0 }
      buckets[key].count++
      if (r.status === 'RESOLVED' && r.realized_pnl > 0) buckets[key].wins++
    }

    db.close()
    res.json(Object.values(buckets).sort((a, b) => parseInt(a.range) - parseInt(b.range)))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`DayaView API listening on http://localhost:${PORT}`))
