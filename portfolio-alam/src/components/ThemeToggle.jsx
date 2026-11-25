import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'

const KEY = 'alam-theme'

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null // localStorage bisa ditolak (mode privat) — abaikan
  }
}

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Bentuk "ambang" tema baru: lingkaran bertepi sedikit tidak rata yang
 * tumbuh dari tombol. Titik-titiknya sama banyak di awal & akhir sehingga
 * browser bisa meng-interpolasi polygon-nya dengan mulus.
 */
function rippleClip(rect, progress) {
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 48
  const y = rect ? rect.top + rect.height / 2 : 48
  const w = window.innerWidth
  const h = window.innerHeight
  const far = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.08
  const t = Math.max(progress, 0.0015)
  const total = 30
  const points = []
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2
    // tepi bergelombang tipis: terasa merambat, bukan cincin kompas
    const wobble = 1 + 0.022 * Math.sin(angle * 3 + 0.9) + 0.012 * Math.sin(angle * 7 - 0.4)
    const r = t * far * wobble
    points.push(`${(x + Math.cos(angle) * r).toFixed(1)}px ${(y + Math.sin(angle) * r).toFixed(1)}px`)
  }
  return `polygon(${points.join(', ')})`
}

/**
 * Toggle tema terang/gelap. Sistem CSS (tokens.css) sudah menghormati
 * prefers-color-scheme tanpa JS; toggle ini menyimpan pilihan eksplisit.
 * Bila browser mendukung View Transitions, tema baru merambat dari tombol;
 * bila tidak (atau pengguna minta gerak minimal), pergantian langsung.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    const stored = readStoredTheme()
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored)
      setDark(stored === 'dark')
    } else {
      setDark(systemDark())
    }
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const current = root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'

    const apply = () => {
      root.setAttribute('data-theme', next)
      flushSync(() => setDark(next === 'dark'))
    }

    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* simpan best-effort */
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof document.startViewTransition !== 'function') {
      apply()
      return
    }

    const rect = btnRef.current ? btnRef.current.getBoundingClientRect() : null
    try {
      root.setAttribute('data-theme-swap', '')
      const transition = document.startViewTransition(apply)
      transition.ready
        .then(() => {
          root.animate(
            { clipPath: [rippleClip(rect, 0), rippleClip(rect, 1)] },
            {
              duration: 900,
              easing: 'cubic-bezier(0.33, 0.05, 0.24, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          )
        })
        .catch(() => {
          /* transisi dibatalkan (klik beruntun) — tema sudah berganti */
        })
        .finally(() => {
          root.removeAttribute('data-theme-swap')
        })
    } catch {
      // API menolak (mis. saat halaman sedang ditutup) — ganti tanpa animasi
      root.removeAttribute('data-theme-swap')
      apply()
    }
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      aria-pressed={dark}
      className="btn-icon text-ink"
    >
      {dark ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  )
}
