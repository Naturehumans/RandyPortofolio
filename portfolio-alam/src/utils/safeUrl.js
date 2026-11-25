/**
 * Validasi URL agar hanya skema aman yang lolos:
 * https:, mailto:, atau path relatif ('/...' atau '#...').
 * Selalu pakai untuk setiap href yang berasal dari data/konten.
 */
export function safeUrl(url) {
  if (typeof url !== 'string') return null
  const trimmed = url.trim()
  if (trimmed === '') return null
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.href
    }
    return null
  } catch {
    return null
  }
}

/** Properti aman untuk link eksternal (wajib target blank + noopener). */
export function externalProps(url) {
  return { target: '_blank', rel: 'noopener noreferrer' }
}
