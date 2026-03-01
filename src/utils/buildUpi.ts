function generateTxnRef(): string {
  return `FS${Date.now()}`
}

export function buildUpiLink(vpa: string, amount?: string, payeeName?: string): string {
  const pa = encodeURIComponent(vpa.trim())
  const pn = encodeURIComponent((payeeName?.trim() || 'FluxScan').replace(/[^\w\s]/g, ''))
  const tr = encodeURIComponent(generateTxnRef())

  let link = `upi://pay?pa=${pa}&pn=${pn}&mc=0000&tr=${tr}&cu=INR`

  if (amount && amount.trim() !== '') {
    link += `&am=${encodeURIComponent(amount.trim())}`
  }

  return link
}
