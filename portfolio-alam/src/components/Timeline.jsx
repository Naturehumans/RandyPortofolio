import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { timeline } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { revealVariants, onceViewport } from './reveal'

/* Batang pohon: garis statis tunggal dari titik daun pertama hingga titik akhir (Next Opportunity) */
const TRUNK_D = 'M20 0 L20 1000'

function Trunk({ height }) {
  if (!height || height <= 0) return null
  return (
    <div
      className="pointer-events-none absolute left-4 w-8 -translate-x-1/2 top-5 md:top-6 md:left-1/2 md:-translate-x-1/2"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
      >
        <path
          d={TRUNK_D}
          fill="none"
          stroke="var(--c-leaf)"
          strokeWidth="4.5"
          vectorEffect="non-scaling-stroke"
          style={{ strokeOpacity: 0.85 }}
        />
      </svg>
    </div>
  )
}

function Entry({ entry, index, item, isLast, lastLiRef }) {
  const isRight = index % 2 === 1
  const isNext = Boolean(entry.isNextOpportunity)

  return (
    <m.li
      ref={isLast ? lastLiRef : undefined}
      variants={item}
      className={`relative pl-14 md:w-1/2 md:pl-0 ${
        isRight ? 'md:ml-auto md:pl-16' : 'md:pr-16'
      }`}
    >
      {/* Tunas daun di batang: satu titik persis di tengah garis batang */}
      <span
        aria-hidden="true"
        className={`timeline-dot z-10 absolute top-2.5 h-5 w-5 blob-a left-4 -translate-x-1/2 md:top-3.5 ${
          isRight ? 'md:left-0 md:-translate-x-1/2' : 'md:left-auto md:right-0 md:translate-x-1/2'
        } ${isNext ? '!bg-accent shadow-sm ring-4 ring-sunken' : 'bg-leaf shadow-sm ring-4 ring-sunken'}`}
      />

      {isNext ? (
        <div className="rounded-2xl border border-leaf/30 bg-raised p-7 shadow-float transition-shadow hover:shadow-lg">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-xs font-semibold text-leaf">
            <Sparkles size={14} aria-hidden="true" />
            <span>Tunas Baru · Next Opportunity</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{entry.role}</h3>
          <p className="mt-0.5 text-sm font-medium text-accent">{entry.org}</p>
          <p className="mt-3 text-ink leading-relaxed">{entry.summary}</p>
          <a
            href="#kontak"
            className="btn btn-solid mt-6"
          >
            <span>Mari Berkolaborasi</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      ) : (
        <div className="group">
          <p className="text-sm tabular-nums text-muted">{entry.period}</p>
          <h3 className="mt-1.5 font-display text-2xl font-semibold text-ink">{entry.role}</h3>
          <p className="mt-0.5 text-sm font-medium text-moss">{entry.org}</p>
          <p className="mt-3 leading-relaxed text-ink">{entry.summary}</p>
        </div>
      )}
    </m.li>
  )
}

export default function Timeline() {
  const reduce = useReducedMotion()
  const { container, item } = revealVariants(reduce)
  const containerRef = useRef(null)
  const lastLiRef = useRef(null)
  const [stemHeight, setStemHeight] = useState(0)

  useEffect(() => {
    const update = () => {
      if (lastLiRef.current) {
        setStemHeight(lastLiRef.current.offsetTop)
      }
    }

    update()

    const rafId = requestAnimationFrame(update)

    const ro = typeof ResizeObserver !== 'undefined' && containerRef.current
      ? new ResizeObserver(update)
      : null

    if (ro && containerRef.current) {
      ro.observe(containerRef.current)
    }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(update).catch(() => {})
    }

    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(rafId)
      ro?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section id="perjalanan" aria-labelledby="perjalanan-judul" className="bg-sunken py-28 md:py-36">
      <div className="wrap">
        <m.h2
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          id="perjalanan-judul"
          className="text-[length:var(--text-h2)] font-semibold"
        >
          Perjalanan
        </m.h2>
        <m.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="mt-4 max-w-xl text-lg text-muted"
        >
          Sulur yang terus merambat dari akar masalah, bercabang lewat pengalaman nyata, dan siap membuka tunas baru.
        </m.p>

        <div className="relative mt-16" ref={containerRef}>
          <Trunk height={stemHeight} />
          <m.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={onceViewport}
            className="relative space-y-14 md:space-y-20"
          >
            {timeline.map((entry, index) => (
              <Entry
                key={`${entry.period}-${index}`}
                entry={entry}
                index={index}
                item={item}
                isLast={index === timeline.length - 1}
                lastLiRef={lastLiRef}
              />
            ))}
          </m.ol>
        </div>
      </div>
    </section>
  )
}
