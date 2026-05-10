const BASE = '/api'

export async function fetchStats(period) {
  const r = await fetch(`${BASE}/stats?period=${period}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function fetchPnlChart(period) {
  const r = await fetch(`${BASE}/pnl-chart?period=${period}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function fetchSignals(period, status = 'ALL') {
  const r = await fetch(`${BASE}/signals?period=${period}&status=${status}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function fetchEdgeDistribution(period) {
  const r = await fetch(`${BASE}/edge-distribution?period=${period}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
