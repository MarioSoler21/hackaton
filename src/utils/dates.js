export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toISODate(date) {
  return new Date(date).toISOString()
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function diffInDays(a, b) {
  const ms = new Date(a).getTime() - new Date(b).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function isOverdue(solicitud, now = new Date()) {
  if (solicitud.estado === 'Resuelto') return false
  return new Date(solicitud.fechaEstimada) < now
}

export function isDueSoon(solicitud, now = new Date(), thresholdDays = 2) {
  if (solicitud.estado === 'Resuelto') return false
  const diff = diffInDays(solicitud.fechaEstimada, now)
  return diff >= 0 && diff <= thresholdDays
}
