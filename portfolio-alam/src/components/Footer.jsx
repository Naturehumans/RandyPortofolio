import { m } from 'framer-motion'
import { site, footer, navLinks, socials } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { safeUrl, externalProps } from '../utils/safeUrl'
import { revealVariants, onceViewport } from './reveal'

/* Dua lapis siluet tajuk hutan, digambar dari motif kanopi halaman ini */
const TREES_FAR =
  'M0 120 L0 88 C 90 84, 150 56, 220 66 C 290 46, 360 72, 430 64 C 500 84, 570 52, 640 68 C 710 48, 780 74, 850 66 C 920 84, 990 56, 1060 70 C 1130 52, 1200 76, 1270 68 C 1340 84, 1390 60, 1440 72 L1440 120 Z'
const TREES_NEAR =
  'M0 120 L0 66 C 70 62, 110 22, 168 40 C 210 6, 268 34, 320 30 C 380 66, 440 12, 500 34 C 560 62, 620 20, 690 36 C 750 8, 810 40, 872 32 C 930 62, 990 16, 1050 38 C 1110 10, 1170 44, 1230 34 C 1290 64, 1350 22, 1440 40 L1440 120 Z'

function ForestEdge() {
  return (
    <div aria-hidden="true" className="relative">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[64px] w-full md:h-[104px]">
        <path d={TREES_FAR} fill="#1a3122" />
        <path d={TREES_NEAR} fill="var(--c-forest)" />
      </svg>
    </div>
  )
}

export default function Footer() {
  const reduce = useReducedMotion()
  const { container, item } = revealVariants(reduce)

  return (
    <footer className="bg-[var(--c-forest)] text-[var(--c-on-forest)]">
      <ForestEdge />
      <m.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={onceViewport}
        className="wrap pb-12 pt-4 md:pt-8"
      >
        <m.p
          variants={item}
          className="font-display text-[length:var(--text-hero)] font-semibold leading-[1.02]"
        >
          {site.name}
        </m.p>
        <m.p variants={item} className="mt-3 max-w-md text-[var(--c-muted-on-forest)]">
          {site.tagline}
        </m.p>

        <m.div variants={item} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <nav aria-label="Navigasi footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-[15px] text-[var(--c-muted-on-forest)] hover:text-[var(--c-on-forest)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => {
              const href = safeUrl(social.url)
              if (!href) return null
              return (
                <li key={social.label}>
                  <a
                    href={href}
                    {...(href.startsWith('http') ? externalProps(href) : {})}
                    className="inline-flex min-h-[44px] items-center text-[15px] text-[var(--c-muted-on-forest)] hover:text-[var(--c-on-forest)]"
                  >
                    {social.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </m.div>

        <m.div
          variants={item}
          className="mt-10 flex flex-wrap items-end justify-between gap-4 pt-2 text-sm text-[var(--c-muted-on-forest)]"
        >
          <p>
            © 2026 {site.name}. {footer.line}
          </p>
          <p>{footer.musicNote}</p>
          <a href="#beranda" className="min-h-[44px] font-medium text-[var(--c-on-forest)]">
            Kembali ke puncak ↑
          </a>
        </m.div>
      </m.div>
    </footer>
  )
}
