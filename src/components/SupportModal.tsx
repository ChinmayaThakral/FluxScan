import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Check } from 'lucide-react'
import Modal from './Modal'

const EVM_ADDRESS = '0x3517519A3EadBA685a1Cd9b8FF0EDC1D1a3330D2'
const NETWORK = 'Polygon / Ethereum / Base — USDC'

interface SupportModalProps {
  open: boolean
  onClose: () => void
}

export default function SupportModal({ open, onClose }: SupportModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open && canvasRef.current) {
      const isDark = !document.body.classList.contains('light')
      QRCode.toCanvas(canvasRef.current, EVM_ADDRESS, {
        width: 140,
        margin: 2,
        color: {
          dark: isDark ? '#E8E8EC' : '#111118',
          light: isDark ? '#13141A' : '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
    }
  }, [open])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EVM_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* */ }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-base font-semibold text-text-primary mb-1">Support FluxScan</p>
      <p className="text-xs text-text-secondary/70 mb-5">
        No obligation. FluxScan remains free.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg overflow-hidden border border-border-subtle">
          <canvas ref={canvasRef} className="block" />
        </div>

        <div className="w-full space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-text-secondary/50 font-medium">{NETWORK}</p>
          <p className="text-[11px] text-text-secondary/60 font-mono break-all select-all leading-relaxed">{EVM_ADDRESS}</p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-accent bg-accent/[0.08] hover:bg-accent/[0.14] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Address'}
        </button>
      </div>
    </Modal>
  )
}
