import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import Header from './components/Header'
import InputField from './components/InputField'
import Button from './components/Buttons'
import RecentVpas from './components/RecentVpas'
import AmountPresets from './components/AmountPresets'
import PaymentLog from './components/PaymentLog'
import InstallBanner from './components/InstallBanner'
import ResetModal, { type ResetChoice } from './components/ResetModal'
import SupportModal from './components/SupportModal'
import { validateUpi, validateAmount } from './utils/validateUpi'
import { buildUpiLink } from './utils/buildUpi'
import { deriveNameFromVpa } from './utils/deriveName'
import {
  getRecentVpas, saveRecentVpa,
  getPaymentLog, addPaymentLog, updateLogEntryStatus, deleteLogEntry,
  getTotalGenerated, incrementTotalGenerated,
  getTheme, setTheme,
  mergeLog, replaceLog,
} from './utils/storage'
import type { Theme, RecentVpa, PaymentLogEntry, ExportData } from './utils/storage'
import { Zap, Heart, ExternalLink } from 'lucide-react'

const QRCard = lazy(() => import('./components/QRCard'))

const REFERRAL_URL = 'https://lp.p2p.lol/recommend?address=0x70E45DF83c156249257A2FC1E2D41eb87FC647b2&nonce=412412&signature=0x93de5c2d0e0919513a3a5f4e4aa3587853bba6b77be7d4cf680c91e41cac651a61efb7f0976d862ea9d903208160469d04e2c985c28bc60bc58f4931a603ab801b'

