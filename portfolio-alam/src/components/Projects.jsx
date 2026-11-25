import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { safeUrl, externalProps } from '../utils/safeUrl'
import { revealVariants, onceViewport } from './reveal'
import ParallaxBox from './ParallaxBox'
import SmartImage from './SmartImage'

/* Lebar & offset tak seragam: grid sengaja "pecah" — editorial-organik */
const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-24',
  'lg:col-span-5',
  'lg:col-span-7 lg:-mt-14',
  'lg:col-span-8 lg:col-start-3 lg:-mt-10',
]
const BLOBS = ['blob-a', 'blob-b', 'blob-b', 'blob-a', 'blob-b']

function ProjectCard({ project, index, item, media }) {
  const href = safeUrl(project.url)
  return (
    <m.article variants={item} className={SPANS[index % SPANS.length]}>
      <ParallaxBox
        variants={media}
        className={`group slot ${BLOBS[index % BLOBS.length]} aspect-[4/3]`}
      >
        <SmartImage
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          className="group-hover:scale-[1.05]"
        />
      </ParallaxBox>
      <div className="mt-5">
        <p className="text-sm text-muted">
          {project.category} · {project.year}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold">{project.title}</h3>
        <p className="mt-2.5 text-ink">{project.description}</p>
        <p className="mt-1.5 text-sm text-muted">Peran: {project.role}</p>
        {href && (
          <a
            href={href}
            {...(href.startsWith('http') ? externalProps(href) : {})}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 font-medium text-accent transition-transform hover:-translate-y-0.5"
          >
            Kunjungi proyek
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only">{`, ${project.title}`}</span>
          </a>
        )}
      </div>
    </m.article>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const { container, item, media } = revealVariants(reduce)

  return (
    <section
      id="proyek"
      aria-labelledby="proyek-judul"
      className="bg-raised py-28 md:py-36"
    >
      <div className="wrap">
        <m.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
        >
          <m.h2
            id="proyek-judul"
            variants={item}
            className="text-[length:var(--text-h2)] font-semibold"
          >
            Proyek Pilihan
          </m.h2>
          <m.p variants={item} className="mt-4 max-w-xl text-lg text-muted">
            Lima karya yang mewakili eksplorasi saya: dari sistem pelacakan cerdas
            (GNSS-RTK & OCR), dashboard spasial interaktif, hingga aplikasi mobile dan AI.
          </m.p>
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} item={item} media={media} />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
