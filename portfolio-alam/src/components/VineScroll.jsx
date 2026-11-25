import { m, useTransform } from 'framer-motion'
import useScrollProgress from '../hooks/useScrollProgress'
import useReducedMotion from '../hooks/useReducedMotion'

const VINE_D =
  'M50 -20 C 10 90, 92 190, 50 300 C 14 400, 88 500, 50 610 C 18 700, 80 760, 50 820'

const LEFT_LEAVES = [0.14, 0.34, 0.54, 0.74, 0.9]
const RIGHT_LEAVES = [0.24, 0.44, 0.64, 0.86]

function VineLeaf({ progress, at, side, index }) {
  const opacity = useTransform(progress, [at - 0.04, at], [0, 1])
  const scale = useTransform(progress, [at - 0.04, at], [0.2, 1])
  const rotate = useTransform(
    progress,
    [at - 0.08, at + 0.14],
    side === 'kiri' ? [-42, -6] : [42, 6],
  )
  return (
    <m.span
      className="vine-leaf absolute inline-block"
      style={{
        top: `${at * 100}%`,
        [side === 'kiri' ? 'left' : 'right']: `${14 + (index % 3) * 16}px`,
        opacity,
        scale,
        rotate,
      }}
    >
      <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
        <path
          d="M13 29 C 3 22, 1 10, 8 1 C 19 6, 24 18, 17 29 C 16 30, 14 30, 13 29 Z"
          fill="var(--c-leaf)"
          fillOpacity="0.8"
        />
      </svg>
    </m.span>
  )
}

function VineSide({ side, leafPoints }) {
  const progress = useScrollProgress()
  const draw = useTransform(progress, [0, 1], [0.02, 1])
  const echo = useTransform(progress, [0, 1], [0, 0.92])

  return (
    <div
      className={`pointer-events-none fixed inset-y-0 ${side === 'kiri' ? 'left-0' : 'right-0'} w-[64px] md:w-[96px] ${
        side === 'kanan' ? 'hidden md:block' : 'block'
      }`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
        style={side === 'kanan' ? { transform: 'scaleX(-1)' } : undefined}
      >
        {/* Sulur utama: panjang terikat progres scroll */}
        <m.path
          d={VINE_D}
          fill="none"
          stroke="var(--c-leaf)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: draw, strokeOpacity: 'var(--alpha-vine-main)' }}
        />
        {/* Sulur gema (lebih redup, sedikit di belakang) */}
        <m.path
          d={VINE_D}
          fill="none"
          stroke="var(--c-moss)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: echo, strokeOpacity: 'var(--alpha-vine-echo)' }}
        />
      </svg>

      {/* Daun mekar di titik-titik sepanjang sulur */}
      <div className="vine-leaves absolute inset-0">
        {leafPoints.map((at, i) => (
          <VineLeaf
            key={`${side}-${at}`}
            progress={progress}
            at={at}
            side={side}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * VineScroll — sulur di tepi kiri & kanan yang terus menjalar mengikuti
 * scroll (stroke-dasharray via pathLength Framer Motion). Mobile hanya
 * sulur kiri dengan daun lebih sedikit. Dimatikan total saat
 * prefers-reduced-motion.
 */
export default function VineScroll() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <>
      <VineSide side="kiri" leafPoints={LEFT_LEAVES} />
      <VineSide side="kanan" leafPoints={RIGHT_LEAVES} />
    </>
  )
}
