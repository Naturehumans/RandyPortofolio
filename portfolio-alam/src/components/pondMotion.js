/**
 * Simulasi dunia kolam: pembenihan ikan/teratai/kaustik dan langkah
 * simulasi tiap frame — berenang, kabur dari jari, riak mengembang.
 * Semua fungsi bekerja pada satu objek `dunia` milik pondScene.js agar
 * tidak ada status ganda antar-modul.
 */

const TAU = Math.PI * 2
const FISH_DESKTOP = 7
const FISH_PHONE = 5
const DAPPLE_COUNT = 6
const RIPPLE_CAP = 30
const JANGKAUAN_JARI = 92 // px — jari mengganggu ikan dalam radius ini

const rand = (min, max) => min + Math.random() * (max - min)

/** Putar sudut `from` mendekati `to` proporsional t (0..1), aman lintas ±π. */
function approachAngle(from, to, t) {
  let beda = (to - from) % TAU
  if (beda > Math.PI) beda -= TAU
  if (beda < -Math.PI) beda += TAU
  return from + beda * t
}

/** Satu ikan: arah, kecepatan dasar, kedalaman (menentukan skala & alpha). */
function createFish(dunia, i, jumlahVarian) {
  const depth = rand(0.5, 1)
  const tinggi = Math.min(1.35, Math.max(0.85, dunia.height / 480))
  return {
    x: rand(0, dunia.width),
    y: rand(dunia.height * 0.12, dunia.height * 0.92),
    ang: rand(0, TAU),
    baseSpeed: rand(20, 38) * (0.6 + 0.4 * depth),
    depth,
    len: rand(52, 88) * (0.6 + 0.4 * depth) * tinggi,
    variant: i % jumlahVarian,
    phase: rand(0, TAU),
    turn: rand(-0.5, 0.5),
    turnAt: rand(0.5, 3),
    burst: 0,
    flee: 0,
    fx: 0,
    fy: 0,
  }
}

/** Benih dunia: ikan terurut kedalaman, teratai acak, kaustik, cahaya tajuk. */
export function spawnWorld(dunia, jumlahVarian) {
  dunia.fish = []
  const jumlah = dunia.width < 640 ? FISH_PHONE : FISH_DESKTOP
  for (let i = 0; i < jumlah; i++) dunia.fish.push(createFish(dunia, i, jumlahVarian))
  dunia.fish.sort((a, b) => a.depth - b.depth) // ikan yang dalam digambar dulu
  dunia.pads = []
  for (let i = 0; i < 3; i++) {
    dunia.pads.push({
      fx: rand(0.06, 0.94),
      fy: rand(0.1, 0.9),
      skala: rand(0.75, 1.3),
      rot: rand(0, TAU),
      fase: rand(0, TAU),
    })
  }
  dunia.dapples = []
  for (let i = 0; i < DAPPLE_COUNT; i++) {
    dunia.dapples.push({ fx: Math.random(), fy: Math.random(), sp: rand(0.12, 0.3), fase: rand(0, TAU), a: rand(0.05, 0.1) })
  }
  dunia.leafLights = [
    { fx: 0.76, fy: 0.04, skala: 1.2, fase: 0.7 },
    { fx: 0.12, fy: -0.08, skala: 0.95, fase: 2.9 },
  ]
  dunia.ambientAt = rand(1.2, 3)
}

/** Desis satu riak; strength 0..1 menentukan radius/kecepatan/alfa. */
export function pulse(dunia, x, y, strength, delay = 0, dim = 1) {
  if (dunia.ripples.length >= RIPPLE_CAP) dunia.ripples.shift()
  dunia.ripples.push({
    x,
    y,
    delay,
    r: 3 + strength * 6,
    v: 64 + 150 * strength,
    a0: (0.3 + 0.42 * strength) * dim,
    life: 1,
    seed: rand(0, TAU),
    // tiap riak sedikit lonjong & bergelombang sendiri — bukan cincin cetak
    wob: rand(0.014, 0.034),
    sx: rand(0.94, 1.06),
    decay: dim < 0.8 ? 0.92 : 0.6,
  })
}

