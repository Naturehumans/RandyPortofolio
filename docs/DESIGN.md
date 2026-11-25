# Panduan Desain & Antarmuka (DESIGN.md)

## 1. Skill Desain Terpasang
- **Skill Terpasang**: `Leonxlnx/taste-skill` (versi `design-taste-frontend` v2).
- **Lokasi Terpasang**: `.claude/skills/design-taste-frontend/` dan `.agents/skills/design-taste-frontend/`.

### Ringkasan 5 Baris Skill (Taste-Skill v2)
1. **Anti-Slop Art Direction**: Mencegah tampilan generik/template AI dengan mengadopsi prinsip desain dari kurasi 247 situs web kelas dunia (Awwwards, One Page Love).
2. **Generasi Berbasis Subjek**: Menghasilkan arah desain unik (direction), sistem tipografi, palet warna, dan blueprint section menggunakan generator CLI `scripts/draw.mjs`.
3. **House Style Substantif**: Menghilangkan ornamen klise yang tidak perlu (label tipis, card seragam) dan menggantinya dengan tipografi berbobot, bidang warna kontras, serta konten visual asli.
4. **Verifikasi Browser Riil**: Mengaudit kepatuhan styling, kontras, dan struktur secara objektif langsung di browser headless melalui `scripts/inspect.mjs`.
5. **Look-and-Fix Loop**: Menjalankan evaluasi visual multi-resolusi (screenshot responsif) terhadap rubrik desain sebelum kode UI diserahkan.

