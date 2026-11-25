/**
 * Palet kolam — jembatan ke design tokens (DESIGN.md §2).
 * Warna selalu dibaca saat runtime dari tokens.css lewat
 * getComputedStyle; warna turunan dibuat dengan MENCAMPUR token di
 * runtime sehingga tidak ada heksa baru yang menginduk di kolam.
 */

const NAMA_TOKEN = {
  leaf: '--c-forest-leaf', // aksen bidang hutan — konstan di kedua tema
  moss: '--c-forest-moss',
  terracotta: '--c-forest-terracotta',
  ochre: '--c-forest-ochre',
  paper: '--c-on-forest',
  ink: '--c-forest',
}

/** Baca nilai token desain untuk elemen kolam. */
export function readPalette(el) {
  const css = getComputedStyle(el)
  const pal = {}
  for (const [kunci, nama] of Object.entries(NAMA_TOKEN)) {
    pal[kunci] = css.getPropertyValue(nama).trim()
  }
  return pal
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mixArr(pal, a, b, t) {
  const ca = hexToRgb(pal[a])
  const cb = hexToRgb(pal[b])
  return ca.map((v, i) => Math.round(v + (cb[i] - v) * t))
}

/** Campur dua token → 'rgb(r,g,b)'. */
export function mixTokens(pal, a, b, t) {
  const c = mixArr(pal, a, b, t)
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

/** Campur dua token → triplet [r,g,b] untuk piksel ImageData. */
export function rgbOf(pal, a, b, t) {
  return mixArr(pal, a, b, t)
}

/** Campur dua token dengan nilai alfa → 'rgba(r,g,b,a)'. */
export function shadeToken(pal, a, b, t, alpha) {
  const c = mixArr(pal, a, b, t)
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
}

/** Satu token, tingkat alfa tertentu. */
export function alphaToken(pal, kunci, alpha) {
  return shadeToken(pal, kunci, kunci, 0, alpha)
}
