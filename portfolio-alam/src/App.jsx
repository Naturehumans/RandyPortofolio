import { Suspense, lazy, useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Pond from './components/Pond'
import Footer from './components/Footer'
import VineScroll from './components/VineScroll'
import Particles from './components/Particles'
import MusicPlayer from './components/MusicPlayer'

// Section di bawah fold dimuat malas (code splitting per section)
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Timeline = lazy(() => import('./components/Timeline'))
const Skills = lazy(() => import('./components/Skills'))
const Gallery = lazy(() => import('./components/Gallery'))
const Contact = lazy(() => import('./components/Contact'))

function SectionFallback({ minHeight = '70vh' }) {
  return <div style={{ minHeight }} aria-hidden="true" />
}

export default function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#konten" className="skip-link">
        Langsung ke konten
      </a>

      {/* Dekorasi latar: di bawah konten, tak bisa diklik */}
      <VineScroll />
      <Particles />

      <Navbar />

      <main id="konten" tabIndex={-1}>
        <Hero />
        <Pond />
        <Suspense fallback={<SectionFallback minHeight="55vh" />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Timeline />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight="80vh" />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
      <MusicPlayer />
    </LazyMotion>
  )
}
