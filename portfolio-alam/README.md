# Portofolio Alam — "Hutan Hujan Saat Fajar"

Portofolio personal bertema alam (konsep: **hutan hujan tropis saat fajar**, gaya
editorial-organik) dibangun dengan React 18 + Vite, Tailwind CSS, Framer Motion
(`LazyMotion`/`domAnimation`), dan lucide-react.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # hasil di dist/
npm run preview # pratinjau hasil build
npm run audit   # audit keamanan dependency
```

## Konsep desain (ringkas)

- **Palet** (token di `src/styles/tokens.css`): kertas sage `#eef0e2`, tinta hutan
  `#1d2a1c`, terracotta `#a84a2b`, oker `#7a5a14`, hijau lumut `#5a703c`, daun muda
  `#8fae62`, bidang hutan `#0d1a12`. Mode gelap otomatis (`prefers-color-scheme`)
  + toggle eksplisit.
- **Tipografi**: Fraunces (display, aksara serif ekspresif) + DM Sans (body),
  dimuat via Google Fonts `display=swap` dengan `preconnect`.
- **Bahasa visual**: bentuk daun organik (`border-radius` blob asimetris), grain
  kertas tipis, layout yang sesekali memecah grid (offset, rotasi kecil), sulur
  yang tumbuh mengikuti scroll.

## Cara mengganti konten

| Apa | Di mana |
| --- | --- |
| Semua teks, proyek, keahlian, timeline, galeri, sosial | `src/data/content.js` (cari komentar `TODO: GANTI`) |
| Warna, radius, bayangan (design tokens) | `src/styles/tokens.css` |
| Endpoint form kontak | `.env` (salin dari `.env.example`) — variabel `VITE_CONTACT_ENDPOINT` |
| Endapan deployment header keamanan | `vercel.json` (Vercel) / `public/_headers` (Netlify) |

### Gambar (semua `.webp`)

Timpa berkas placeholder di `public/images/...` dengan nama yang sama:

- `hero/hero-bg.webp` (1600×1200) — dipakai dengan `fetchpriority="high"`
- `about/profile.webp` (640×760)
- `projects/project-1..5.webp` (800×620)
- `gallery/gallery-1..6.webp` (600×450 s.d. 600×800 — sesuaikan `width`/`height`
  di `content.js` bila rasionya berbeda)
- `og/og-image.webp` (disarankan 1200×630)

Selama berkas masih placeholder 1×1 px, slot menampilkan tinta + watermark daun.
Begitu diganti gambar asli, foto langsung tampil (deteksi otomatis di
`src/components/SmartImage.jsx`). Kompres ke WebP (mis. `cwebp -q 80`).

### Lagu jazz latar

- Berkas: `public/audio/nature-jazz.mp3` (saat ini placeholder hening).
- Ganti dengan **jazz bebas royalti/berlisensi**: instrumental soft jazz,
  bossa nova, atau lo-fi jazz bertema alam (sumber: Free Music Archive, Pixabay
  Music, Incompetech — cek lisensinya). **Jangan** memakai lagu berhak cipta.
- Pemutar: `loop`, `preload="none"`, volume 0.3 dengan fade-in/out, tombol
  mengambang dengan ikon equalizer, preferensi disimpan di localStorage.
- Musik hanya mulai setelah interaksi pengguna (autoplay diblokir browser).

### CV

Taruh berkas di `public/cv/nama-cv.pdf`, lalu sesuaikan `site.cvPath` di
`src/data/content.js`.

## Keamanan (Security Checklist)

- [x] Tidak ada `dangerouslySetInnerHTML`, `eval`, atau `innerHTML` di kode.
- [x] Semua tautan eksternal memakai `target="_blank" rel="noopener noreferrer"`.
- [x] URL dari data divalidasi `safeUrl()`: hanya `https:`, `mailto:`, path relatif.
- [x] Form kontak: sanitasi + validasi klien (batas panjang, format email,
      strip tag), honeypot anti-bot, throttle 30 detik. **Validasi klien tidak
      cukup — wajib validasi ulang di server.**
- [x] Tidak ada API key/secret di kode; `.env` di `.gitignore`, `.env.example`
      tersedia. Ingat: variabel `VITE_` terekspos ke publik.
- [x] CSP + header keamanan (nosniff, Referrer-Policy, X-Frame-Options DENY,
      Permissions-Policy) di `vercel.json` dan `public/_headers`.
      Catatan: `'unsafe-inline'` pada `style-src` dibutuhkan Framer Motion
      (inline style), bukan skrip. Jika endpoint kontak beda domain, tambahkan
      hostnya ke `connect-src`.
- [x] Versi dependency dikunci persis (tanpa `^`), `npm audit` dijalankan.
- [x] Semua `<img>` punya `alt`, `width`, `height`, `loading="lazy"`
      (kecuali hero: `fetchpriority="high"`), `decoding="async"`.

## Aksesibilitas

HTML semantik, skip-link, `:focus-visible` kontras, target sentuh ≥ 44 px,
kontras teks WCAG AA di mode terang & gelap, `prefers-reduced-motion`
(mematikan sulur, parallax, partikel), `aria-live` pada status form & toast.

## Performa

- `React.lazy` + `Suspense` untuk semua section di bawah fold; code splitting
  otomatis Vite (chunk per section).
- Animasi hanya `transform`/`opacity`; partikel & animasi CSS dijeda saat tab
  tak aktif; `LazyMotion` + `domAnimation` menjaga bundle Framer Motion ringan.
- `preconnect` font, `100dvh`, tipografi fluid `clamp()`.

## Deploy

**Vercel**: import repo, framework "Vite", selesai (header dari `vercel.json`).
**Netlify**: build `npm run build`, publish `dist/`, header dari `public/_headers`.
Isi `.env` di dashboard sebelum build.
