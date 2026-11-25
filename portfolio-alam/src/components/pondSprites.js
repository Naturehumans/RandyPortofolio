/**
 * Sprite koi, teratai, dan cahaya air untuk kolam (pondScene.js).
 *
 * Warna diambil dari token lewat modul pondColor.js (DESIGN.md §2):
 * sprite digambar SEKALI ke canvas offscreen; loop animasi di
 * pondScene.js hanya memanggil drawImage, sehingga kolam tetap ringan.
 * Sudut pandang ikan: tampak-atas (seperti melihat kolam dari tepinya).
 */

import { alphaToken, mixTokens, shadeToken } from './pondColor'

const KOI_SIZE = { w: 220, h: 120 } // sprite koi: kepala di kanan (+x)

/** Empat varietas koi; warna dipecah jadi punggung/tubuh/perut. */
export const KOI_KINDS = [
  {
    id: 'kohaku', // putih dengan corak terracotta
    back: (pal) => shadeToken(pal, 'paper', 'ink', 0.3, 1),
    base: (pal) => shadeToken(pal, 'paper', 'leaf', 0.1, 1),
    belly: (pal) => shadeToken(pal, 'paper', 'leaf', 0.02, 1),
    patch: (pal) => shadeToken(pal, 'terracotta', 'ink', 0.1, 0.92),
    pattern: 'blobs',
  },
  {
    id: 'tancho', // putih dengan mahkota merah di kepala
    back: (pal) => shadeToken(pal, 'paper', 'ink', 0.3, 1),
    base: (pal) => shadeToken(pal, 'paper', 'leaf', 0.1, 1),
    belly: (pal) => shadeToken(pal, 'paper', 'leaf', 0.02, 1),
    patch: (pal) => shadeToken(pal, 'terracotta', 'ochre', 0.45, 0.95),
    pattern: 'crown',
  },
  {
    id: 'ogon', // emas okermetalik dengan kilau tengah
    back: (pal) => shadeToken(pal, 'ochre', 'ink', 0.34, 1),
    base: (pal) => shadeToken(pal, 'ochre', 'paper', 0.3, 1),
    belly: (pal) => shadeToken(pal, 'ochre', 'paper', 0.62, 1),
    patch: (pal) => alphaToken(pal, 'paper', 0.14),
    pattern: 'stripe',
  },
  {
    id: 'asagi', // kelabu kehijauan berjala sisik
    back: (pal) => shadeToken(pal, 'moss', 'ink', 0.34, 1),
    base: (pal) => shadeToken(pal, 'moss', 'paper', 0.42, 1),
    belly: (pal) => shadeToken(pal, 'moss', 'paper', 0.7, 1),
    pattern: 'net',
  },
]

/** Siluet tubuh koi tampak-atas: moncong kanan, pangkal ekor pipih kiri. */
function traceBody(ctx) {
  ctx.beginPath()
  ctx.moveTo(194, 60)
  ctx.bezierCurveTo(188, 40, 158, 32, 126, 37)
  ctx.bezierCurveTo(96, 42, 64, 47, 48, 57)
  ctx.lineTo(48, 63)
  ctx.bezierCurveTo(64, 73, 96, 78, 126, 83)
  ctx.bezierCurveTo(158, 88, 188, 80, 194, 60)
  ctx.closePath()
}

