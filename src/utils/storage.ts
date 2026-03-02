const RECENT_VPAS_KEY = 'fluxscan_recent_vpas'
const PAYMENT_LOG_KEY = 'fluxscan_payment_log'
const THEME_KEY = 'fluxscan_theme'

const MAX_RECENT = 8
const MAX_LOG = 50

export interface RecentVpa {
  vpa: string
  name: string
  timestamp: number
}

export interface PaymentLogEntry {
  id: string
  vpa: string
  name: string
  amount: string
  note: string
  link: string
  timestamp: number
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable */
  }
}

export function getRecentVpas(): RecentVpa[] {
  return readJSON<RecentVpa[]>(RECENT_VPAS_KEY, [])
}

export function saveRecentVpa(vpa: string, name: string): void {
  const list = getRecentVpas().filter((r) => r.vpa !== vpa)
  list.unshift({ vpa, name, timestamp: Date.now() })
  writeJSON(RECENT_VPAS_KEY, list.slice(0, MAX_RECENT))
}

export function getPaymentLog(): PaymentLogEntry[] {
  return readJSON<PaymentLogEntry[]>(PAYMENT_LOG_KEY, [])
}

export function addPaymentLog(entry: Omit<PaymentLogEntry, 'id' | 'timestamp'>): void {
  const log = getPaymentLog()
  log.unshift({
    ...entry,
    id: `PL${Date.now()}`,
    timestamp: Date.now(),
  })
  writeJSON(PAYMENT_LOG_KEY, log.slice(0, MAX_LOG))
}

export function clearPaymentLog(): void {
  writeJSON(PAYMENT_LOG_KEY, [])
}

export type Theme = 'dark' | 'light'

export function getTheme(): Theme {
  return readJSON<Theme>(THEME_KEY, 'dark')
}

export function setTheme(theme: Theme): void {
  writeJSON(THEME_KEY, theme)
}
