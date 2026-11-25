# Riwayat Perubahan (CHANGELOG.md)

Seluruh perubahan penting pada proyek ini didokumentasikan dalam file ini mengacu pada format [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/lang/id/).

---

## [Unreleased]
### Added
- **`portfolio-alam/`**: **visualisasi keahlian disederhanakan menjadi Ilustrasi Pohon Dahan Alami** — mengganti visualisasi sebelumnya dengan ilustrasi pohon botani sederhana (*TreeIllustration*) di `Skills.jsx`: satu batang utama dengan akar alami di bawah dan 6 dahan horisontal bergantian yang mewakili masing-masing keahlian. Dilengkapi dedaunan kecil, tunas di ujung dahan, label persentase, dan interaksi sorot hangat (*terracotta*) dua arah tanpa ornamen geometris yang berlebihan.
- **`portfolio-alam/`**: **sulur linimasa statis murni tanpa overrun garis di bawah kartu** — batang linimasa (`Timeline.jsx`) diubah menjadi statis tanpa animasi scroll atau Framer Motion `pathLength`, mengalir lurus di tengah menghubungkan dari titik daun pertama (2022) hingga titik oranye *Next Opportunity*. Tinggi wadah garis dikunci secara presisi menggunakan layout DOM (`lastLi.offsetTop`), sehingga garis berhenti persis di tengah titik oranye dengan 0 piksel garis di bawah kartu.
- **`portfolio-alam/`**: **aset nyata pemilik proyek terpasang** — potret `public/images/about/profile.webp` (versi **cutout transparan** 279×377, WebP ±14 KB, dari foto pengguna) kini tampil di slot potret bagian About di atas alas sage berhalo daun (alt deskriptif, width/height diperbarui), dan lagu jazz `public/audio/nature-jazz.mp3` (±5 MB) tersambung ke pemutar musik (path tetap, tanpa perubahan logika pemutar; `preload="none"` + fade tetap). Catatan lisensi audio diperbarui di `public/audio/README.txt`.
- **`portfolio-alam/`**: **kolam koi interaktif** di antara hero dan About (`Pond.jsx` + modul `pondColor/pondSprites/pondMotion/pondPaint/pondScene`) — koi tampak-atas 4 varietas berenang dengan unulasi tubuh potongan sprite, teratai & kaustik, riak air bertingkat saat klik/tap, kursor "jari celup" mengikuti pointer; murni canvas 2D tanpa dependency baru, loop berhenti saat tab tersembunyi/keluar layar, `touch-action: pan-y` agar gulir mobile tak terganggu, dan kolam statis saat `prefers-reduced-motion`. Seluruh warna dibaca dari design tokens (`tokens.css`) saat runtime; bug halaman beku pada `resize()` (StrictMode double-bind) ditemukan lewat probe CDP dan diperbaiki.
- Perencanaan fitur MVP setelah menjalankan perintah `/init-app`.

