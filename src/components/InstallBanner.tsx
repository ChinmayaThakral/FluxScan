import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    )

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isStandalone || dismissed || !deferredPrompt) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  return (
    <div className="w-full mb-6 animate-fade-in-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/[0.06] border border-accent/[0.1]">
        <Download className="w-4 h-4 text-accent flex-shrink-0" />
        <p className="text-xs text-text-secondary flex-1">
          <button onClick={handleInstall} className="text-accent font-medium hover:underline cursor-pointer">
            Install FluxScan
          </button>
          {' '}for faster access
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-hover-bg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-text-secondary/50" />
        </button>
      </div>
    </div>
  )
}