export default function App() {
  const [upiId, setUpiId] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [upiLink, setUpiLink] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [touched, setTouched] = useState(false)

  const [recentVpas, setRecentVpas] = useState<RecentVpa[]>([])
  const [paymentLog, setPaymentLogState] = useState<PaymentLogEntry[]>([])
  const [theme, setThemeState] = useState<Theme>('dark')
  const [totalGenerated, setTotalGenerated] = useState(0)

  const [showResetModal, setShowResetModal] = useState(false)
  const [activeLogId, setActiveLogId] = useState<string | null>(null)
  const [showSupportModal, setShowSupportModal] = useState(false)

  const upiInputRef = useRef<HTMLInputElement>(null)

  const refreshLog = useCallback(() => setPaymentLogState(getPaymentLog()), [])
  const refreshCounter = useCallback(() => setTotalGenerated(getTotalGenerated()), [])

  useEffect(() => {
    setRecentVpas(getRecentVpas())
    refreshLog()
    refreshCounter()
    const saved = getTheme()
    setThemeState(saved)
    document.body.classList.toggle('light', saved === 'light')
    setTimeout(() => upiInputRef.current?.focus(), 100)
  }, [refreshLog, refreshCounter])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      setTheme(next)
      document.body.classList.toggle('light', next === 'light')
      return next
    })
  }, [])

  const isUpiValid = validateUpi(upiId)
  const isAmountValid = validateAmount(amount)
  const canGenerate = isUpiValid && isAmountValid && !isGenerating

  const upiError = touched && upiId.length > 0 && !isUpiValid
    ? 'Enter a valid UPI ID (e.g. name@upi)'
    : undefined

  const amountError = amount.length > 0 && !isAmountValid
    ? 'Valid amount: positive, max 2 decimals'
    : undefined

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return
    setIsGenerating(true)
    const resolvedName = payeeName || deriveNameFromVpa(upiId)

    setTimeout(() => {
      const link = buildUpiLink({
        vpa: upiId,
        payeeName: resolvedName || undefined,
        amount: amount || undefined,
        note: note || undefined,
      })
      setUpiLink(link)
      setIsGenerating(false)

      saveRecentVpa(upiId, resolvedName)
      setRecentVpas(getRecentVpas())

      addPaymentLog({
        vpa: upiId,
        name: resolvedName,
        amount: amount || '',
        note: note || 'Payment',
        link,
        status: 'success',
      })
      refreshLog()

      const newLog = getPaymentLog()
      if (newLog.length > 0) setActiveLogId(newLog[0].id)
    }, 300)
  }, [canGenerate, upiId, payeeName, amount, note, refreshLog])

  const handleResetClick = useCallback(() => {
    setShowResetModal(true)
  }, [])

  const handleResetChoice = useCallback((choice: ResetChoice) => {
    setShowResetModal(false)

    if (choice === 'success') {
      if (activeLogId) updateLogEntryStatus(activeLogId, 'success')
      setTotalGenerated(incrementTotalGenerated())
    } else if (choice === 'failed') {
      if (activeLogId) updateLogEntryStatus(activeLogId, 'failed')
    } else {
      if (activeLogId) deleteLogEntry(activeLogId)
    }

    refreshLog()
    setActiveLogId(null)
    setUpiId('')
    setPayeeName('')
    setAmount('')
    setNote('')
    setUpiLink(null)
    setTouched(false)
    setTimeout(() => upiInputRef.current?.focus(), 100)
  }, [activeLogId, refreshLog])

  const handleSelectRecent = useCallback((vpa: string, name: string) => {
    setUpiId(vpa)
    setPayeeName(name)
    setTouched(true)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGenerate) handleGenerate()
  }

  const handleImport = useCallback((data: ExportData, choice: string) => {
    if (choice === 'merge') {
      setPaymentLogState(mergeLog(data.log))
    } else {
      setPaymentLogState(replaceLog(data.log))
    }
    refreshCounter()
  }, [refreshCounter])

  const handleLogUpdate = useCallback(() => {
    refreshLog()
    refreshCounter()
  }, [refreshLog, refreshCounter])

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col px-6 max-w-lg mx-auto w-full" onKeyDown={handleKeyDown}>
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <InstallBanner />

        {!upiLink ? (
          <main className="flex-1 flex flex-col gap-10 pb-8">

            {/* VPA */}
            <section className="animate-fade-in-up">
              <InputField
                id="upi-id"
                label="UPI ID"
                placeholder="name@upi"
                type="text"
                autoComplete="off"
                spellCheck={false}
                autoFocus
                ref={upiInputRef}
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value)
                  if (!touched) setTouched(true)
                }}
                error={upiError}
              />
            </section>

            {/* Amount */}
            <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              <InputField
                id="amount"
                label="Amount"
                placeholder="₹ 0.00"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={amountError}
                className="!text-xl tracking-wide"
              />
              <AmountPresets onSelect={setAmount} current={amount} />
            </section>

            {/* Recent */}
            <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <RecentVpas items={recentVpas} onSelect={handleSelectRecent} />
            </section>

            {/* Payee + Note */}
            <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <InputField
                id="payee-name"
                label="Payee Name"
                placeholder={upiId ? deriveNameFromVpa(upiId) || 'Auto-derived' : 'Optional'}
                type="text"
                autoComplete="off"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
              />
              <InputField
                id="note"
                label="Note"
                placeholder="Payment"
                type="text"
                autoComplete="off"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </section>

            {/* Generate */}
            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Button
                variant="primary"
                disabled={!canGenerate}
                onClick={handleGenerate}
                icon={
                  isGenerating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )
                }
                className={`w-full !min-h-[56px] ${canGenerate ? 'animate-pulse-subtle' : ''}`}
              >
                {isGenerating ? 'Generating...' : 'Generate QR'}
              </Button>
            </section>

            {/* History */}
            {paymentLog.length > 0 && (
              <section className="pt-4 border-t border-white/[0.04]">
                <PaymentLog
                  entries={paymentLog}
                  onUpdate={handleLogUpdate}
                  onImport={handleImport}
                />
              </section>
            )}
          </main>
        ) : (
          <main className="flex-1 flex flex-col pb-8">
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              }
            >
              <QRCard upiLink={upiLink} onReset={handleResetClick} />
            </Suspense>
          </main>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6">
        <p className="text-xs text-text-secondary/25">
          Offline Ready · Payments Generated: <span className="text-accent/60">{totalGenerated}</span> · v2.0
        </p>
        <p className="text-[11px] text-text-secondary/15 flex items-center justify-center gap-4 mt-2.5">
          <button
            onClick={() => setShowSupportModal(true)}
            className="hover:text-accent/50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Heart className="w-3 h-3" /> Support
          </button>
          <a
            href={REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent/50 transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3 h-3" /> P2P Merchant
          </a>
        </p>
      </footer>

      <ResetModal open={showResetModal} onClose={() => setShowResetModal(false)} onChoice={handleResetChoice} />
      <SupportModal open={showSupportModal} onClose={() => setShowSupportModal(false)} />
    </div>
  )
}
