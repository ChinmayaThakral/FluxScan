export function deriveNameFromVpa(vpa: string): string {
  const prefix = vpa.split('@')[0] || ''
  return prefix
    .replace(/[-_.]/g, ' ')
    .replace(/\d+$/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
