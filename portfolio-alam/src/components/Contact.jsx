import { useRef, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowUpRight, Download, Mail, MapPin, Send } from 'lucide-react'
import { contact, site, socials } from '../data/content'
import useReducedMotion from '../hooks/useReducedMotion'
import { safeUrl, externalProps } from '../utils/safeUrl'
import { sanitizeText, isEmail } from '../utils/sanitize'
import { revealVariants, onceViewport } from './reveal'

const COOLDOWN_MS = 30000 // throttle: satu kirim per 30 detik

/** Validasi & sanitasi input (klien). WAJIB divalidasi ulang di server. */
function buildMessage(form) {
  const nama = sanitizeText(form.get('nama'), 80)
  const email = sanitizeText(form.get('email'), 120)
  const pesan = sanitizeText(form.get('pesan'), 1000)
  const honeypot = sanitizeText(form.get(contact.honeypotName), 120)

  if (!nama || !isEmail(email) || pesan.length < 10) {
    return { error: 'Periksa kembali: nama wajib diisi, email valid, pesan minimal 10 karakter.' }
  }
  return { data: { nama, email, pesan }, honeypot }
}

export default function Contact() {
  const reduce = useReducedMotion()
  const { container, item } = revealVariants(reduce)
  const [status, setStatus] = useState({ state: 'idle', text: '' })
  const lastSentRef = useRef(0)

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const result = buildMessage(form)
    if (result.error) {
      setStatus({ state: 'error', text: result.error })
      return
    }
    // Honeypot terisi = bot: pura-pura sukses tanpa mengirim apa pun
    if (result.honeypot) {
      setStatus({ state: 'success', text: 'Pesan diterima. Terima kasih!' })
      return
    }
    if (Date.now() - lastSentRef.current < COOLDOWN_MS) {
      setStatus({ state: 'error', text: 'Tunggu sebentar sebelum mengirim lagi, ya.' })
      return
    }

    lastSentRef.current = Date.now()
    setStatus({ state: 'sending', text: 'Mengirim pesan…' })
    const customEndpoint = safeUrl(import.meta.env.VITE_CONTACT_ENDPOINT || '')
    const endpoint =
      customEndpoint && customEndpoint.startsWith('https://')
        ? customEndpoint
        : `https://formsubmit.co/ajax/${site.email}`

    const payload = customEndpoint
      ? result.data
      : {
          name: result.data.nama,
          email: result.data.email,
          message: result.data.pesan,
          _subject: `Pesan Portofolio dari ${result.data.nama}`,
          _replyto: result.data.email,
          _template: 'table',
        }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok || json.success === 'false' || json.success === false) {
        throw new Error(`HTTP ${response.status}`)
      }
      setStatus({ state: 'success', text: `Pesan terkirim ke ${site.email}. Terima kasih!` })
      event.currentTarget.reset()
    } catch {
      setStatus({ state: 'error', text: `Pengiriman gagal. Coba lagi atau email langsung ke ${site.email}.` })
    }
  }

  return (
    <section id="kontak" aria-labelledby="kontak-judul" className="bg-sunken py-28 md:py-36">
      <div className="wrap">
        <m.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={onceViewport}
          className="grid gap-14 lg:grid-cols-12"
        >
          {/* Surat */}
          <m.form
            variants={item}
            onSubmit={submit}
            noValidate
            className="paper relative bg-raised p-7 sm:p-10 lg:col-span-7"
          >
            <span
              aria-hidden="true"
              className="absolute right-7 top-7 flex h-16 w-14 rotate-3 items-center justify-center rounded-md border-2 border-accent-soft"
            >
              <svg width="20" height="24" viewBox="0 0 26 30" aria-hidden="true">
                <path
                  d="M13 29 C 3 22, 1 10, 8 1 C 19 6, 24 18, 17 29 C 16 30, 14 30, 13 29 Z"
                  fill="var(--c-accent-soft)"
                  fillOpacity="0.7"
                />
              </svg>
            </span>

            <h2 id="kontak-judul" className="max-w-md text-[length:var(--text-h2)] font-semibold">
              Kirim Surat
            </h2>

            <div className="mt-8 grid gap-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Nama</span>
                <input
                  type="text"
                  name="nama"
                  required
                  maxLength={80}
                  autoComplete="name"
                  className="w-full rounded-full border border-line bg-bg px-5 py-3"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  className="w-full rounded-full border border-line bg-bg px-5 py-3"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Pesan</span>
                <textarea
                  name="pesan"
                  required
                  rows={5}
                  maxLength={1000}
                  className="w-full rounded-[26px] border border-line bg-bg px-5 py-3.5"
                />
              </label>

              {/* Honeypot anti-bot: tersembunyi dari manusia, manis untuk bot */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Jangan isi kolom ini
                  <input
                    type="text"
                    name={contact.honeypotName}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <button type="submit" className="btn btn-solid" disabled={status.state === 'sending'}>
                  <Send size={18} aria-hidden="true" />
                  {status.state === 'sending' ? 'Mengirim…' : 'Kirim Pesan'}
                </button>
                <p aria-live="polite" className={`text-sm ${status.state === 'error' ? 'text-accent' : 'text-muted'}`}>
                  {status.text}
                </p>
              </div>
            </div>
          </m.form>

          {/* Alamat & tautan */}
          <div className="lg:col-span-4 lg:col-start-9">
            <m.h2 variants={item} className="text-[length:var(--text-h2)] font-semibold">
              Kontak
            </m.h2>
            <m.p variants={item} className="mt-4 text-ink">
              {contact.blurb}
            </m.p>

            <m.ul variants={item} className="mt-9 space-y-3 text-[15px]">
              <li>
                <a
                  href={safeUrl(`mailto:${site.email}`) || '#'}
                  className="inline-flex min-h-[44px] items-center gap-2.5 font-medium text-ink hover:text-accent"
                >
                  <Mail size={18} aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-muted">
                <MapPin size={18} aria-hidden="true" />
                {site.location}
              </li>
              {site.cvPath && (
                <li>
                  <a
                    href={safeUrl(site.cvPath) || '#'}
                    download="CV_Randy_Frederick_Leonardy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2.5 font-medium text-ink hover:text-accent"
                  >
                    <Download size={18} aria-hidden="true" />
                    Unduh CV
                  </a>
                </li>
              )}
            </m.ul>

            <m.ul variants={item} className="mt-9 flex flex-wrap gap-2.5">
              {socials.map((social) => {
                const href = safeUrl(social.url)
                if (!href) return null
                const external = href.startsWith('http')
                return (
                  <li key={social.label}>
                    <a
                      href={href}
                      {...(external ? externalProps(href) : {})}
                      className="btn btn-quiet !min-h-[44px] px-5"
                    >
                      {social.label}
                      {external && <ArrowUpRight size={16} aria-hidden="true" />}
                    </a>
                  </li>
                )
              })}
            </m.ul>
          </div>
        </m.div>
      </div>
    </section>
  )
}
