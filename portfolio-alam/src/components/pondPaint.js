/**
 * Pelukis lapisan kolam, urutan dari bawah ke atas:
 * air (kedalaman, caustic dasar, berkas sinar) → cahaya tajuk → ikan
 * → teratai → caustic permukaan → bintik cahaya → riak → jari.
 * Warna selalu dari token via `pal`; tekstur (pondWater.js) dibuat sekali,
 * sehingga satu frame hanya berisi drawImage/fillRect/stroke ringan.
 */
import { alphaToken } from './pondColor'

const TAU = Math.PI * 2
const STRIPS = 7 // potongan sprite untuk unulasi tubuh ikan
const FINGER_R = 16
const HUGE = 6000 // rect caustic; rasterizer hanya melukis area terlihat

/** Lingkaran riak yang berombak & sedikit lonjong — bukan cincin sempurna. */
function ringPath(ctx, x, y, r, seed, wob = 0.016, sx = 1) {
  const n = Math.max(30, Math.min(80, Math.round(r * 0.8)))
  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU
    const rr = r * (1 + wob * (Math.sin(a * 3 + seed) * 0.62 + Math.sin(a * 5 - seed * 0.8) * 0.38))
    const px = x + Math.cos(a) * rr * sx
    const py = y + Math.sin(a) * rr * (2 - sx)
    if (i) ctx.lineTo(px, py)
    else ctx.moveTo(px, py)
  }
  ctx.closePath()
}

/** Cincin lembut: sapuan lebar pudar di bawah sapuan tipis yang terang. */
function softRing(ctx, x, y, r, tebal, warna, alfa, seed, passes = 3, wob = 0.016, sx = 1) {
  if (alfa < 0.012 || r < 1) return
  ctx.strokeStyle = warna
  const lapis = passes === 3 ? [[4.2, 0.08], [2.8, 0.16], [1.8, 0.28], [1, 0.85]] : [[1, 1]]
  for (const [kali, bobot] of lapis) {
    ctx.globalAlpha = alfa * bobot
    ctx.lineWidth = tebal * kali
    ringPath(ctx, x, y, r, seed, wob, sx)
    ctx.stroke()
  }
  ctx.lineWidth = 1
  ctx.globalAlpha = 1
}

/** Gambar satu ikan: bayangan dasar + sprite terbelah yang berombak. */
function drawFish(ctx, sprites, f) {
  const sprite = sprites.koi[f.variant]
  const skala = f.len / sprite.body
  const w = sprite.w * skala
  const h = sprite.h * skala
  const alfa = f.depth < 0.62 ? 0.82 : 0.95
  ctx.globalAlpha = alfa * 0.4
  ctx.drawImage(sprites.shadow.canvas, f.x - w * 0.46 + 6, f.y - h * 0.42 + f.len * 0.13, w * 0.9, h * 0.85)
  ctx.save()
  ctx.translate(f.x, f.y)
  ctx.rotate(f.ang)
  ctx.globalAlpha = alfa
  const potong = sprite.w / STRIPS
  for (let i = 0; i < STRIPS; i++) {
    const ayun = Math.sin(f.phase - i * 0.55) * f.len * 0.08 * (i / (STRIPS - 1))
    ctx.drawImage(
      sprite.canvas,
      sprite.w - (i + 1) * potong, 0, potong, sprite.h,
      w / 2 - (i + 1) * potong * skala, ayun, potong * skala + 0.6, h,
    )
  }
  ctx.restore()
  ctx.globalAlpha = 1
}

function drawPads(ctx, dunia, sprites) {
  const dasar = Math.min(1.35, Math.max(0.7, Math.min(dunia.width, dunia.height * 1.9) / 640))
  for (const p of dunia.pads) {
    const s = 118 * p.skala * dasar
    const x = p.fx * dunia.width
    const y = p.fy * dunia.height + Math.sin(dunia.time * 0.45 + p.fase) * 3
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(p.rot + Math.sin(dunia.time * 0.12 + p.fase) * 0.1)
    ctx.drawImage(sprites.pad.canvas, -s / 2, -s / 2, s, s)
    ctx.restore()
  }
}

function drawDapples(ctx, dunia, sprites) {
  for (const d of dunia.dapples) {
    const x = d.fx * dunia.width + Math.sin(dunia.time * d.sp + d.fase) * 14
    const y = d.fy * dunia.height + Math.cos(dunia.time * d.sp * 0.8 + d.fase) * 10
    ctx.globalAlpha = d.a
    ctx.drawImage(sprites.dapple.canvas, x - 32, y - 32, 64, 64)
  }
  ctx.globalAlpha = 1
}

/** Dasar air: gradasi kedalaman + zona cahaya (tekstur statis). */
function drawWater(ctx, dunia, sprites) {
  ctx.drawImage(sprites.water.canvas, 0, 0, dunia.width, dunia.height)
}

/** Satu lapisan caustic: pattern diulang, digeser & diskalakan perlahan. */
function drawCaustic(ctx, dunia, pattern, opsi) {
  if (!pattern) return
  const t = dunia.time
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opsi.alfa
  ctx.rotate(opsi.putar)
  ctx.scale(opsi.skala, opsi.skala)
  ctx.translate(-((t * opsi.geser[0]) % 256), -((t * opsi.geser[1]) % 256))
  ctx.fillStyle = pattern
  ctx.fillRect(-HUGE, -HUGE, HUGE * 2, HUGE * 2)
  ctx.restore()
}

