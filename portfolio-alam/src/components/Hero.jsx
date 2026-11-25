import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { hero } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import SmartImage from './SmartImage'

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* Tajuk daun di tepi kanan — bahasa grafis datar, warna palet sendiri */
const CANOPY = [
  { d: 'M620 30 C 430 80, 300 165, 205 305 C 335 260, 480 185, 620 30 Z', fill: '#1e3526', o: 0.95 },
  { d: 'M620 140 C 465 185, 352 262, 282 385 C 405 330, 515 255, 620 140 Z', fill: '#2c4a34', o: 0.85 },
  { d: 'M620 255 C 485 300, 392 362, 342 468 C 445 425, 532 352, 620 255 Z', fill: '#3d5f42', o: 0.8 },
  { d: 'M620 372 C 508 412, 428 470, 390 556 C 478 522, 556 452, 620 372 Z', fill: '#5a703c', o: 0.75 },
  { d: 'M620 476 C 532 512, 470 560, 440 628 C 516 600, 576 542, 620 476 Z', fill: '#8fae62', o: 0.65 },
]

function CanopyLayer({ sway }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-[55%] sm:w-[48%]" aria-hidden="true">
      <div className={sway ? 'sway h-full w-full' : 'h-full w-full'}>
        <svg viewBox="0 0 620 640" className="h-full w-full" preserveAspectRatio="xMaxYMid slice">
          {CANOPY.map((leaf, i) => (
            <path key={i} d={leaf.d} fill={leaf.fill} fillOpacity={leaf.o} />
          ))}
        </svg>
      </div>
    </div>
  )
}

function Backdrop({ reduce, yFar, yMid }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        {/* Gambar hero: satu-satunya yang boleh fetchpriority=high */}
        <SmartImage
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          priority
          className="h-full w-full object-cover opacity-70"
        />
        {/* Penudung agar teks selalu terbaca (scrim netral di atas foto, pengecualian house style).
            Selama foto masih placeholder, penudung ini mati lewat CSS supaya nada
            bidang hero tidak ikut tercuci. */}
        <div className="hero-scrim absolute inset-0 bg-[linear-gradient(180deg,var(--c-veil)_0%,var(--c-veil-soft)_45%,var(--c-veil)_100%)]" /> {/* taste-skill-ignore: scrim netral di atas foto, pengecualian yang diizinkan */}
      </div>

      {/* Lapisan parallax: cak fajar datar, lalu tajuk daun */}
      <m.div
        style={{ y: yFar }}
        className="absolute right-[16%] top-[16%] hidden sm:block"
      >
        <div className="h-64 w-64 rounded-full bg-ochre opacity-20 md:h-80 md:w-80" />
      </m.div>
      <m.div style={{ y: yMid }} className="absolute inset-0">
        <CanopyLayer sway={!reduce} />
      </m.div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yFar = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 70])
  const yMid = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 150])
  const yText = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 46])

  return (
    <section
      id="beranda"
      ref={ref}
      aria-label="Perkenalan"
      className="bg-raised relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <Backdrop reduce={reduce} yFar={yFar} yMid={yMid} />

      <m.div style={{ y: yText }} className="relative z-10 w-full">
        <div className="wrap pb-28 pt-36 sm:pb-36">
          <m.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
            className="max-w-3xl text-[length:var(--text-hero)] font-semibold"
          >
            {hero.title}
          </m.h1>
          <m.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink"
          >
            {hero.statement}
          </m.p>
          <m.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href={hero.primaryCta.href} className="btn btn-solid">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-quiet">
              {hero.secondaryCta.label}
            </a>
          </m.div>
        </div>
      </m.div>

      <div className="absolute bottom-7 left-0 z-10 w-full">
        <div className="wrap flex items-center gap-3 text-sm text-muted">
          <ChevronDown size={18} aria-hidden="true" className="bob shrink-0" />
          <span>Gulir pelan, hutan ini tumbuh saat kamu berjalan.</span>
        </div>
      </div>
    </section>
  )
}
