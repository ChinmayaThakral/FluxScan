const RECENT_VPAS_KEY = 'fluxscan_recent_vpas'
const PAYMENT_LOG_KEY = 'fluxscan_payment_log'
const THEME_KEY = 'fluxscan_theme'
const COUNTER_KEY = 'fluxscan_total_generated'

const MAX_RECENT = 8
const MAX_LOG = 100

export interface RecentVpa {
  vpa: string
  name: string
  timestamp: number
}

export type PaymentStatus = 'success' | 'failed'

export interface PaymentLogEntry {
  id: string
  vpa: string
  name: string
  amount: string
  note: string
  link: string
  timestamp: number
  status: PaymentStatus
}

export interface ExportData {
  version: string
  exportedAt: number
  totalGenerated: number
  log: PaymentLogEntry[]
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

// --- Recent VPAs ---

export function getRecentVpas(): RecentVpa[] {
  return readJSON<RecentVpa[]>(RECENT_VPAS_KEY, [])
}

export function saveRecentVpa(vpa: string, name: string): void {
  const list = getRecentVpas().filter((r) => r.vpa !== vpa)
  list.unshift({ vpa, name, timestamp: Date.now() })
  writeJSON(RECENT_VPAS_KEY, list.slice(0, MAX_RECENT))
}

// --- Counter ---

export function getTotalGenerated(): number {
  return readJSON<number>(COUNTER_KEY, 0)
}

export function incrementTotalGenerated(): number {
  const next = getTotalGenerated() + 1
  writeJSON(COUNTER_KEY, next)
  return next
}

// --- Payment Log ---

export function getPaymentLog(): PaymentLogEntry[] {
  return readJSON<PaymentLogEntry[]>(PAYMENT_LOG_KEY, [])
}

export function addPaymentLog(entry: Omit<PaymentLogEntry, 'id' | 'timestamp'>): void {
  const log = getPaymentLog()
  log.unshift({
    ...entry,
    id: `PL${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  })
  writeJSON(PAYMENT_LOG_KEY, log.slice(0, MAX_LOG))
}

export function updateLogEntryStatus(id: string, status: PaymentStatus): void {
  const log = getPaymentLog()
  const entry = log.find((e) => e.id === id)
  if (entry) {
    entry.status = status
    writeJSON(PAYMENT_LOG_KEY, log)
  }
}

export function deleteLogEntry(id: string): void {
  const log = getPaymentLog().filter((e) => e.id !== id)
  writeJSON(PAYMENT_LOG_KEY, log)
}

export function clearPaymentLog(): void {
  writeJSON(PAYMENT_LOG_KEY, [])
  writeJSON(COUNTER_KEY, 0)
}

export function setPaymentLog(log: PaymentLogEntry[]): void {
  writeJSON(PAYMENT_LOG_KEY, log.slice(0, MAX_LOG))
}

// --- Export / Import ---

export function exportLog(): ExportData {
  return {
    version: '1.3',
    exportedAt: Date.now(),
    totalGenerated: getTotalGenerated(),
    log: getPaymentLog(),
  }
}

function isValidEntry(e: unknown): e is PaymentLogEntry {
  if (typeof e !== 'object' || e === null) return false
  const obj = e as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.vpa === 'string' &&
    typeof obj.timestamp === 'number' &&
    (obj.status === 'success' || obj.status === 'failed')
  )
}

export function validateImport(data: unknown): ExportData | null {
  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>
  if (typeof obj.version !== 'string') return null
  if (!Array.isArray(obj.log)) return null
  const validLog = (obj.log as unknown[]).filter(isValidEntry)
  return {
    version: obj.version,
    exportedAt: typeof obj.exportedAt === 'number' ? obj.exportedAt : Date.now(),
    totalGenerated: typeof obj.totalGenerated === 'number' ? obj.totalGenerated : 0,
    log: validLog,
  }
}

export function mergeLog(incoming: PaymentLogEntry[]): PaymentLogEntry[] {
  const existing = getPaymentLog()
  const existingIds = new Set(existing.map((e) => e.id))
  const newEntries = incoming.filter((e) => !existingIds.has(e.id))
  const merged = [...existing, ...newEntries]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_LOG)
  writeJSON(PAYMENT_LOG_KEY, merged)
  return merged
}

export function replaceLog(incoming: PaymentLogEntry[]): PaymentLogEntry[] {
  const log = incoming.slice(0, MAX_LOG)
  writeJSON(PAYMENT_LOG_KEY, log)
  return log
}

// --- Theme ---

export type Theme = 'dark' | 'light'

export function getTheme(): Theme {
  return readJSON<Theme>(THEME_KEY, 'dark')
}

export function setTheme(theme: Theme): void {
  writeJSON(THEME_KEY, theme)
}
