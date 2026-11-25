import { useState } from 'react'
import { m } from 'framer-motion'
import { skills } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { revealVariants, onceViewport } from './reveal'

/* 6 Dahan utama: 3 dahan ke kiri, 3 dahan ke kanan secara bergantian alami */
const BRANCHES = [
  { index: 0, side: 'left', yTrunk: 105, xTip: 62, yTip: 85 },
  { index: 2, side: 'right', yTrunk: 140, xTip: 318, yTip: 120 },
  { index: 1, side: 'left', yTrunk: 185, xTip: 58, yTip: 178 },
  { index: 3, side: 'right', yTrunk: 220, xTip: 322, yTip: 212 },
  { index: 5, side: 'left', yTrunk: 265, xTip: 68, yTip: 272 },
  { index: 4, side: 'right', yTrunk: 300, xTip: 312, yTip: 306 },
]

function TreeIllustration({ active, onSelect }) {
  return (
    <figure className="relative mx-auto w-full max-w-[380px]">
      <svg
        viewBox="0 0 380 380"
        className="h-auto w-full overflow-visible select-none"
        aria-hidden="true"
      >
        <defs>
          <filter id="branchGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>

        {/* 1. Akar pohon alami di bagian bawah */}
        <g stroke="var(--c-forest-leaf)" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M 190 338 C 178 350, 160 358, 142 362" />
          <path d="M 190 338 C 190 352, 188 360, 186 366" />
          <path d="M 190 338 C 202 350, 220 358, 238 362" />
        </g>

        {/* 2. Batang utama pohon (meruncing anggun dari bawah ke atas) */}
        <path
          d="M 190 342 L 190 68"
          stroke="var(--c-forest-leaf)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Pucuk daun di puncak batang */}
        <path
          d="M 190 68 C 184 55, 189 44, 190 42 C 191 44, 196 55, 190 68 Z"
          fill="var(--c-forest-leaf)"
          fillOpacity="0.9"
        />

        {/* 3. Enam dahan yang tumbuh ke kiri dan kanan */}
        {BRANCHES.map((b) => {
          const isLeft = b.side === 'left'
          const skill = skills[b.index]
          const isCurrent = active === b.index
          const isDimmed = active !== null && !isCurrent

          /* Kurva dahan alami menggunakan cubic bezier */
          const cp1x = isLeft ? 145 : 235
          const cp1y = b.yTrunk - 4
          const cp2x = isLeft ? b.xTip + 36 : b.xTip - 36
          const cp2y = b.yTip + 14
          const branchPath = `M 190 ${b.yTrunk} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${b.xTip} ${b.yTip}`

          /* Posisi daun di dahan */
          const leafX = 190 + (b.xTip - 190) * 0.48
          const leafY = b.yTrunk + (b.yTip - b.yTrunk) * 0.48
          const leafAngle = isLeft ? -25 : 25

          return (
            <g
              key={skill.name}
              className="cursor-pointer transition-opacity duration-300"
              style={{ opacity: isDimmed ? 0.35 : 1 }}
              onClick={() => onSelect(b.index)}
            >
              {/* Batang dahan */}
              <path
                d={branchPath}
                fill="none"
                stroke={isCurrent ? 'var(--c-forest-terracotta)' : 'var(--c-forest-leaf)'}
                strokeWidth={isCurrent ? 3.2 : 2}
                strokeLinecap="round"
                className="transition-colors duration-200"
                filter={isCurrent ? 'url(#branchGlow)' : undefined}
              />

              {/* Daun kecil yang tumbuh di dahan */}
              <path
                d="M 0 0 C 4 -7, 12 -7, 14 0 C 12 7, 4 7, 0 0 Z"
                transform={`translate(${leafX}, ${leafY}) rotate(${leafAngle}) scale(${isCurrent ? 1.15 : 0.9})`}
                fill={isCurrent ? 'var(--c-forest-terracotta)' : 'var(--c-forest-moss)'}
                fillOpacity={isCurrent ? 0.95 : 0.65}
                className="transition-all duration-200"
              />

              {/* Simpul tunas di ujung dahan */}
              {isCurrent && (
                <circle
                  cx={b.xTip}
                  cy={b.yTip}
                  r="13"
                  fill="var(--c-forest-terracotta)"
                  fillOpacity="0.25"
                  className="animate-pulse"
                />
              )}
              <circle
                cx={b.xTip}
                cy={b.yTip}
                r={isCurrent ? 6.5 : 4.5}
                fill={isCurrent ? 'var(--c-forest-terracotta)' : 'var(--c-forest-leaf)'}
                stroke="var(--c-forest)"
                strokeWidth="1.5"
                className="transition-all duration-200"
              />

              {/* Teks persentase di samping ujung dahan */}
              <text
                x={isLeft ? b.xTip - 10 : b.xTip + 10}
                y={b.yTip + 5}
                textAnchor={isLeft ? 'end' : 'start'}
                fill={isCurrent ? 'var(--c-forest-terracotta)' : 'var(--c-on-forest)'}
                fillOpacity={isCurrent ? 1 : 0.8}
                fontSize="13"
                fontWeight={isCurrent ? '700' : '600'}
                className="font-display tabular-nums transition-colors duration-200"
              >
                {skill.level}%
              </text>
            </g>
          )
        })}
      </svg>

      {/* Keterangan di bawah pohon */}
      <figcaption className="mt-2 min-h-[48px] text-center transition-all duration-300">
        {active !== null ? (
          <div>
            <p className="font-display text-lg font-semibold text-[var(--c-forest-terracotta)]">
              {skills[active].name} · {skills[active].level}%
            </p>
            <p className="mt-0.5 text-xs text-[var(--c-muted-on-forest)]">
              {skills[active].note}
            </p>
          </div>
        ) : (
          <div>
            <p className="font-display text-base font-semibold text-[var(--c-on-forest)]">
              Satu Batang, Enam Dahan Keahlian
            </p>
            <p className="mt-0.5 text-xs text-[var(--c-muted-on-forest)]">
              Akar yang kokoh menumbuhkan solusi nyata
            </p>
          </div>
        )}
      </figcaption>
    </figure>
  )
}