/** Ikan mengembara, mengejar sudut belok acak, menghindari tepi & jari. */
function stepFish(dunia, f, dt) {
  if (dunia.time > f.turnAt) {
    f.turn = rand(-0.6, 0.6)
    f.turnAt = dunia.time + rand(1.6, 4.2)
  }
  f.ang += f.turn * dt
  let burst = f.burst
  const jari = dunia.finger
  if (jari.inside) {
    const dx = f.x - jari.tx
    const dy = f.y - jari.ty
    if (Math.hypot(dx, dy) < JANGKAUAN_JARI) {
      f.ang = approachAngle(f.ang, Math.atan2(dy, dx), Math.min(1, dt * 7))
      burst = Math.max(burst, 0.8)
    }
  }
  if (f.flee > 0.01) {
    f.ang = approachAngle(f.ang, Math.atan2(f.y - f.fy, f.x - f.fx), Math.min(1, dt * 9))
    burst = Math.max(burst, f.flee * 1.4)
    f.flee *= Math.exp(-dt * 2.4)
  }
  f.burst *= Math.exp(-dt * 3)
  const speed = f.baseSpeed * (1 + burst * 1.6)
  f.x += Math.cos(f.ang) * speed * dt
  f.y += Math.sin(f.ang) * speed * dt
  f.phase += dt * (3.2 + speed * 0.055)
  if (f.x < 40) f.ang = approachAngle(f.ang, 0, dt * 3)
  if (f.x > dunia.width - 40) f.ang = approachAngle(f.ang, Math.PI, dt * 3)
  if (f.y < 34) f.ang = approachAngle(f.ang, Math.PI / 2, dt * 3)
  if (f.y > dunia.height - 34) f.ang = approachAngle(f.ang, -Math.PI / 2, dt * 3)
}

/** Riak melebar lalu meluruh; menunggu `delay` untuk riak bertingkat. */
function stepRipples(dunia, dt) {
  for (const r of dunia.ripples) {
    if (r.delay > 0) {
      r.delay -= dt
      continue
    }
    r.r += r.v * dt
    r.v *= Math.exp(-dt * 1.05)
    r.life -= dt * (r.decay || 0.6)
  }
  dunia.ripples = dunia.ripples.filter((r) => r.life > 0)
}

/** Jari mengikuti pointer dengan pelunakan; berdesis riak saat bergerak. */
function stepFinger(dunia, dt) {
  const jari = dunia.finger
  const k = 1 - Math.exp(-dt * 12) // lembut seperti jari terseret air
  jari.x += (jari.tx - jari.x) * k
  jari.y += (jari.ty - jari.y) * k
  const target = jari.inside ? 1 : 0
  jari.alpha += (target - jari.alpha) * (1 - Math.exp(-dt * 6))
  const jarak = Math.hypot(jari.x - jari.trailX, jari.y - jari.trailY)
  if (jari.alpha > 0.4 && jarak > 104) {
    jari.trailX = jari.x
    jari.trailY = jari.y
    pulse(dunia, jari.x, jari.y, 0.3, 0, 0.5)
  }
  jari.press *= Math.exp(-dt * 4)
}

/** Riak samar dari gangguan jauh — permukaan tetap hidup tanpa ramai. */
function ambientRipple(dunia) {
  if (dunia.ripples.length >= RIPPLE_CAP) return
  dunia.ripples.push({
    x: rand(0.08, 0.92) * dunia.width,
    y: rand(0.15, 0.85) * dunia.height,
    delay: 0,
    r: 10,
    v: 150,
    a0: 0.085,
    life: 1,
    seed: rand(0, TAU),
  })
}

/** Satu langkah simulasi lengkap; dt dipangkas pemanggil (maks 0.05 s). */
export function step(dunia, dt) {
  dunia.time += dt
  if (dunia.time > dunia.ambientAt) {
    dunia.ambientAt = dunia.time + rand(2, 4)
    ambientRipple(dunia)
  }
  for (const f of dunia.fish) stepFish(dunia, f, dt)
  stepRipples(dunia, dt)
  stepFinger(dunia, dt)
}
