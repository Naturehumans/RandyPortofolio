import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '../data/content'
import ThemeToggle from './ThemeToggle'

const SECTION_IDS = navLinks.map((link) => link.href.replace('#', ''))

const menuList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}
const menuItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}

/** Indikator section aktif lewat IntersectionObserver. */
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return active
}

export default function Navbar() {
  const scrolled = useScrolled()
  const active = useActiveSection()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled && !open ? 'bg-[var(--c-veil)]' : open ? 'bg-bg' : 'bg-raised'
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="relative z-50 mx-auto flex w-full max-w-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8"
      >
        <a
          href="#beranda"
          className="inline-flex min-h-[44px] items-center font-display text-lg font-semibold leading-none tracking-tight"
        >
          {site.name}
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.replace('#', '')
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-[15px] transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="blob-a h-2.5 w-2.5 bg-accent"
                    />
                  )}
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            className="btn-icon lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            key="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-bg lg:hidden"
          >
            <m.nav
              aria-label="Menu seluler"
              variants={menuList}
              initial="hidden"
              animate="show"
              className="flex h-full flex-col justify-center px-8"
            >
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <m.li key={link.href} variants={menuItem}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex min-h-[44px] items-center font-display text-4xl text-ink"
                    >
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </ul>
              <m.p variants={menuItem} className="mt-10 text-sm text-muted">
                {site.role}, {site.location}
              </m.p>
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
