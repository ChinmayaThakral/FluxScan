import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, RotateCcw, Check, ExternalLink, Scan } from 'lucide-react'
import Button from './Buttons'

interface QRCardProps {
  upiLink: string
  onReset: () => void
}

export default function QRCard({ upiLink, onReset }: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, upiLink, {
        width: 300,
        margin: 3,
        color: {
          dark: '#F5F5F7',
          light: '#15151B',
        },
        errorCorrectionLevel: 'H',
      })
    }
  }, [upiLink])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(upiLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard API may not be available in some contexts */
    }
  }

  function handleOpenUpi() {
    window.location.href = upiLink
  }

  function handleDownload() {
    if (!canvasRef.current) return

    const downloadCanvas = document.createElement('canvas')
    const padding = 48
    const brandHeight = 40
    const w = canvasRef.current.width + padding * 2
    const h = canvasRef.current.height + padding * 2 + brandHeight

    downloadCanvas.width = w
    downloadCanvas.height = h

    const ctx = downloadCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#15151B'
    ctx.fillRect(0, 0, w, h)

    ctx.drawImage(canvasRef.current, padding, padding)

    ctx.fillStyle = '#A1A1AA'
    ctx.font = '13px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Generated via FluxScan', w / 2, h - 16)

    const link = document.createElement('a')
    link.download = 'fluxscan-qr.png'
    link.href = downloadCanvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="animate-fade-in-up">
      <div className="relative flex flex-col items-center gap-5 p-6 rounded-2xl bg-card border border-border-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-accent/10 to-transparent pointer-events-none animate-glow" />

        <div className="flex items-center gap-2 text-xs font-medium text-accent tracking-wide">
          <Scan className="w-3.5 h-3.5" />
          <span>Universal UPI QR — Scan with any UPI app</span>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-card p-3 border border-border-subtle">
          <canvas ref={canvasRef} className="block" />
        </div>

        <p className="text-xs text-text-secondary tracking-wide">
          Generated via <span className="text-accent font-medium">FluxScan</span>
        </p>

        {/* Open in UPI App — primary action on mobile */}
        <a
          href={upiLink}
          onClick={(e) => { e.preventDefault(); handleOpenUpi() }}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover active:scale-[0.97] shadow-lg shadow-accent/20 transition-all duration-200 ease-in-out cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          Open in UPI App
        </a>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            icon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
            className="flex-1"
          >
            Download QR
          </Button>
        </div>

        {/* Generated link for debugging */}
        <div className="w-full rounded-xl bg-card-elevated border border-border-subtle p-3 overflow-hidden">
          <p className="text-[10px] text-text-secondary/50 mb-1 font-medium uppercase tracking-wider">Generated Link</p>
          <p className="text-xs text-text-secondary break-all font-mono leading-relaxed select-all">{upiLink}</p>
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
