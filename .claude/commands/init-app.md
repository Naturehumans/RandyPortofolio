# Command: /init-app

> **Tujuan**: Memulai proyek aplikasi nyata dari template fondasi. Ini adalah **satu-satunya perintah** yang memiliki wewenang untuk membuat direktori aplikasi (mis. `backend/`, `frontend/`), mengonfigurasi stack teknologi, dan menulis kode kerangka awal.

---

## Alur Prosedur Kerja

### Langkah 1: Validasi Kesiapan PRD
1. Buka dan baca file [docs/PRD.md](file:///docs/PRD.md).
2. Periksa apakah dokumen PRD masih kosong, masih berupa template awal, atau belum memiliki kriteria penerimaan (*Given/When/Then*) untuk fitur-fitur berstatus *Must*.
3. **PENGHENTIAN WAJIB**: Jika PRD belum siap, **HENTIKAN PROSES**. Informasikan kepada pengguna bahwa inisialisasi aplikasi hanya dapat dilakukan setelah PRD terisi. Tawarkan bantuan untuk mewawancarai pengguna guna melengkapi PRD secara interaktif.

---

### Langkah 2: Klarifikasi Kebutuhan & Rekomendasi Stack (Maksimal 5 Pertanyaan)
Jika PRD sudah lengkap dan disetujui, ajukan maksimal 5 pertanyaan singkat secara bersamaan (pengguna boleh menjawab "rekomendasikan" jika ragu):
1. **Jenis Aplikasi**: (e.g. Web SPA, Fullstack SSR, Mobile API, CLI, Microservice)?
2. **Preferensi Stack**: Stack yang diinginkan? *(Jika meminta rekomendasi: berikan rekomendasi stack terbaik beserta kelebihan, alasan pemilihan, dan alternatif yang dipertimbangkan).*
3. **Pemisahan Arsitektur**: Apakah backend dan frontend dipisah (`backend/` + `frontend/`) atau menyatu (*monolith*)?
4. **Target Hosting & Infrastruktur**: Di mana aplikasi akan di-deploy (e.g. VPS, Vercel, Fly.io, Cloudflare, Docker)?
5. **Gaya Desain & Referensi UI**: Mood visual atau referensi desain yang diinginkan (akan diintegrasikan dengan `taste-skill` dan `docs/DESIGN.md`)?

---

### Langkah 3: Pengajuan Rencana Struktur & Menunggu Persetujuan
Tampilkan rencana rinci kepada pengguna mencakup:
- Matriks teknologi lengkap (Bahasa, Framework, DB, Testing tool, Linter)
- Rencana pohon direktori aplikasi (menganut prinsip satu folder satu fungsi, tanpa folder generik)
> **TITIK TUNGGU MUTLAK**: **TUNGGU persetujuan eksplisit dari pengguna sebelum membuat folder atau menulis file apa pun.**

---

### Langkah 4: Pembuatan Direktori Aplikasi Sesuai Prinsip STRUCTURE.md
Setelah disetujui pengguna, buat folder aplikasi resmi.
*Contoh preset jika memilih arsitektur terpisah (sesuaikan dengan stack nyata):*
- `backend/`:
  - `app/Http/{Controllers/Api/V1, Requests, Resources, Middleware}`
  - `app/{Actions, Models, Policies, Enums, Exceptions}`
  - `database/{migrations, factories, seeders/{Production, Development}}`
  - `routes/api/v1/` (satu file rute per domain)
  - `tests/{Unit, Feature}`
- `frontend/`:
  - `src/{pages, routes, layouts, components/{ui, features}, api, hooks, stores, lib, types, styles/tokens.css}`
  - `tests/`
- *Pendukung*: `scripts/`, `docker-compose.yml`, `Makefile` (bila relevan).

---

### Langkah 5: Pengisian Seluruh Placeholder Dokumentasi
Lengkapi dan gantikan seluruh token `[ISI SAAT INIT-APP: ...]` di file dokumentasi berikut tanpa menduplikasi informasi:
1. `AGENTS.md`: Update bagian Gambaran Proyek dan Perintah Pasti (`install`, `dev`, `build`, `test`, `lint`, `format`, `security`).
2. `docs/STRUCTURE.md`: Lengkapi Tabel Peta Folder, Tabel Penempatan Satu Fungsi Satu Tempat, dan Konvensi Penamaan.
3. `docs/TECH_STACK.md`: Isi tabel teknologi, versi, alasan, alternatif ditolak, dan allowlist dependensi.
4. `docs/ARCHITECTURE.md`: Perbarui diagram sistem Mermaid, alur data, dan lapisan sistem.
5. `docs/DATA_MODEL.md`: Tulis entitas skema database, tipe field, relasi, dan ERD Mermaid.
6. `docs/API_SPEC.md`: Lengkapi spesifikasi endpoint domain bisnis sesuai PRD.
7. `docs/TESTING.md`: Konfigurasikan testing runner dan perintah pengujian spesifik stack.
8. `docs/DESIGN.md`: Tentukan lokasi file token CSS tunggal dan nilai parameter visual.
9. `docs/SECURITY.md` & `docs/RULES.md`: Konfirmasikan detail implementasi dan penamaan spesifik stack.
> *Catatan*: Perintah, nomor versi, atau nama paket yang belum 100% dipastikan wajib ditandai "PERLU DIVERIFIKASI" dan diverifikasi ke dokumentasi resmi.

---

### Langkah 6: Konfigurasi STACK-CHECKS & Makefile
1. Isi blok `STACK-CHECKS` di `scripts/verify.sh` dengan pemeriksaan spesifik stack: lint, test, build; route ganda (satu route = satu definisi); warna/ukuran di luar file design tokens; mode debug aktif pada konfigurasi production; validasi/otorisasi yang bisa dicek statis; batas fungsi 40 baris lewat konfigurasi lint.
2. Tambahkan target Makefile (`dev`, `test`, `lint`, `build`) tanpa menduplikasi isi skrip.
3. Uji setiap pemeriksaan baru dengan pelanggaran sengaja di salinan sementara di luar repo, lalu laporkan hasilnya.

---

### Langkah 7: Pembaruan Status Proyek & Papan Kerja
1. Ubah status proyek di [AGENTS.md](file:///AGENTS.md) dari `Mode: TEMPLATE` menjadi `Mode: APLIKASI`.
2. Turunkan 15 - 30 tugas kecil terurut untuk fase MVP dari fitur-fitur *Must* di PRD ke dalam [docs/TASKS_ARCHIVE.md](file:///docs/TASKS_ARCHIVE.md) bagian **Backlog**, lalu pindahkan 10 tugas pertama ke [docs/TASKS.md](file:///docs/TASKS.md) bagian **Berikutnya**.
3. Catat keputusan pemilihan stack dan arsitektur sebagai ADR baru di [docs/DECISIONS.md](file:///docs/DECISIONS.md).

---

### Langkah 8: Pembuatan Kerangka Minimal yang Berjalan (Executable Skeleton)
1. Buat kode kerangka minimal (*hello world* atau satu halaman contoh terintegrasi).
2. Jalankan perintah instalasi, pastikan `dev server`, `test runner`, `linter`, dan `make verify` berhasil berjalan dengan output hijau (sukses).
3. **Dilarang membangun fitur aplikasi di luar kerangka minimum ini** pada tahap inisialisasi.
