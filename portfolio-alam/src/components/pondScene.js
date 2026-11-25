/**
 * Gudang scene kolam (dipakai Pond.jsx): memegang seluruh status dunia,
 * menghubungkan simulasi (pondMotion.js) dengan pelukis (pondPaint.js),
 * dan mengekspos API kecil untuk komponen React.
 *
 * Ringan: hanya transform + drawImage per frame; loop rAF berhenti saat
 * tab tersembunyi atau kolam di luar layar (dikendalikan Pond.jsx);
 * DPR dibatasi; jumlah ikan turun di layar sempit.
 */
import { readPalette } from './pondColor'
import { buildDapple, buildKoi, buildLeafLight, buildPad, buildShadow, KOI_KINDS } from './pondSprites'
import { buildCaustic, buildShaft, buildVignette, buildWaterBase } from './pondWater'
import { paintScene } from './pondPaint'
import { pulse, spawnWorld, step } from './pondMotion'

const DPR_CAP = 1.5

export function createScene(canvas) {
  const ctx = canvas.getContext('2d')
  const pal = readPalette(canvas)
  const dunia = {
    fish: [],
    ripples: [],
    pads: [],
    dapples: [],
    leafLights: [],
    finger: { x: 0, y: 0, tx: 0, ty: 0, trailX: 0, trailY: 0, inside: false, alpha: 0, press: 0 },
    width: 0,
    height: 0,
    time: 0,
  }
  let sprites = null
  let rafId = 0
  let tLast = 0
  let isRunning = false
  let hasSpawned = false
  let curBucket = ''

  /** Sprite dibuat sekali per ikatan tema: koi 4 varietas + pembanding. */
  function ensureSprites() {
    if (sprites) return
    sprites = {
      koi: KOI_KINDS.map((kind) => buildKoi(kind, pal)),
      pad: buildPad(pal),
      dapple: buildDapple(pal),
      shadow: buildShadow(pal),
      leaf: buildLeafLight(pal),
      water: buildWaterBase(pal),
      caustic: buildCaustic(pal),
      shaft: buildShaft(pal),
      vignette: buildVignette(pal),
      causticPattern: null,
    }
    sprites.causticPattern = ctx.createPattern(sprites.caustic.canvas, 'repeat')
  }

  /** Ukur ulang canvas (DPR terbatas); benih ulang bila ukuran/bucket berubah. */
  function resize() {
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    if (!cw || !ch) return
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
    const targetW = Math.round(cw * dpr)
    const targetH = Math.round(ch * dpr)
    const bucket = cw < 640 ? 'phone' : 'wide'
    const sudahSiap = hasSpawned && targetW === canvas.width && targetH === canvas.height && bucket === curBucket && dunia.width === cw
    if (sudahSiap) return
    dunia.width = cw
    dunia.height = ch
    curBucket = bucket
    // Backbuffer bisa sudah berukuran benar dari ikatan scene sebelumnya;
    // karena itu ukuran ATUR di sini, jangan jadikan tanda dunia siap.
    if (targetW !== canvas.width || targetH !== canvas.height) {
      canvas.width = targetW
      canvas.height = targetH
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    ensureSprites()
    spawnWorld(dunia, sprites.koi.length)
    hasSpawned = true
    if (!isRunning) paintScene(ctx, dunia, sprites, pal) // frame statis saat jeda
  }

  /** Klik / tap: riak bertingkat, ikan di sekitar kabur, jari menekan. */
  function tap(x, y) {
    pulse(dunia, x, y, 1, 0)
    pulse(dunia, x, y, 0.72, 0.09)
    pulse(dunia, x, y, 0.45, 0.2)
    pulse(dunia, x, y, 0.3, 0.34)
    for (const f of dunia.fish) {
      const jarak = Math.hypot(f.x - x, f.y - y)
      const kejut = Math.min(1, 1.25 - jarak / 260)
      if (kejut > f.flee) {
        f.flee = kejut
        f.fx = x
        f.fy = y
      }
    }
    Object.assign(dunia.finger, { x, y, tx: x, ty: y, press: 1 })
  }

  /** Gerak pointer di dalam kolam (kursor jari). */
  function movePointer(x, y) {
    const jari = dunia.finger
    if (!jari.inside) {
      jari.x = x // langsung di titik sentuh, tanpa jelek meluncur dari tepi
      jari.y = y
      jari.trailX = x
      jari.trailY = y
      jari.inside = true
    }
    jari.tx = x
    jari.ty = y
  }

  function leavePointer() {
    dunia.finger.inside = false
  }

  function frame(ts) {
    if (!isRunning) return
    if (!tLast) tLast = ts
    const dt = Math.min(0.05, (ts - tLast) / 1000)
    tLast = ts
    step(dunia, dt)
    paintScene(ctx, dunia, sprites, pal)
    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (isRunning || !hasSpawned) return
    isRunning = true
    tLast = 0
    rafId = requestAnimationFrame(frame)
  }

  function stop() {
    isRunning = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
    tLast = 0
  }

  return { resize, start, stop, destroy: stop, tap, movePointer, leavePointer }
}
