/**
 * EMVCo Merchant Presented Mode QR payload builder
 * Compliant with Bharat QR / UPI specifications
 *
 * Reference: EMVCo QR Code Specification for Payment Systems (Merchant Presented Mode)
 */

function padLength(len: number): string {
  return len.toString().padStart(2, '0')
}

function encodeTLV(tag: string, value: string): string {
  return `${tag}${padLength(value.length)}${value}`
}

function buildMerchantAccountInfo(vpa: string): string {
  const globalId = encodeTLV('00', 'upi')
  const vpaField = encodeTLV('01', vpa)
  const inner = globalId + vpaField
  return encodeTLV('26', inner)
}

/**
 * CRC-16-CCITT (FALSE variant)
 * Polynomial: 0x1021, Init: 0xFFFF, No reflection, Final XOR: 0x0000
 */
function calculateCRC(payload: string): string {
  let crc = 0xFFFF

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF
      } else {
        crc = (crc << 1) & 0xFFFF
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

export interface EmvPayloadOptions {
  vpa: string
  merchantName?: string
  merchantCity?: string
  amount?: string
}

export function buildEmvPayload(options: EmvPayloadOptions): string {
  const {
    vpa,
    merchantName = 'FluxScan',
    merchantCity = 'India',
    amount,
  } = options

  const trimmedName = merchantName.trim().slice(0, 25) || 'FluxScan'
  const trimmedCity = merchantCity.trim().slice(0, 15) || 'India'

  let payload = ''

  // 00 - Payload Format Indicator (mandatory, always "01")
  payload += encodeTLV('00', '01')

  // 01 - Point of Initiation Method ("11" = static, "12" = dynamic)
  payload += encodeTLV('01', '11')

  // 26 - Merchant Account Information (UPI)
  payload += buildMerchantAccountInfo(vpa.trim())

  // 52 - Merchant Category Code (0000 = generic)
  payload += encodeTLV('52', '0000')

  // 53 - Transaction Currency (356 = INR)
  payload += encodeTLV('53', '356')

  // 54 - Transaction Amount (optional)
  if (amount && amount.trim() !== '') {
    payload += encodeTLV('54', amount.trim())
  }

  // 58 - Country Code
  payload += encodeTLV('58', 'IN')

  // 59 - Merchant Name
  payload += encodeTLV('59', trimmedName)

  // 60 - Merchant City
  payload += encodeTLV('60', trimmedCity)

  // 63 - CRC (must be last, computed over entire payload including "6304")
  const crcPlaceholder = payload + '6304'
  const crc = calculateCRC(crcPlaceholder)
  payload += encodeTLV('63', crc)

  return payload
}

export { calculateCRC as _calculateCRC }
