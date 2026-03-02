import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, RotateCcw, Check, ExternalLink, Scan, Share2, Maximize2, X } from 'lucide-react'
import Button from './Buttons'

interface QRCardProps {
  upiLink: string
  onReset: () => void
}

export default function QRCard({ upiLink, onReset }: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [branded, setBranded] = useState(true)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
  }, [])

  const renderQR = useCallback((canvas: HTMLCanvasElement, size: number, isDark: boolean) => {
    QRCode.toCanvas(canvas, upiLink, {
      width: size,
      margin: 3,
      color: {
        dark: isDark ? '#F5F5F7' : '#1a1a2e',
        light: isDark ? '#15151B' : '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
  }, [upiLink])

  useEffect(() => {
    if (canvasRef.current) renderQR(canvasRef.current, 300, true)
  }, [renderQR])

  useEffect(() => {
    if (fullscreen && fullscreenCanvasRef.current) {
      renderQR(fullscreenCanvasRef.current, Math.min(window.innerWidth - 64, 400), true)
    }
  }, [fullscreen, renderQR])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(upiLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* */ }
  }

  function handleOpenUpi() {
    window.location.href = upiLink
  }

  function buildDownloadCanvas(): HTMLCanvasElement | null {
    if (!canvasRef.current) return null

    const downloadCanvas = document.createElement('canvas')
    const padding = 48
    const brandHeight = branded ? 44 : 0
    const w = canvasRef.current.width + padding * 2
    const h = canvasRef.current.height + padding * 2 + brandHeight

    downloadCanvas.width = w
    downloadCanvas.height = h

    const ctx = downloadCanvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#15151B'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(canvasRef.current, padding, padding)

    if (branded) {
      ctx.fillStyle = '#A1A1AA'
      ctx.font = '13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Generated via FluxScan', w / 2, h - 16)
    }

    return downloadCanvas
  }

  function handleDownload() {
    const canvas = buildDownloadCanvas()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'fluxscan-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function handleShare() {
    const canvas = buildDownloadCanvas()
    if (!canvas) return
    try {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], 'fluxscan-qr.png', { type: 'image/png' })
      await navigator.share({ title: 'UPI QR Code', text: 'Scan to pay via UPI', files: [file] })
    } catch { /* user cancelled or unsupported */ }
  }

  return (
    <>
      <div className="animate-fade-in-up">
        <div className="relative flex flex-col items-center gap-5 p-6 rounded-2xl bg-card border border-border-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-accent/10 to-transparent pointer-events-none animate-glow" />

          <div className="flex items-center gap-2 text-xs font-medium text-accent tracking-wide">
            <Scan className="w-3.5 h-3.5" />
            <span>Universal UPI QR — Scan with any UPI app</span>
          </div>

          <div
            className="relative rounded-xl overflow-hidden bg-card p-3 border border-border-subtle cursor-pointer group"
            onClick={() => setFullscreen(true)}
            title="Tap to expand"
          >
            <canvas ref={canvasRef} className="block" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>

          <p className="text-xs text-text-secondary tracking-wide">
            Generated via <span className="text-accent font-medium">FluxScan</span>
          </p>

          <a
            href={upiLink}
            onClick={(e) => { e.preventDefault(); handleOpenUpi() }}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover active:scale-[0.97] shadow-lg shadow-accent/20 transition-all duration-200 ease-in-out cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Open in UPI App
          </a>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="secondary" icon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />} onClick={handleCopy} className="flex-1">
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handleDownload} className="flex-1">
              Download
            </Button>
            {canShare && (
              <Button variant="secondary" icon={<Share2 className="w-4 h-4" />} onClick={handleShare} className="flex-1">
                Share
              </Button>
            )}
          </div>

          {/* Branded export toggle */}
          <label className="flex items-center gap-2 cursor-pointer self-start">
            <input
              type="checkbox"
              checked={branded}
              onChange={(e) => setBranded(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-[18px] rounded-full bg-card-elevated border border-border-subtle peer-checked:bg-accent/30 peer-checked:border-accent/40 relative transition-colors">
              <div className={`absolute top-[2px] w-[12px] h-[12px] rounded-full transition-all ${branded ? 'left-[15px] bg-accent' : 'left-[2px] bg-text-secondary/40'}`} />
            </div>
            <span className="text-[11px] text-text-secondary/60">FluxScan branding on export</span>
          </label>

          <div className="w-full rounded-xl bg-card-elevated border border-border-subtle p-3 overflow-hidden">
            <p className="text-[10px] text-text-secondary/50 mb-1 font-medium uppercase tracking-wider">Generated Link</p>
            <p className="text-xs text-text-secondary break-all font-mono leading-relaxed select-all">{upiLink}</p>
          </div>

          <Button variant="ghost" icon={<RotateCcw className="w-4 h-4" />} onClick={onReset} className="w-full">
            Reset
          </Button>
        </div>
      </div>

      {/* Fullscreen QR overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 animate-fade-in-up"
          onClick={() => setFullscreen(false)}
        >
          <button className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <X className="w-5 h-5 text-white" />
          </button>
          <canvas ref={fullscreenCanvasRef} className="block rounded-xl" />
          <p className="mt-4 text-sm text-white/60">Tap anywhere to close</p>
        </div>
      )}
    </>
  )
}
