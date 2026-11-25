/**
 * Tekstur air kolam — dibangun SEKALI (bukan per frame), lalu hanya
 * digambar/diulang oleh pondPaint.js:
 * - waterBase : gradasi kedalaman + zona cahaya + tepi kolam yang gelap;
 * - caustic   : jaring cahaya yang bisa diulang mulus (tileable);
 * - shaft     : berkas sinar dari tajuk yang menembus air.
 * Semua warna berasal dari token (pondColor) — tidak ada heksa baru.
 */
import { alphaToken, mixTokens, rgbOf } from './pondColor'

const TAU = Math.PI * 2

/** Dasar air: dangkal (atas) ke gelap (bawah), dengan kolam cahaya. */
export function buildWaterBase(pal) {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 180
  const ctx = canvas.getContext('2d')

  const dalam = ctx.createLinearGradient(0, 0, 0, 180)
  dalam.addColorStop(0, mixTokens(pal, 'ink', 'paper', 0.24))
  dalam.addColorStop(0.5, mixTokens(pal, 'ink', 'paper', 0.13))
  dalam.addColorStop(1, mixTokens(pal, 'ink', 'ink', 0))
  ctx.fillStyle = dalam
  ctx.fillRect(0, 0, 320, 180) /* taste-skill-ignore: gradasi kedalaman air, material canvas */

  const kolam = ctx.createRadialGradient(118, 40, 6, 124, 62, 200)
  kolam.addColorStop(0, alphaToken(pal, 'leaf', 0.22))
  kolam.addColorStop(0.45, alphaToken(pal, 'leaf', 0.09))
  kolam.addColorStop(1, alphaToken(pal, 'leaf', 0))
  ctx.fillStyle = kolam
  ctx.fillRect(0, 0, 320, 180)

  const tepi = ctx.createRadialGradient(160, 90, 64, 160, 90, 235)
  tepi.addColorStop(0, alphaToken(pal, 'ink', 0))
  tepi.addColorStop(1, alphaToken(pal, 'ink', 0.5))
  ctx.fillStyle = tepi
  ctx.fillRect(0, 0, 320, 180)

  return { canvas, w: 320, h: 180 }
}

/**
 * Jaring caustic: jumlah sinus berupa bilangan bulat sehingga tekstur
 * berulang tanpa sambungan. Piksel hanya dihitung sekali saat tema terikat.
 */
export function buildCaustic(pal) {
  const ukuran = 256
  const canvas = document.createElement('canvas')
  canvas.width = ukuran
  canvas.height = ukuran
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(ukuran, ukuran)
  const px = img.data
  const [r, g, b] = rgbOf(pal, 'paper', 'leaf', 0.45)
  for (let y = 0; y < ukuran; y++) {
    const v = (y / ukuran) * TAU
    for (let x = 0; x < ukuran; x++) {
      const u = (x / ukuran) * TAU
      const n =
        Math.sin(u * 2 + Math.sin(v * 3) * 1.5) +
        Math.sin(v * 2 + Math.sin(u * 3) * 1.5) +
        Math.sin((u + v) * 1 + Math.sin((u - v) * 2) * 1.2)
      const tebal = Math.pow(Math.max(0, 1 - Math.abs(n) / 1.35), 5)
      const i = (y * ukuran + x) * 4
      px[i] = r
      px[i + 1] = g
      px[i + 2] = b
      px[i + 3] = Math.round(200 * tebal)
    }
  }
  ctx.putImageData(img, 0, 0)
  return { canvas, w: ukuran, h: ukuran }
}

/** Berkas sinar lembut yang memudar makin dalam (destination-out). */
export function buildShaft(pal) {
  const canvas = document.createElement('canvas')
  canvas.width = 140
  canvas.height = 560
  const ctx = canvas.getContext('2d')
  const lebar = ctx.createLinearGradient(0, 0, 140, 0)
  lebar.addColorStop(0, alphaToken(pal, 'leaf', 0))
  lebar.addColorStop(0.5, alphaToken(pal, 'leaf', 0.6))
  lebar.addColorStop(1, alphaToken(pal, 'leaf', 0))
  ctx.fillStyle = lebar
  ctx.fillRect(0, 0, 140, 560) /* taste-skill-ignore: berkas cahaya air, material canvas */

  ctx.globalCompositeOperation = 'destination-out'
  const pudar = ctx.createLinearGradient(0, 0, 0, 560)
  pudar.addColorStop(0, alphaToken(pal, 'ink', 0))
  pudar.addColorStop(0.55, alphaToken(pal, 'ink', 0.45))
  pudar.addColorStop(1, alphaToken(pal, 'ink', 1))
  ctx.fillStyle = pudar
  ctx.fillRect(0, 0, 140, 560)

  return { canvas, w: 140, h: 560 }
}

/** Tepi kolam yang gelap: menahan pandangan ke tengah, memberi kedalaman. */
export function buildVignette(pal) {
  const ukuran = 256
  const canvas = document.createElement('canvas')
  canvas.width = ukuran
  canvas.height = ukuran
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(128, 128, 44, 128, 128, 182)
  grad.addColorStop(0, alphaToken(pal, 'ink', 0))
  grad.addColorStop(0.68, alphaToken(pal, 'ink', 0.16))
  grad.addColorStop(1, alphaToken(pal, 'ink', 0.55))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, ukuran, ukuran) /* taste-skill-ignore: vignette kedalaman air, material canvas */
  return { canvas, w: ukuran, h: ukuran }
}
