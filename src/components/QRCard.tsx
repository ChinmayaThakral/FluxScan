import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, RotateCcw, Check, Shield } from 'lucide-react'
import Button from './Buttons'

interface QRCardProps {
  emvPayload: string
  onReset: () => void
}

export default function QRCard({ emvPayload, onReset }: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, emvPayload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#F5F5F7',
          light: '#15151B',
        },
        errorCorrectionLevel: 'M',
      })
    }
  }, [emvPayload])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(emvPayload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard API may not be available in some contexts */
    }
  }

  function handleDownload() {
    if (!canvasRef.current) return

    const downloadCanvas = document.createElement('canvas')
    const padding = 48
    const brandHeight = 52
    const w = canvasRef.current.width + padding * 2
    const h = canvasRef.current.height + padding * 2 + brandHeight

    downloadCanvas.width = w
    downloadCanvas.height = h

    const ctx = downloadCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#15151B'
    ctx.fillRect(0, 0, w, h)

    ctx.drawImage(canvasRef.current, padding, padding)

    ctx.fillStyle = '#8B7CF6'
    ctx.font = '600 12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('EMV Bharat QR', w / 2, h - 32)

    ctx.fillStyle = '#A1A1AA'
    ctx.font = '11px Inter, sans-serif'
    ctx.fillText('Generated via FluxScan', w / 2, h - 14)

    const link = document.createElement('a')
    link.download = 'fluxscan-bharat-qr.png'
    link.href = downloadCanvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="animate-fade-in-up">
      <div className="relative flex flex-col items-center gap-5 p-6 rounded-2xl bg-card border border-border-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-accent/10 to-transparent pointer-events-none animate-glow" />

        <div className="flex items-center gap-2 text-xs font-medium text-accent tracking-wide">
          <Shield className="w-3.5 h-3.5" />
          <span>EMV Bharat QR — Bank Compatible</span>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-card p-3 border border-border-subtle">
          <canvas ref={canvasRef} className="block" />
        </div>

        <p className="text-xs text-text-secondary tracking-wide">
          Generated via <span className="text-accent font-medium">FluxScan</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            icon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? 'Copied!' : 'Copy Payload'}
          </Button>
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
            className="flex-1"
          >
            Download QR
          </Button>
        </div>

        <Button
          variant="ghost"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={onReset}
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