### Changed
- **`portfolio-alam/`**: **potret About memakai foto resolusi penuh** (permintaan pengguna, menggantikan versi cutout) — `public/images/about/profile.webp` kini 520×650 (±18 KB, dari foto asli 652×869) dengan bingkai 4:5 sudah dipangkas di berkas (dinding di atas kepala dibuang, dada tetap sampai tepi bawah), `width/height` di `content.js` disesuaikan; alas sage + halo daun tetap sebagai bingkai dekoratif.
- **`portfolio-alam/`**: **pergantian tema terang/gelap beranimasi "merambat"** — `ThemeToggle.jsx` memakai View Transitions API: snapshot tema baru dibuka lewat `clip-path: polygon(...)` 30 titik bertepi sedikit bergelombang yang tumbuh dari tombol (900 ms, `data-theme-swap` mematikan transisi warna sesaat agar snapshot langsung berwarna akhir). Fallback: pergantian langsung bila API tidak ada atau `prefers-reduced-motion`. Sekalian memperbaiki pilihan tema awal saat sistem sudah gelap (atribut `data-theme` dibaca dari preferensi efektif).
- **`portfolio-alam/`**: **penyempurnaan UI atas masukan pengguna** — (1) wordmark navbar kini benar-benar sejajar vertikal dengan tautan (`inline-flex items-center` pada target 44 px; probe: `wordmarkMid 34 = linksMid 34`); (2) riak kolam dibuat lebih seperti air: satu cincin lembut per gangguan (bukan tiga cincin konsentris), tiap riak sedikit lonjong + bergelombang sendiri (`wob`, `sx`), jejak kursor berbasis jarak 104 px dengan amplitudo 50% dan peluruhan lebih cepat, serta titik kontak kursor berupa satu gelombang lonjong + tebaran samar (bukan dua cincin "bidikan"); (3) musik latar **default aktif** saat halaman dibuka, klik tombol = tutup/jeda, dengan fallback mulai pada interaksi pertama bila kebijakan autoplay browser memblokir, dan pilihan "tutup" diingat lewat `localStorage` (`alam-music-off`); toast ajakan musikk dihapus; (4) potret memakai versi cutout transparan di dalam blob sage dengan halo daun tipis yang bergoyang pelan (`halo-drift`, mati saat `prefers-reduced-motion`).
- **`portfolio-alam/`**: **bidang warna hero & Perjalanan** — hero dan navbar (saat di puncak halaman) kini berdiri di atas `--c-raised`, penudung (scrim) hero otomatis nonaktif selama foto hero masih placeholder (`img[data-placeholder] + .hero-scrim`), dan bagian Perjalanan mendapat bidang `--c-sunken`; tiga nilai tetap dari token, tanpa gradien baru. Efek samping: inspector `empty-screens` (2 dari 12 layar desktop <20% terisi) hilang tanpa mengubah isi.
- **`portfolio-alam/`**: **air kolam koi dibuat realistis** (sesuai referensi pengguna, tetap tema hutan) — modul baru `pondWater.js` membangun sekali: dasar air bergradasi kedalaman + zona cahaya + vignette tepi, tekstur caustic *tileable* (sinus bilangan bulat, no seam), dan berkas sinar tajuk; `pondPaint.js` menumpuk tiga lapisan caustic animasi (`screen`, skala/rotasi/kecepatan berbeda) di bawah & di atas ikan, riak klik/kursor diperkaya jadi 3 cincin (puncak terang + palung gelap = relief), dan simulasi menambah riak ambient samar tiap 2–4 detik. Skala ikan mengikuti tinggi kolam. Tinggi band kolam +50% (`clamp(420px,66vh,690px)`) dan scrollbar dokumen disembunyikan (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) tanpa mematikan gulir. Semua warna tetap dari token (`pondColor.js`, satu helper `rgbOf` baru); tanpa dependency baru; frame loop tetap hemat (tekstur dibuat sekali, hanya drawImage/fillRect/stroke per frame).
- **`portfolio-alam/`**: animasi scroll light mode dibuat terbaca — token alpha stroke per-tema (`--alpha-vine-main/echo`, `--alpha-trunk`, `--c-firefly/-halo` di `tokens.css`; nilai dark tidak berubah), sulur & batang memakai token tsb (`VineScroll.jsx`, `Timeline.jsx`), batang Perjalanan kini **tumbuh mengikuti scroll** (`useScroll` target-based + spring, pathLength; statis penuh saat `prefers-reduced-motion`), dan kunang-kunang berwarna oker di mode terang (`motion.css`). Diagnosis: animasi terbukti berjalan di kedua tema (probe CDP: opacity 0→1 halus, dasharray sulur berubah) — masalahnya keterlihatan garis di atas kertas sage, bukan bug fungsional.
- **`portfolio-alam/`**: seluruh persona situs diganti menjadi **Randy Frederick Leonardy** (web developer & model researcher, berfokus *problem solving*): `src/data/content.js` ditulis ulang, plus `index.html` (title, meta description, Open Graph, Twitter card) dan kalimat intro hard-coded di `Projects.jsx`, `Gallery.jsx`, `Skills.jsx`. Placeholder (`example.com`, `/cv/nama-cv.pdf`, dst.) dipertahankan dengan penanda TODO.
- **`portfolio-alam/`**: aplikasi portofolio bertema alam (React 18 + Vite + Tailwind + Framer Motion) — lengkap dengan design tokens, animasi scroll ringan, pemutar musik, toggle tema, form kontak aman, header keamanan, dan README deploy. Lihat ADR-004 di `docs/DECISIONS.md` untuk catatan palet.

---

## [0.2.0] - 2026-10-19
### Added
- **Arsitektur Template V2 (Hemat Token)**: Mengoptimasi ukuran file yang selalu dimuat (`AGENTS.md`, `CLAUDE.md`, `docs/RULES.md`, `docs/STRUCTURE.md`, `docs/TASKS.md`) dengan batas total <= 1.800 kata.
- **Skrip Verifikasi Mekanis**: Menambahkan `scripts/verify.sh` dan target `make verify` di `Makefile` untuk pemeriksaan otomatis tanpa beban token (deteksi `.env`, pola secret, gitleaks, folder generik, isolasi `scratch/`, batas 300 baris).
- **Protokol Kerja Bertingkat**: Menambahkan klasifikasi tugas (Ringan, Normal, Berat) di `AGENTS.md` untuk efisiensi eksekusi proporsional.
- **Pemisahan File Detail**:
  - `docs/RULES.md` (inti ≤ 60 baris) dan `docs/RULES_DETAIL.md` (detail gaya kode, type safety, test, contoh).
  - `docs/STRUCTURE.md` (inti ≤ 70 baris) dan `docs/STRUCTURE_DETAIL.md` (detail scratch, seeder, penamaan).
  - `docs/TASKS.md` (tugas aktif ≤ 60 baris) dan `docs/TASKS_ARCHIVE.md` (arsip selesai & backlog).
