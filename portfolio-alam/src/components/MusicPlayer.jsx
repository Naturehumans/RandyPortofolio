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
const TARGET_VOLUME = 0.3
const FADE_MS = 600

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
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState(false)
  const [broken, setBroken] = useState(false)

  /** Mulai dari senyap lalu naik lembut; mengembalikan promise play(). */
  const start = () => {
    const audio = audioRef.current
    if (!audio || broken) return Promise.resolve(false)
    userPausedRef.current = false
    audio.volume = 0
    return audio.play().then(() => {
      fadeVolume(audio, TARGET_VOLUME)
      setPlaying(true)
      return true
    })
  }

  // Selalu coba autoplay saat dibuka atau di-refresh; bila diblokir kebijakan
  // autoplay browser, langsung mulai pada interaksi pertama pengguna.
  useEffect(() => {
    let cancelled = false
    const audio = audioRef.current
    if (!audio) return undefined

    const detach = () => {
      audio.removeEventListener('canplay', tryPlay)
      window.removeEventListener('pointerdown', onGesture, opts)
      window.removeEventListener('mousedown', onGesture, opts)
      window.removeEventListener('click', onGesture, opts)
      window.removeEventListener('keydown', onGesture, opts)
      window.removeEventListener('touchstart', onGesture, opts)
    }

    const tryPlay = () => {
      if (cancelled || userPausedRef.current || !audio.paused) return
      audio.volume = 0
      const p = audio.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (cancelled) return
          fadeVolume(audio, TARGET_VOLUME)
          setPlaying(true)
          detach()
        }).catch((err) => {
          if (cancelled) return
          if (err && (err.name === 'NotAllowedError' || err.name === 'AbortError')) return
          setBroken(true)
          setToast(true)
        })
      }
    }

    const onGesture = () => tryPlay()
    const opts = { capture: true, passive: true }

    tryPlay()
    audio.addEventListener('canplay', tryPlay)
    window.addEventListener('pointerdown', onGesture, opts)
    window.addEventListener('mousedown', onGesture, opts)
    window.addEventListener('click', onGesture, opts)
    window.addEventListener('keydown', onGesture, opts)
    window.addEventListener('touchstart', onGesture, opts)

    return () => {
      cancelled = true
      detach()
    }
  }, [])

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    userPausedRef.current = true
    fadeVolume(audio, 0, () => audio.pause())
    setPlaying(false)
  }

  const toggle = () => {
    if (playing) {
      stop()
      return
    }
    if (broken) {
      setToast(true)
      return
    }
    start().catch(() => {
      setBroken(true)
      setToast(true)
    })
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" autoPlay onError={() => setBroken(true)} />

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
