import { useEffect, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

// Maksimal 12 partikel: 8 kunang-kunang + 4 daun jatuh (daun disembunyikan
// di layar kecil lewat CSS agar mobile lebih ringan).
const FIREFLIES = [
  { left: '8%', top: '22%', dx: '46px', dy: '-34px', dur: '9s', delay: '0s' },
  { left: '22%', top: '64%', dx: '-38px', dy: '-28px', dur: '11s', delay: '1.2s' },
  { left: '38%', top: '38%', dx: '30px', dy: '26px', dur: '10s', delay: '2.4s' },
  { left: '55%', top: '18%', dx: '-44px', dy: '30px', dur: '12s', delay: '0.8s' },
  { left: '68%', top: '56%', dx: '36px', dy: '-40px', dur: '9.5s', delay: '3.1s' },
  { left: '80%', top: '30%', dx: '-28px', dy: '-22px', dur: '10.5s', delay: '1.7s' },
  { left: '90%', top: '68%', dx: '26px', dy: '-36px', dur: '11.5s', delay: '2.9s' },
  { left: '47%', top: '78%', dx: '-34px', dy: '-24px', dur: '12.5s', delay: '0.4s' },
]

const LEAVES = [
  { left: '12%', dx: '70px', dur: '17s', delay: '0s' },
  { left: '44%', dx: '-60px', dur: '21s', delay: '6s' },
  { left: '63%', dx: '80px', dur: '19s', delay: '11s' },
  { left: '86%', dx: '-70px', dur: '23s', delay: '3.5s' },
]

/**
 * Partikel ambient murni CSS — dijeda otomatis saat tab tidak aktif,
 * dan tidak dirender sama sekali bila prefers-reduced-motion aktif.
 */
export default function Particles() {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (reduce) return null

  return (
    <div
      aria-hidden="true"
      data-paused={paused ? 'true' : 'false'}
      className="particles pointer-events-none fixed inset-0 z-[4] overflow-hidden"
    >
      {FIREFLIES.map((p, i) => (
        <span
          key={`firefly-${i}`}
          className="firefly"
          style={{
            left: p.left,
            top: p.top,
            '--dx': p.dx,
            '--dy': p.dy,
            '--dur': p.dur,
            '--delay': p.delay,
          }}
        />
      ))}
      {LEAVES.map((p, i) => (
        <span
          key={`leaf-${i}`}
          className="falling-leaf"
          style={{ left: p.left, '--dx': p.dx, '--dur': p.dur, '--delay': p.delay }}
        />
      ))}
    </div>
  )
}
