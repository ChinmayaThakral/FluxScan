const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/

export function validateUpi(vpa: string): boolean {
  return UPI_REGEX.test(vpa.trim())
}

export function validateAmount(amount: string): boolean {
  if (amount === '') return true
  const num = Number(amount)
  if (isNaN(num) || num <= 0) return false
  const parts = amount.split('.')
  if (parts.length > 2) return false
  if (parts[1] && parts[1].length > 2) return false
  return true
}
