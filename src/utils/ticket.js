const COUNTER_KEY = 'bsp_ticket_counter'

export function nextTicketNumber() {
  const year = new Date().getFullYear()
  const current = Number(localStorage.getItem(COUNTER_KEY) || 0) + 1
  localStorage.setItem(COUNTER_KEY, String(current))
  return `BSP-${year}-${String(current).padStart(5, '0')}`
}

export function setTicketCounterFloor(n) {
  const current = Number(localStorage.getItem(COUNTER_KEY) || 0)
  if (n > current) localStorage.setItem(COUNTER_KEY, String(n))
}

export function resetTicketCounter() {
  localStorage.removeItem(COUNTER_KEY)
}
