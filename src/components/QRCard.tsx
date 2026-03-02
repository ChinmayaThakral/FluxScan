import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, RotateCcw, Check, ExternalLink, Share2, Maximize2, X } from 'lucide-react'
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

  const renderQR = useCallback((canvas: HTMLCanvasElement, size: number) => {
    QRCode.toCanvas(canvas, upiLink, {
      width: size,
      margin: 3,
      color: { dark: '#E8E8EC', light: '#111219' },
      errorCorrectionLevel: 'H',
    })
  }, [upiLink])

  useEffect(() => {
    if (canvasRef.current) renderQR(canvasRef.current, 320)
  }, [renderQR])

  useEffect(() => {
    if (fullscreen && fullscreenCanvasRef.current) {
      renderQR(fullscreenCanvasRef.current, Math.min(window.innerWidth - 64, 400))
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
    const c = document.createElement('canvas')
    const pad = 40
    const bh = branded ? 40 : 0
    const w = canvasRef.current.width + pad * 2
    const h = canvasRef.current.height + pad * 2 + bh
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#111219'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(canvasRef.current, pad, pad)
    if (branded) {
      ctx.fillStyle = '#71717A'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('FluxScan', w / 2, h - 14)
    }
    return c
  }

  function handleDownload() {
    const canvas = buildDownloadCanvas()
    if (!canvas) return
    const a = document.createElement('a')
    a.download = 'fluxscan-qr.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  async function handleShare() {
    const canvas = buildDownloadCanvas()
    if (!canvas) return
    try {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], 'fluxscan-qr.png', { type: 'image/png' })
      await navigator.share({ title: 'UPI QR Code', text: 'Scan to pay via UPI', files: [file] })
    } catch { /* */ }
  }

  return (
    <>
      <div className="animate-scale-in flex flex-col items-center">
        {/* Glassmorphic hero card */}
        <div className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center gap-7">

          <p className="text-xs uppercase tracking-widest text-text-secondary/40 font-medium">
            Scan with any UPI app
          </p>

          <div
            className="rounded-xl overflow-hidden cursor-pointer group relative"
            onClick={() => setFullscreen(true)}
          >
            <canvas ref={canvasRef} className="block" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
              <Maximize2 className="w-5 h-5 text-white/80" />
            </div>
          </div>

          <a
            href={upiLink}
            onClick={(e) => { e.preventDefault(); handleOpenUpi() }}
            className="w-full inline-flex items-center justify-center gap-2.5 h-[56px] rounded-xl text-[15px] font-medium bg-accent text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent/20 transition-all duration-200 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Open in UPI App
          </a>

          <div className="flex gap-2.5 w-full">
            <Button variant="secondary" icon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />} onClick={handleCopy} className="flex-1 !text-sm">
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handleDownload} className="flex-1 !text-sm">
              Save
            </Button>
            {canShare && (
              <Button variant="secondary" icon={<Share2 className="w-4 h-4" />} onClick={handleShare} className="flex-1 !text-sm">
                Share
              </Button>
            )}
          </div>

          {/* Branding toggle + link — quiet */}
          <div className="w-full flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={branded} onChange={(e) => setBranded(e.target.checked)} className="sr-only peer" />
              <div className="w-8 h-[18px] rounded-full bg-white/[0.06] peer-checked:bg-accent/25 relative transition-colors">
                <div className={`absolute top-[3px] w-3 h-3 rounded-full transition-all ${branded ? 'left-[14px] bg-accent' : 'left-[3px] bg-white/20'}`} />
              </div>
              <span className="text-xs text-text-secondary/30">Branding</span>
            </label>
          </div>
        </div>

        {/* Generated link — outside card, minimal */}
        <details className="w-full mt-5">
          <summary className="text-xs text-text-secondary/25 cursor-pointer hover:text-text-secondary/40 transition-colors pl-1">
            Show generated link
          </summary>
          <p className="text-xs text-text-secondary/30 break-all font-mono leading-relaxed select-all mt-2 pl-1">{upiLink}</p>
        </details>

        {/* Reset */}
        <div className="w-full mt-8">
          <Button variant="ghost" icon={<RotateCcw className="w-4 h-4" />} onClick={onReset} className="w-full">
            Reset
          </Button>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 animate-fade-in-up"
          onClick={() => setFullscreen(false)}
        >
          <button className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer">
            <X className="w-5 h-5 text-white" />
          </button>
          <canvas ref={fullscreenCanvasRef} className="block rounded-xl" />
          <p className="mt-5 text-sm text-white/25">Tap to close</p>
        </div>
      )}
    </>
  )
}