- **Hook Otomatis V2**: Menambahkan `.claude/hooks/verify-gate.sh` dan memperbarui `.claude/settings.json`.
- **Panduan Token Lanjutan**: Menambahkan `docs/OPTIMASI_OPSIONAL.md` untuk strategi efisiensi token tambahan.
- **Catatan Keputusan**: Menambahkan ADR-003 pada `docs/DECISIONS.md`.

---

## [0.1.0] - 2026-10-15
### Added
- **Fondasi Template Netral Stack**: Repositori awal tanpa framework, backend, atau frontend aplikasi.
- **Protokol Kerja Agent**: `AGENTS.md` dengan Protokol 3 Tahap (Pre-flight, Kerja, Verifikasi Dua Pass), Tabel Wajib Baca, dan 9 Aturan Emas.
- **Konfigurasi Agent & Hook**: `CLAUDE.md`, `.claude/settings.json`, dan hook penegak protokol `.claude/hooks/verify-twice.sh`.
- **Integrasi Taste-Skill**: Instalasi skill desain anti-slop `Leonxlnx/taste-skill` v2 di `.claude/skills/` dan `.agents/skills/`.
- **Dokumentasi Terstruktur (`docs/`)**:
  - `docs/PRD.md`: Template Product Requirements Document lengkap dengan kriteria penerimaan Given/When/Then.
  - `docs/DESIGN.md`: Pedoman desain visual, ringkasan taste-skill, dan aturan token desain tunggal.
  - `docs/STRUCTURE.md`: Kebijakan anti-repetisi (Single Source of Truth), isolasi folder `scratch/`, dan aturan seeder database.
  - `docs/ARCHITECTURE.md`: Template arsitektur sistem tingkat tinggi, alur data end-to-end, dan penanganan error.
  - `docs/TECH_STACK.md`: Matriks pemilihan stack teknologi, allowlist paket, dan aturan penambahan dependensi.
  - `docs/RULES.md`: Standar penulisan kode, batasan 40 baris/fungsi & 300 baris/file, aturan Git commit, dan checklist Definition of Done.
  - `docs/DATA_MODEL.md`: Skema model data, ERD, foreign keys, indeks, dan migrasi.
  - `docs/API_SPEC.md`: Kontrak tunggal API, format respons baku, dan spesifikasi endpoint.
  - `docs/TESTING.md`: Strategi piramida pengujian, target coverage, dan pengujian skenario kritis.
  - `docs/SECURITY.md`: Kebijakan proteksi dan Checklist Keamanan Pre-Launch 20 Poin dengan klasifikasi keparahan.
  - `docs/REVIEW_PANEL.md`: Regulasi panel evaluasi 6 persona reviewer independen dan syarat kelulusan.
  - `docs/TASKS.md`: Papan kerja pelacak tugas (In Progress, Next, Backlog, Done, Blocked).
  - `docs/DECISIONS.md`: Format Architecture Decision Record dengan ADR-001 (Template Netral Stack) dan ADR-002 (Taste-Skill).
- **6 Persona Reviewer Panel (`.claude/agents/`)**:
  - `01-client-strict.md`: Reviewer perfeksionis, teliti, berbasis bukti.
  - `02-client-awam.md`: Reviewer awam non-teknis, fokus kemudahan alur dan kejelasan teks.
  - `03-freelancer-saingan.md`: Reviewer kompetitor tajam dengan evaluasi celah teknis & "Pitch Rebutan".
  - `04-client-pelit.md`: Reviewer sensitif biaya dengan tabel estimasi operasional bulanan.
  - `05-client-profesional.md`: Reviewer korporat fokus kesiapan operasional, backup, monitoring, dan SLA.
  - `06-client-profesor.md`: Reviewer akademis kritis, penguji logika batas, dan konsistensi keputusan.
- **7 Perintah Otomasi (`.claude/commands/`)**:
  - `init-app.md`: Command inisialisasi aplikasi, pemilihan stack, dan pembuatan kerangka folder.
  - `review.md`: Audit kode terhadap RULES, STRUCTURE, keamanan, dan pengujian.
  - `fix-bug.md`: Protokol perbaikan bug minimal dengan regression test.
  - `new-feature.md`: Siklus penambahan fitur baru bertahap.
  - `update-docs.md`: Sinkronisasi dokumen dengan kode terkini.
  - `security-check.md`: Verifikasi bukti nyata 20 checklist keamanan pre-launch.
  - `review-panel.md`: Orkestrasi review multi-agent paralel dengan sintesis skor dan konsensus.
