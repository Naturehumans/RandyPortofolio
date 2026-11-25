import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'

/*
  Lagu latar: berkas pemilik proyek di public/audio/nature-jazz.mp3.
  Default AKTIF saat halaman dibuka (dengan fallback gesture bila
  kebijakan autoplay browser memblokir); tombol kanan bawah = tutup.
  JANGAN mengganti dengan lagu berhak cipta tanpa lisensi.
*/
const AUDIO_SRC = '/audio/nature-jazz.mp3'
const OFF_KEY = 'alam-music-off'
const TARGET_VOLUME = 0.3
const FADE_MS = 600

function readFlag(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeFlag(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* penyimpanan bisa ditolak — abaikan */
  }
}

/** Fade volume dengan rAF (hanya properti volume, tanpa layout). */
function fadeVolume(audio, target, onDone) {
  const start = audio.volume
  const t0 = performance.now()
  const step = (now) => {
    const progress = Math.min(1, (now - t0) / FADE_MS)
    audio.volume = Math.max(0, Math.min(1, start + (target - start) * progress))
    if (progress < 1) {
      requestAnimationFrame(step)
    } else if (onDone) {
      onDone()
    }
  }
  requestAnimationFrame(step)
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState(false)
  const [broken, setBroken] = useState(false)

  /** Mulai dari senyap lalu naik lembut; mengembalikan promise play(). */
  const start = () => {
    const audio = audioRef.current
    if (!audio || broken) return Promise.resolve(false)
    audio.volume = 0
    return audio.play().then(() => {
      fadeVolume(audio, TARGET_VOLUME)
      setPlaying(true)
      return true
    })
  }

  // Default aktif: coba putar langsung; bila diblokir kebijakan autoplay,
  // mulai pada interaksi pertama pengguna — tanpa mengganggu halaman.
  useEffect(() => {
    if (readFlag(OFF_KEY) === 'true') return undefined
    let batal = false
    let aktif = false
    let audio = null

    const attempt = () => {
      if (aktif) return
      audio = audioRef.current
      if (!audio) return
      aktif = true
      audio.volume = 0
      audio
        .play()
        .then(() => {
          if (batal) return
          fadeVolume(audio, TARGET_VOLUME)
          setPlaying(true)
        })
        .catch((err) => {
          aktif = false
          if (batal || (err && err.name === 'NotAllowedError')) return
          setBroken(true)
          setToast(true)
        })
    }

    attempt()
    const buka = () => attempt()
    window.addEventListener('pointerdown', buka)
    window.addEventListener('keydown', buka)
    window.addEventListener('touchstart', buka)
    return () => {
      batal = true
      window.removeEventListener('pointerdown', buka)
      window.removeEventListener('keydown', buka)
      window.removeEventListener('touchstart', buka)
    }
  }, [])

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    fadeVolume(audio, 0, () => audio.pause())
    setPlaying(false)
  }

  const toggle = () => {
    if (playing) {
      stop()
      writeFlag(OFF_KEY, 'true')
      return
    }
    if (broken) {
      setToast(true)
      return
    }
    start()
      .then((ok) => {
        if (ok) writeFlag(OFF_KEY, 'false')
      })
      .catch(() => {
        setBroken(true)
        setToast(true)
      })
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" onError={() => setBroken(true)} />

      <AnimatePresence>
        {toast && (
          <m.div
            key="toast-musik"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="status"
            className="fixed bottom-24 right-5 z-50 max-w-[240px] rounded-3xl bg-forest px-5 py-4 text-sm text-[var(--c-on-forest)]"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <p>Berkas musik belum bisa diputar. Taruh nature-jazz.mp3 di public/audio/.</p>
              <button
                type="button"
                onClick={() => setToast(false)}
                aria-label="Tutup pemberitahuan musik"
                className="btn-icon !h-8 !w-8 text-[var(--c-muted-on-forest)]"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Matikan musik jazz latar' : 'Putar musik jazz latar'}
        aria-pressed={playing}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#fff6ec] transition-transform hover:-translate-y-1"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        {playing ? (
          <>
            <span className="absolute -left-9 eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <Pause size={22} aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="absolute -left-9 eq eq--idle" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <Play size={22} aria-hidden="true" />
          </>
        )}
      </button>
    </>
  )
}