/** Berkas sinar dari tajuk: empat balok miring yang bergoyang pelan. */
function drawShafts(ctx, dunia, sprites) {
  const t = dunia.time
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.055
  for (let i = 0; i < 4; i++) {
    const x = dunia.width * (0.04 + i * 0.29) + Math.sin(t * 0.07 + i * 1.9) * 24
    ctx.save()
    ctx.translate(x, -dunia.height * 0.06)
    ctx.rotate(0.3 + Math.sin(t * 0.045 + i * 1.3) * 0.05)
    ctx.drawImage(sprites.shaft.canvas, -70, 0, 140, dunia.height * 1.3)
    ctx.restore()
  }
  ctx.restore()
}

/** Riak: puncak terang + puncak dalam samar, sedikit berombak. */
function drawRipples(ctx, dunia, pal) {
  const cahaya = alphaToken(pal, 'paper', 1)
  const bayang = alphaToken(pal, 'ink', 1)
  ctx.save()
  ctx.lineJoin = 'round'
  for (const r of dunia.ripples) {
    if (r.delay > 0) continue
    const a = Math.max(0, r.a0 * Math.pow(r.life, 1.4))
    if (a < 0.01) continue
    const tebal = 0.8 + r.life * 1.5
    const wob = r.wob ?? 0.016
    const sx = r.sx ?? 1
    softRing(ctx, r.x, r.y + 1.4, r.r, tebal, bayang, a * 0.3, r.seed, 1, wob, sx)
    softRing(ctx, r.x, r.y, r.r, tebal, cahaya, a, r.seed, 3, wob, sx)
    const dalam = r.r - 13
    if (r.a0 > 0.25 && dalam > 2) softRing(ctx, r.x, r.y, dalam, tebal * 0.8, cahaya, a * 0.28, r.seed + 1.4, 2, wob, sx)
  }
  ctx.restore()
  ctx.globalAlpha = 1
}

/** Kursor "jari celup": titik kontak + cincin riak yang bernapas. */
function drawFinger(ctx, dunia, sprites, pal) {
  const jari = dunia.finger
  if (jari.alpha < 0.02) return
  const a = jari.alpha
  const r = FINGER_R + jari.press * 6
  ctx.globalAlpha = 0.2 * a
  ctx.drawImage(sprites.dapple.canvas, jari.x - 30, jari.y - 30, 60, 60)
  ctx.globalAlpha = 1
  ctx.fillStyle = alphaToken(pal, 'paper', 0.08 * a)
  ctx.beginPath()
  ctx.ellipse(jari.x, jari.y, 9, 6.2, 0.5, 0, TAU)
  ctx.fill()
  const cahaya = alphaToken(pal, 'paper', 1)
  const napas = Math.sin(dunia.time * 2.6) * 1.8
  // satu gelombang kontak yang lonjong & bernapas, plus tebaran samar —
  // bukan dua cincin konsentris yang terbaca seperti bidikan
  softRing(ctx, jari.x, jari.y, r + napas, 1.3, cahaya, 0.4 * a, dunia.time * 0.9, 2, 0.05,
    1.02 + Math.sin(dunia.time * 0.7) * 0.06)
  softRing(ctx, jari.x, jari.y, r * 2.1 + napas, 1, cahaya, 0.07 * a, dunia.time * 0.6, 2, 0.06, 1)
}

/** Gambar seluruh kolam sekali (dipakai frame loop maupun frame statis). */
export function paintScene(ctx, dunia, sprites, pal) {
  ctx.clearRect(0, 0, dunia.width, dunia.height)
  drawWater(ctx, dunia, sprites)
  drawCaustic(ctx, dunia, sprites.causticPattern, { skala: 1.7, putar: 0.12, geser: [8, 4], alfa: 0.09 })
  drawCaustic(ctx, dunia, sprites.causticPattern, { skala: 0.8, putar: 0.05, geser: [15, -9], alfa: 0.05 })
  drawShafts(ctx, dunia, sprites)
  for (const l of dunia.leafLights) {
    const w = Math.max(180, dunia.width * 0.26) * l.skala
    const h = (w * sprites.leaf.h) / sprites.leaf.w
    const x = l.fx * dunia.width + Math.sin(dunia.time * 0.05 + l.fase) * 14
    const y = l.fy * dunia.height + Math.cos(dunia.time * 0.04 + l.fase) * 8
    ctx.drawImage(sprites.leaf.canvas, x, y, w, h)
  }
  for (const f of dunia.fish) drawFish(ctx, sprites, f)
  drawPads(ctx, dunia, sprites)
  // Lapisan permukaan: cahaya menari juga di punggung ikan.
  drawCaustic(ctx, dunia, sprites.causticPattern, { skala: 2.4, putar: -0.16, geser: [-5, 6], alfa: 0.05 })
  drawDapples(ctx, dunia, sprites)
  ctx.drawImage(sprites.vignette.canvas, 0, 0, dunia.width, dunia.height)
  drawRipples(ctx, dunia, pal)
  drawFinger(ctx, dunia, sprites, pal)
}
