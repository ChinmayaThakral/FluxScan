export interface UpiLinkOptions {
  vpa: string
  payeeName?: string
  amount?: string
  note?: string
}

export function buildUpiLink(options: UpiLinkOptions): string {
  const { vpa, payeeName, amount, note } = options

  const pa = vpa.trim()
  const pn = payeeName?.trim() || pa.split('@')[0]

  const params: [string, string][] = [
    ['pa', pa],
    ['pn', pn],
  ]

  if (amount && amount.trim() !== '') {
    params.push(['am', amount.trim()])
  }

  params.push(['cu', 'INR'])
  params.push(['tn', note?.trim() || 'Payment'])
  params.push(['tr', `FS${Date.now()}`])

  const query = params
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  return `upi://pay?${query}`
}
