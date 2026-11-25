import { m } from 'framer-motion'
import { gallery } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { revealVariants, onceViewport } from './reveal'
import ParallaxBox from './ParallaxBox'
import SmartImage from './SmartImage'

/* Masonry asimetris: CSS columns + rasio beragam + rotasi halus */
const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[5/6]', 'aspect-[7/6]']
const TILTS = ['-rotate-[0.7deg]', 'rotate-[0.5deg]', '-rotate-[0.4deg]', 'rotate-[0.8deg]', '-rotate-[0.6deg]', 'rotate-[0.4deg]']

function GalleryItem({ item, index, variants, media }) {
  return (
    <m.figure
      variants={variants}
      className={`mb-5 break-inside-avoid ${TILTS[index % TILTS.length]} transition-transform hover:rotate-0`}
    >
      <ParallaxBox
        variants={media}
        className={`slot ${ASPECTS[index % ASPECTS.length]}`}
        overlay={
          <figcaption className="absolute inset-x-0 bottom-0 bg-[var(--c-scrim)] px-4 py-3 text-sm text-[var(--c-on-forest)]">
            {item.caption}
          </figcaption>
        }
      >
        <SmartImage
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
        />
      </ParallaxBox>
    </m.figure>
  )
}

export default function Gallery() {
  const reduce = useReducedMotion()
  const { container, item, media } = revealVariants(reduce)

  return (
    <section id="galeri" aria-labelledby="galeri-judul" className="py-28 md:py-36">
      <div className="wrap">
        <m.h2
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          id="galeri-judul"
          className="text-[length:var(--text-h2)] font-semibold"
        >
          Galeri Lapangan
        </m.h2>
        <m.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="mt-4 max-w-xl text-lg text-muted"
        >
          Potongan proses: catatan riset, eksperimen, dan sesi malam, bukan foto hasil akhir saja.
        </m.p>

        <m.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3"
        >
          {gallery.map((entry, index) => (
            <GalleryItem key={entry.src} item={entry} index={index} variants={item} media={media} />
          ))}
        </m.div>
      </div>
    </section>
  )
}
