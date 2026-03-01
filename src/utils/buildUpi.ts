export function buildUpiLink(vpa: string, amount?: string): string {
  const sanitizedVpa = encodeURIComponent(vpa.trim())
  const base = `upi://pay?pa=${sanitizedVpa}&cu=INR`

  if (amount && amount.trim() !== '') {
    const sanitizedAmount = encodeURIComponent(amount.trim())
    return `${base}&am=${sanitizedAmount}`
  }

  return base
}
