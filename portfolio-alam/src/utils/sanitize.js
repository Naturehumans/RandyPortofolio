/**
 * Sanitasi input sisi klien. React sudah meng-escape output (tidak pakai
 * dangerouslySetInnerHTML), jadi ini lapisan kebersihan data: buang tag,
 * karakter kontrol, dan batasi panjang.
 *
 * PENTING: validasi & sanitasi klien TIDAK CUKUP — endpoint penerima
 * pesan WAJIB memvalidasi ulang di server.
 */
export function stripHtml(input = '') {
  return String(input).replace(/<[^>]*>/g, '')
}

export function sanitizeText(input = '', max = 500) {
  return stripHtml(input)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export function isEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
}