> **Kewajiban Penggunaan**:
> Skill ini **WAJIB** digunakan saat:
> - Membuat halaman atau komponen baru
> - Melakukan redesign atau penataan ulang antarmuka
> - Meninjau review tampilan visual UI
>
> **Hierarki Keputusan**:
> Jika rekomendasi `taste-skill` bertentangan dengan keputusan atau preferensi eksplisit pengguna, **keputusan pengguna mutlak menang** dan wajib dicatat di [docs/DECISIONS.md](file:///docs/DECISIONS.md).

---

## 2. Aturan Tunggal Token Desain (Single Source of Truth)
> **ATURAN MUTLAK**:
> Nilai konstanta visual (kode HEX/HSL warna, ukuran font, spacing, radius, shadow) **HANYA BOLEH HIDUP DI SATU FILE TOKEN DESAIN** (misalnya `tokens.css` atau sepadan, lokasinya ditentukan saat `/init-app`). 
> File `DESIGN.md` ini hanya mendokumentasikan rasional, makna semantik, dan tautan ke file token tersebut. Dilarang menduplikasi nilai hardcoded di file CSS komponen.

- **Lokasi File Token Desain**: `[ISI SAAT INIT-APP: Path ke file tokens tunggal, mis. frontend/src/styles/tokens.css]`

---

## 3. Prinsip Desain & Mood
- **Karakter / Mood Visual**: `[ISI SAAT INIT-APP: e.g., Editorial modern, minimalis brutalist, clean corporate, playful SaaS]`
- **Filosofi Visual**: `[ISI SAAT INIT-APP: Penjelasan 2-3 kalimat mengenai esensi visual antarmuka]`

---

## 4. Sistem Warna (Color Palette)
*Jelaskan rasional pemilihan warna di bawah ini. Nilai token sebenarnya didefinisikan dalam file tokens.*
- **Primary / Brand**: `[ISI SAAT INIT-APP: Peran warna utama dan rasional]`
- **Secondary / Accent**: `[ISI SAAT INIT-APP: Peran warna aksen untuk call-to-action]`
- **Neutral (Surface, Background, Border)**: `[ISI SAAT INIT-APP: Skala warna netral untuk kontras latar]`
- **Semantic Feedback (Success, Warning, Error, Info)**: `[ISI SAAT INIT-APP: Rasional warna indikator status]`

---

## 5. Tipografi (Typography)
- **Font Display / Heading**: `[ISI SAAT INIT-APP: Nama font heading dan sumber, mis. Outfit dari Google Fonts]`
- **Font Body / UI**: `[ISI SAAT INIT-APP: Nama font teks isi, mis. Inter]`
- **Font Code / Monospace**: `[ISI SAAT INIT-APP: Font monospace untuk data teknis / angka]`
- **Skala Ukuran (Modular Scale)**: `[ISI SAAT INIT-APP: Definisi skala heading H1-H6, Body, Caption]`

---

## 6. Spacing, Grid, & Breakpoint
- **Basis Spacing (Spacing System)**: `[ISI SAAT INIT-APP: e.g., Sistem kelipatan 4px / 8px (4, 8, 12, 16, 24, 32, 48, 64px)]`
- **Breakpoints Responsif**:
  - Mobile: `[ISI SAAT INIT-APP: min-width / max-width, mis. < 640px]`
  - Tablet: `[ISI SAAT INIT-APP: mis. 640px - 1024px]`
  - Desktop: `[ISI SAAT INIT-APP: mis. >= 1024px]`
- **Max Container Width**: `[ISI SAAT INIT-APP: mis. 1200px atau 1440px]`

---

## 7. Border Radius & Shadows (Elevation)
- **Radius Tokens**: `[ISI SAAT INIT-APP: Skala radius: sm, md, lg, full]`
- **Shadow Tokens**: `[ISI SAAT INIT-APP: Skala elevasi: low, medium, high]`

---

## 8. Komponen Inti & State
Setiap komponen antarmuka yang dibuat wajib mengimplementasikan state berikut secara lengkap:
- `default`: Tampilan normal siap pakai.
- `hover`: Indikasi visual saat kursor diarahkan (transisi halus, elevasi/perubahan kontras).
- `focus / focus-visible`: Indikator outline kontras tinggi untuk navigasi keyboard.
- `active / pressed`: Respons taktil saat diklik.
- `disabled`: Tampilan non-interaktif dengan kontras yang tetap dapat terbaca (tidak boleh memicu pointer).
- `loading`: State pemrosesan data (spinner halus / skeleton animation), tombol terkunci dari klik ganda.
- `error`: Penanda visual validasi gagal dengan teks bantuan yang jelas.
- `empty`: Tampilan saat data kosong (ilustrasi/ikon minimal, pesan ramah, dan tombol aksi pertama).

*Daftar komponen inti:* `[ISI SAAT INIT-APP: Button, Input, Modal, Table, Card, Dropdown, dll.]`

---

## 9. Struktur Layout & Navigasi
- **Layout Utama**: `[ISI SAAT INIT-APP: Header, Sidebar, Main Content, Footer]`
- **Pola Navigasi Mobile**: `[ISI SAAT INIT-APP: Bottom bar, drawer, atau hamburger menu]`

---

## 10. Dark Mode & Tema
- **Strategi Tema**: `[ISI SAAT INIT-APP: Sistem CSS class (.dark), media query prefers-color-scheme, dan data-theme]`
- **Kontras Dark Mode**: `[ISI SAAT INIT-APP: Penyesuaian permukaan gelap (menghindari murni hitam #000 untuk mengurangi eye strain)]`

---

## 11. Standar Aksesibilitas (A11y)
1. **Rasio Kontras**: Wajib memenuhi WCAG 2.1 AA (minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar dan komponen grafis).
2. **Target Sentuh (Touch Target)**: Minimal 44x44 CSS pixel untuk semua elemen yang dapat diklik di perangkat seluler.
3. **Navigasi Keyboard**: Seluruh alur dapat diakses menggunakan Tab, Shift+Tab, Enter, dan Spacebar dengan cincin fokus yang jelas.
4. **Semantik HTML & ARIA**: Gunakan tag HTML5 semantik (`<nav>`, `<main>`, `<article>`, `<button>`) dan lengkapi atribut ARIA jika membuat komponen kustom.

---

## 12. Aturan Konten & Microcopy
- **Gaya Bahasa**: `[ISI SAAT INIT-APP: Profesional, santun, lugas, mengutamakan kejelasan]`
- **Pesan Error**: Harus menjelaskan apa yang terjadi dan bagaimana cara memperbaikinya (hindari pesan buntu seperti "Terjadi kesalahan sistem").
- **Tombol Aksi**: Gunakan kata kerja spesifik (mis. "Simpan Pengaturan", "Kirim Tagihan", bukan sekadar "OK" atau "Submit").