export default function Skills() {
  const reduce = useReducedMotion()
  const { container, item } = revealVariants(reduce)
  const [active, setActive] = useState(null)

  return (
    <section
      id="keahlian"
      aria-labelledby="keahlian-judul"
      className="bg-forest py-28 text-[var(--c-on-forest)] md:py-36"
    >
      <div className="wrap">
        <m.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="grid items-center gap-16 lg:grid-cols-2"
        >
          <div>
            <m.h2
              id="keahlian-judul"
              variants={item}
              className="text-[length:var(--text-h2)] font-semibold"
            >
              Keahlian
            </m.h2>
            <m.p variants={item} className="mt-4 max-w-xl text-lg text-[var(--c-muted-on-forest)]">
              Satu batang, banyak cabang. Setiap dahan keahlian berakar dari masalah nyata di lapangan dan bertumbuh melalui ratusan jam eksperimen rekayasa.
            </m.p>

            {/* Daftar keahlian interaktif */}
            <ul className="mt-10 space-y-2">
              {skills.map((skill, i) => {
                const isCurrent = active === i
                return (
                  <m.li key={skill.name} variants={item}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(isCurrent ? null : i)}
                      onBlur={() => setActive(null)}
                      aria-pressed={isCurrent}
                      className={`group flex min-h-[44px] w-full flex-col justify-center rounded-2xl px-5 py-3 text-left transition-all ${
                        isCurrent
                          ? 'bg-[var(--c-hover-on-forest)] ring-1 ring-[var(--c-forest-leaf)]/30'
                          : 'hover:bg-[var(--c-hover-on-forest)]/60'
                      }`}
                    >
                      <div className="flex w-full items-baseline justify-between gap-4">
                        <span className={`font-medium ${isCurrent ? 'text-[var(--c-forest-terracotta)]' : 'text-[var(--c-on-forest)]'}`}>
                          {skill.name}
                        </span>
                        <span className="shrink-0 font-display text-lg font-semibold tabular-nums text-[var(--c-forest-leaf)]">
                          {skill.level}%
                        </span>
                      </div>
                      <span className="mt-0.5 block text-xs text-[var(--c-muted-on-forest)]">
                        {skill.note}
                      </span>
                    </button>
                  </m.li>
                )
              })}
            </ul>
          </div>

          <m.div variants={item}>
            <TreeIllustration
              active={active}
              onSelect={(index) => setActive(active === index ? null : index)}
            />
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
