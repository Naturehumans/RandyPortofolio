# Catatan Keputusan Arsitektur (DECISIONS.md)

Dokumen ini mendokumentasikan keputusan arsitektural penting (*Architecture Decision Records - ADR*) yang diambil dalam proyek ini, lengkap dengan konteks masalah, rasional, dan konsekuensi dampaknya.

---

## Indeks Keputusan (ADR Index)
- [ADR-001: Template Fondasi Bersifat Netral Stack](#adr-001-template-fondasi-bersifat-netral-stack)
- [ADR-002: Standardisasi Visual & Anti-Slop dengan Taste-Skill](#adr-002-standardisasi-visual--anti-slop-dengan-taste-skill)
- [ADR-003: Pemeriksaan Mekanis via Verify Script & Protokol Bertingkat](#adr-003-pemeriksaan-mekanis-via-verify-script--protokol-bertingkat)

---

## ADR-001: Template Fondasi Bersifat Netral Stack

- **Tanggal**: 2026-10-15
- **Status**: DITERIMA (ACCEPTED)

### Konteks
Pengembangan aplikasi modern dengan AI agent sering kali mengalami degradasi kualitas atau kehilangan konteks jika proyek langsung dimulai dengan menginstal boilerplate framework yang kompleks. Hal ini menyebabkan agent membuat asumsi liar mengenai arsitektur, mencampuradukkan logika, dan menempatkan kode di sembarang tempat. Diperlukan suatu template awal yang baku, terstruktur, dan memiliki pagar pengaman (*guardrails*) ketat sebelum kode aplikasi ditulis.

### Keputusan
Kami memutuskan untuk membuat template repositori ini sepenuhnya **netral terhadap teknologi/stack**. Repositori awal HANYA berisi dokumen panduan, aturan rekayasa, kebijakan keamanan, panel reviewer multi-persona, dan perintah otomasi. Seluruh folder aplikasi (seperti `backend/`, `frontend/`), dependensi paket, dan kode fungsional dilarang dibuat hingga pengguna menjalankan perintah inisialisasi `/init-app`.

### Alasan
1. Mencegah agent berhalusinasi atau memilih library secara sembarangan sebelum kebutuhan PRD terdefinisi.
2. Memungkinkan template ini digunakan ulang untuk segala jenis proyek (Next.js, Laravel, Go, Python/FastAPI, Flutter, dsb.) dengan alur kerja yang konsisten.
3. Menjamin dokumen `PRD.md` dan kriteria penerimaan telah matang sebelum penulisan baris kode pertama dimulai.

### Konsekuensi
- **Positif**: Arsitektur proyek menjadi sangat teratur, tidak ada file sampah boilerplate, dan tim memiliki pagar pembatas yang jelas sejak awal.
- **Negatif / Tantangan**: Membutuhkan satu langkah inisialisasi tambahan (`/init-app`) sebelum aplikasi dapat dijalankan pertama kali.

---

## ADR-002: Standardisasi Visual & Anti-Slop dengan Taste-Skill

- **Tanggal**: 2026-10-15
- **Status**: DITERIMA (ACCEPTED)

### Konteks
Aplikasi atau antarmuka yang dibangun oleh model AI generatif sering kali menghasilkan tampilan antarmuka yang seragam, membosankan, dan berkualitas generik (*AI slop*): tipografi monospace/inter tipis, layout hero terpusat tiga baris yang klise, ornamen garis dan card berlebihan tanpa konsep visual yang kuat dari produk itu sendiri.

### Keputusan
Kami mengintegrasikan skill desain pihak ketiga `Leonxlnx/taste-skill` (versi `design-taste-frontend` v2) ke dalam direktori skill repositori (`.claude/skills/` dan `.agents/skills/`). Penggunaan skill ini diwajibkan untuk setiap pembuatan halaman baru, komponen antarmuka, dan penataan ulang visual, dipandu oleh file token desain tunggal yang didefinisikan dalam `docs/DESIGN.md`.

### Alasan
1. `taste-skill` menyediakan kurasi arah desain (direction), tipografi teruji, dan palet warna substantif yang diambil dari studi empiris 247 situs terbaik dunia.
2. Menyediakan script verifikasi visual di browser nyata (`scripts/inspect.mjs`) untuk mengevaluasi kontras, ukuran teks, dan proporsi antarmuka secara objektif.
3. Menjamin hierarki kontrol: jika terdapat perbedaan pandangan antara saran skill dan preferensi pengguna, keputusan pengguna selalu menang dan dicatat di dokumen ini.

### Konsekuensi
- **Positif**: Tampilan UI aplikasi memiliki nilai estetika tinggi, unik, profesional, dan bebas dari kesan generik template AI.
- **Negatif / Tantangan**: Memerlukan ketergantungan pada runtime Node.js dan browser engine lokal untuk menjalankan script inspeksi visual secara penuh.

---

## ADR-003: Pemeriksaan Mekanis via Verify Script & Protokol Bertingkat

- **Tanggal**: 2026-10-19
- **Status**: DITERIMA (ACCEPTED)

### Konteks
Pemeriksaan kualitas pada versi sebelumnya terlalu banyak membebani konteks LLM pada setiap prompt (evaluasi puluhan checklist secara manual). Selain memboroskan token, pemeriksaan manual rawan mengalami hallucination atau terlewat. Di samping itu, tugas-tugas kecil berisiko rendah (seperti typo atau teks) memakan waktu dan overhead yang sama besarnya dengan tugas berisiko tinggi.

### Keputusan
1. Memindahkan seluruh pemeriksaan mekanis (kebocoran `.env`, pola secret, gitleaks, folder generik terlarang, isolasi `scratch/`, import ilegal, dan batas 300 baris kode) ke dalam skrip deterministik `scripts/verify.sh` yang dipanggil melalui `make verify`.
2. Membagi tugas menjadi 3 tingkat risiko di `AGENTS.md`: **Ringan** (alur ringkas 2 baris), **Normal** (protokol penuh), dan **Berat** (protokol penuh + review security + rencana disetujui pengguna).
3. Memangkas file yang selalu dimuat (`AGENTS.md`, `CLAUDE.md`, `docs/RULES.md`, `docs/STRUCTURE.md`, `docs/TASKS.md`) dengan batas total <= 1.800 kata dan memindahkan detail referensi ke file pendamping (`*_DETAIL.md`, `TASKS_ARCHIVE.md`).

### Alasan
1. Skrip shell memberikan hasil pemeriksaan deterministik, cepat, dan 100% objektif tanpa memakan token penalaran model.
2. Mengurangi ukuran konteks sistem secara signifikan sehingga meningkatkan kecepatan respons dan kehandalan instruksi model.
3. Memberikan proporsionalitas kerja: perubahan kecil tidak terhambat birokrasi berlebih, sementara perubahan berisiko tinggi tetap terjaga dengan verifikasi mendalam.

### Konsekuensi
- **Positif**: Hemat token drastis, verifikasi objektif dan deterministik, proses kerja jauh lebih cepat.
- **Negatif / Tantangan**: Membutuhkan lingkungan bash (Git Bash di Windows / Linux / macOS) untuk mengeksekusi `scripts/verify.sh`.

---

## ADR-004: Palet Terracotta/Oker Dipertahankan untuk `portfolio-alam` (Override House-Style Taste-Skill)

**Status**: Diterima (keputusan pengguna eksplisit)

### Konteks
Saat membangun aplikasi portofolio `portfolio-alam/` (React + Vite, tema "hutan hujan tropis saat fajar"), inspektor `design-taste-frontend` menandai FAIL `palette-terracotta` karena house style-nya melarang kombinasi "krem-kuning + terracotta" (dikenali sebagai palet asisten AI yang klise).

### Keputusan
Palet terracotta (`#a84a2b`/`#c96f4c`) dan oker (`#7a5a14`/`#ddba62`) tetap dipakai sesuai brief eksplisit pengguna. Ground digeser dari krem-kuning ke **kertas sage** (`#eef0e2`) untuk meredam klise tersebut, dan inspektor dijalankan dengan `--allow palette-terracotta`.

### Alasan
1. Brief pengguna menetapkan secara eksplisit: "hijau lumut, hijau hutan gelap, krem kertas, terracotta/oker sebagai aksen".
2. `docs/DESIGN.md` §1 menegaskan: keputusan/ preferensi eksplisit pengguna mutlak menang atas rekomendasi skill, dengan kewajiban pencatatan di dokumen ini.

### Konsekuensi
- **Positif**: Arah desain sesuai keinginan pengguna; palet tetap lolos kontras WCAG AA (terracotta teks 4.9:1, oker 5.5:1 di atas kertas sage).
- **Negatif / Tantangan**: Kombinasi ini dikenali inspector sebagai pola berisiko klise; kompensasi dilakukan lewat komposisi editorial-organik (tipografi Fraunces, bentuk daun, grain) dan pengecualian dicatat di sini.