/** Ekor mengalir transparan — digambar sebelum tubuh agar pangkal tertutup. */
function paintTail(ctx, pal) {
  const grad = ctx.createLinearGradient(50, 0, 6, 0)
  grad.addColorStop(0, shadeToken(pal, 'paper', 'leaf', 0.1, 0.55))
  grad.addColorStop(1, shadeToken(pal, 'paper', 'leaf', 0.1, 0.06))
  ctx.beginPath()
  ctx.moveTo(50, 57)
  ctx.bezierCurveTo(30, 48, 20, 38, 6, 28)
  ctx.bezierCurveTo(14, 42, 17, 52, 13, 60)
  ctx.bezierCurveTo(17, 68, 14, 78, 6, 92)
  ctx.bezierCurveTo(20, 82, 30, 72, 50, 63)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()
  ctx.strokeStyle = alphaToken(pal, 'paper', 0.14)
  ctx.lineWidth = 1
  for (const [x, y] of [[16, 34], [10, 60], [16, 86]]) {
    ctx.beginPath()
    ctx.moveTo(48, 60)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}

/** Sepasang sirip dada & sirip perut, menyamping kiri-kanan tubuh. */
function paintFins(ctx, pal) {
  const warna = shadeToken(pal, 'paper', 'leaf', 0.1, 0.4)
  for (const s of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(150, 60 + s * 13)
    ctx.bezierCurveTo(134, 60 + s * 24, 122, 60 + s * 32, 110, 60 + s * 40)
    ctx.bezierCurveTo(118, 60 + s * 26, 128, 60 + s * 18, 140, 60 + s * 10)
    ctx.closePath()
    ctx.fillStyle = warna
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(92, 60 + s * 18)
    ctx.bezierCurveTo(84, 60 + s * 24, 78, 60 + s * 27, 72, 60 + s * 31)
    ctx.bezierCurveTo(78, 60 + s * 23, 83, 60 + s * 21, 88, 60 + s * 16)
    ctx.closePath()
    ctx.fill()
  }
}

/** Tubuh: gradasi punggung gelap → perut terang (material lukisan ikan). */
function paintBody(ctx, kind, pal) {
  const grad = ctx.createLinearGradient(0, 30, 0, 90)
  grad.addColorStop(0, kind.back(pal))
  grad.addColorStop(0.55, kind.base(pal))
  grad.addColorStop(1, kind.belly(pal))
  traceBody(ctx)
  ctx.fillStyle = grad
  ctx.fill()
} /* taste-skill-ignore: gradasi adalah shading material ikan di canvas, bukan dekorasi UI */

/** Corak khas tiap varietas, terpotong rapi di dalam siluet tubuh. */
function paintPattern(ctx, kind, pal) {
  if (kind.pattern === 'net') return
  ctx.save()
  traceBody(ctx)
  ctx.clip()
  const corak = [[168, 49, 20, 12, -0.35], [128, 71, 18, 10, 0.3], [95, 47, 13, 8, -0.2]]
  const bentuk =
    kind.pattern === 'blobs' ? corak : [[172, 60, 15, 11, 0]]
  for (const [x, y, rx, ry, rot] of bentuk) {
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
    ctx.fillStyle = kind.patch(pal)
    ctx.fill()
  }
  if (kind.pattern === 'stripe') {
    ctx.beginPath()
    ctx.ellipse(120, 60, 58, 7, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Sisik, jala asagi, garis insang, mata, dan kilau punggung. */
function paintDetails(ctx, kind, pal) {
  const padat = kind.pattern === 'net'
  ctx.strokeStyle = alphaToken(pal, 'ink', padat ? 0.2 : 0.08)
  ctx.lineWidth = 1.2
  for (let x = 88; x <= 168; x += 16) {
    for (const y of [52, 60, 68]) {
      ctx.beginPath()
      ctx.arc(x, y, 4.5, Math.PI * 1.2, Math.PI * 1.8)
      ctx.stroke()
    }
  }
  ctx.strokeStyle = alphaToken(pal, 'ink', 0.24)
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(172, 60, 18, Math.PI * 0.5, Math.PI * 1.5)
  ctx.stroke()
  ctx.fillStyle = alphaToken(pal, 'ink', 0.9)
  for (const y of [47, 73]) {
    ctx.beginPath()
    ctx.arc(180, y, 2.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.strokeStyle = alphaToken(pal, 'paper', 0.08)
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(70, 58)
  ctx.lineTo(176, 58)
  ctx.stroke()
}

/** Rakit satu sprite koi utuh ke canvas offscreen. */
export function buildKoi(kind, pal) {
  const canvas = document.createElement('canvas')
  canvas.width = KOI_SIZE.w
  canvas.height = KOI_SIZE.h
  const ctx = canvas.getContext('2d')
  paintTail(ctx, pal)
  paintFins(ctx, pal)
  paintBody(ctx, kind, pal)
  paintPattern(ctx, kind, pal)
  paintDetails(ctx, kind, pal)
  return { canvas, w: KOI_SIZE.w, h: KOI_SIZE.h, body: 188 }
}

/** Sepotong daun teratai: cakram bercekung dengan urat daun. */
export function buildPad(pal) {
  const ukuran = 150
  const canvas = document.createElement('canvas')
  canvas.width = ukuran
  canvas.height = ukuran
  const ctx = canvas.getContext('2d')
  const c = ukuran / 2
  const r = ukuran * 0.44
  const takik = 0.55
  const a0 = -2.2
  const grad = ctx.createRadialGradient(c, c, r * 0.15, c, c, r)
  grad.addColorStop(0, mixTokens(pal, 'leaf', 'paper', 0.16))
  grad.addColorStop(1, mixTokens(pal, 'leaf', 'ink', 0.42))
  ctx.beginPath()
  ctx.moveTo(c, c)
  ctx.arc(c, c, r, a0 + takik, a0 - takik + Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill() /* taste-skill-ignore: gradasi shading material daun, bukan dekorasi UI */
  ctx.strokeStyle = mixTokens(pal, 'leaf', 'paper', 0.4)
  ctx.lineWidth = 1.6
  for (let i = 0; i < 7; i++) {
    const ang = a0 + takik + (Math.PI * 2 - takik * 2) * (i / 6) + 0.05
    ctx.beginPath()
    ctx.moveTo(c + Math.cos(ang) * r * 0.2, c + Math.sin(ang) * r * 0.2)
    ctx.lineTo(c + Math.cos(ang) * r * 0.86, c + Math.sin(ang) * r * 0.86)
    ctx.stroke()
  }
  ctx.strokeStyle = alphaToken(pal, 'paper', 0.3)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(c, c, r - 1.2, a0 + takik, a0 - takik + Math.PI * 2)
  ctx.stroke()
  return { canvas, w: ukuran, h: ukuran }
}

/** Bercak cahaya matahari di permukaan air (kaustik lembut). */
export function buildDapple(pal) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  grad.addColorStop(0, alphaToken(pal, 'paper', 0.5))
  grad.addColorStop(1, alphaToken(pal, 'paper', 0))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128) /* taste-skill-ignore: cahaya kaustik air, bukan latar UI */
  return { canvas, w: 128, h: 128 }
}

/** Bercak cahaya tajuk pepohonan yang jatuh ke air (siluet daun besar). */
export function buildLeafLight(pal) {
  const canvas = document.createElement('canvas')
  canvas.width = 280
  canvas.height = 190
  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.moveTo(36, 168)
  ctx.bezierCurveTo(10, 110, 44, 52, 150, 22)
  ctx.bezierCurveTo(212, 8, 258, 12, 268, 22)
  ctx.bezierCurveTo(216, 60, 150, 108, 92, 150)
  ctx.bezierCurveTo(70, 164, 52, 170, 36, 168)
  ctx.closePath()
  ctx.fillStyle = alphaToken(pal, 'leaf', 0.1)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(64, 132)
  ctx.bezierCurveTo(56, 100, 76, 66, 140, 46)
  ctx.bezierCurveTo(180, 36, 212, 36, 224, 42)
  ctx.bezierCurveTo(188, 68, 140, 100, 100, 126)
  ctx.closePath()
  ctx.fillStyle = alphaToken(pal, 'paper', 0.05)
  ctx.fill()
  return { canvas, w: 280, h: 190 }
}

/** Bayang lembut ikan di dasar kolam (dikembangkan saat digambar). */
export function buildShadow(pal) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62)
  grad.addColorStop(0, alphaToken(pal, 'ink', 0.36))
  grad.addColorStop(0.65, alphaToken(pal, 'ink', 0.16))
  grad.addColorStop(1, alphaToken(pal, 'ink', 0))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  return { canvas, w: 128, h: 128 }
}
