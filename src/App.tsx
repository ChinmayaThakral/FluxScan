import { useState, useCallback, lazy, Suspense } from 'react'
import Header from './components/Header'
import InputField from './components/InputField'
import Button from './components/Buttons'
import { validateUpi, validateAmount } from './utils/validateUpi'
import { buildUpiLink } from './utils/buildUpi'
import { Zap } from 'lucide-react'

const QRCard = lazy(() => import('./components/QRCard'))

export default function App() {
  const [upiId, setUpiId] = useState('')
  const [amount, setAmount] = useState('')
  const [upiLink, setUpiLink] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [touched, setTouched] = useState(false)

  const isUpiValid = validateUpi(upiId)
  const isAmountValid = validateAmount(amount)
  const canGenerate = isUpiValid && isAmountValid && !isGenerating

  const upiError = touched && upiId.length > 0 && !isUpiValid
    ? 'Enter a valid UPI ID (e.g. name@upi)'
    : undefined

  const amountError = amount.length > 0 && !isAmountValid
    ? 'Enter a valid amount (positive, max 2 decimals)'
    : undefined

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return
    setIsGenerating(true)
    setTimeout(() => {
      const link = buildUpiLink(upiId, amount)
      setUpiLink(link)
      setIsGenerating(false)
    }, 400)
  }, [canGenerate, upiId, amount])

  const handleReset = useCallback(() => {
    setUpiId('')
    setAmount('')
    setUpiLink(null)
    setTouched(false)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGenerate) {
      handleGenerate()
    }
  }

  return (
    <div className="relative min-h-dvh flex flex-col">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px] animate-glow" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4">
        <Header />

        <main className="w-full max-w-[480px]">
          {!upiLink ? (
            <div className="rounded-2xl bg-card border border-border-subtle p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex flex-col gap-5" onKeyDown={handleKeyDown}>
                <InputField
                  id="upi-id"
                  label="UPI ID (VPA)"
                  placeholder="yourname@upi"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value)
                    if (!touched) setTouched(true)
                  }}
                  error={upiError}
                />

                <InputField
                  id="amount"
                  label="Amount (INR) — optional"
                  placeholder="0.00"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={amountError}
                />

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
                  className={`w-full mt-1 ${canGenerate ? 'animate-pulse-subtle' : ''}`}
                >
                  {isGenerating ? 'Generating...' : 'Generate QR'}
                </Button>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <span className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              }
            >
              <QRCard upiLink={upiLink} onReset={handleReset} />
            </Suspense>
          )}
        </main>
      </div>

      <footer className="relative z-10 text-center py-6 mt-auto">
        <p className="text-xs text-text-secondary/60">
          Offline ready. No data stored.
        </p>
        <p className="text-[10px] text-text-secondary/30 mt-1">v1.0</p>
      </footer>
    </div>
  )
}
