import { m } from 'framer-motion'
import { Download } from 'lucide-react'
import { about, site } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { safeUrl, externalProps } from '../utils/safeUrl'
import { revealVariants, onceViewport } from './reveal'
import ParallaxBox from './ParallaxBox'
import SmartImage from './SmartImage'

function Portrait({ media }) {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0">
      <div aria-hidden="true" className="portrait-halo blob-b absolute -inset-5 bg-leaf opacity-20" />
      <ParallaxBox
        variants={media}
        amount={16}
        className="slot slot-portrait blob-a relative aspect-[4/5] w-full -rotate-2"
      >
        <SmartImage
          src={about.portrait.src}
          alt={about.portrait.alt}
          width={about.portrait.width}
          height={about.portrait.height}
        />
      </ParallaxBox>
    </div>
  )
}

export default function About() {
  const reduce = useReducedMotion()
  const { container, item, media } = revealVariants(reduce)
  const cvHref = safeUrl(site.cvPath)

  return (
    <section id="tentang" aria-labelledby="tentang-judul" className="py-28 md:py-36">
      <div className="wrap">
        <m.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="grid gap-14 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-5">
            <m.div variants={item}>
              <Portrait media={media} />
            </m.div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <m.h2
              id="tentang-judul"
              variants={item}
              className="text-[length:var(--text-h2)] font-semibold"
            >
              Tentang Saya
            </m.h2>
            <m.p
              variants={item}
              className="mt-7 max-w-xl font-display text-[length:var(--text-statement)] font-normal leading-snug text-ink"
            >
              {about.statement}
            </m.p>
            {about.paragraphs.map((paragraph) => (
              <m.p key={paragraph.slice(0, 24)} variants={item} className="mt-5 text-ink">
                {paragraph}
              </m.p>
            ))}

            <ul className="mt-10 space-y-6">
              {about.principles.map((principle) => (
                <m.li key={principle.title} variants={item} className="flex gap-4">
                  <span aria-hidden="true" className="blob-a mt-1.5 h-3.5 w-3.5 shrink-0 bg-moss" />
                  <span>
                    <strong className="font-medium">{principle.title}.</strong>{' '}
                    <span className="text-muted">{principle.body}</span>
                  </span>
                </m.li>
              ))}
            </ul>

            {cvHref && (
              <m.a
                variants={item}
                href={cvHref}
                download="CV_Randy_Frederick_Leonardy.pdf"
                {...externalProps(cvHref)}
                className="btn btn-quiet mt-10"
              >
                <Download size={18} aria-hidden="true" />
                Unduh CV
              </m.a>
            )}
          </div>
        </m.div>
      </div>
    </section>
  )
}
