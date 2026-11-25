# Arsip Tugas & Backlog Pengembangan (TASKS_ARCHIVE.md)

> **PERHATIAN**: File ini tidak dimuat otomatis. Hanya dibaca saat pengguna atau agent perlu mengambil tugas baru dari Backlog.

---

## 📋 Backlog (Daftar Tunggu Tugas MVP)
> *Daftar tugas rincian fitur MVP (15 - 30 tugas kecil berurutan) akan digenerate saat `/init-app` dari fitur Must PRD.*

`[ISI SAAT INIT-APP: 15-30 tugas MVP kecil dan berurutan, diturunkan dari fitur Must di PRD]`

### Fase Pengujian Keamanan & Review Akhir (Pre-Launch)
- [ ] **SEC-01** (M): **Audit Keamanan Pre-Launch**. Jalankan perintah `/security-check` terhadap kode aplikasi riil, perbaiki seluruh temuan KRITIS yang berstatus FAIL. File terkait: [docs/SECURITY.md](file:///docs/SECURITY.md). Kriteria selesai: Seluruh checklist kritis berstatus PASS.
- [ ] **SEC-02** (S): **Integrasi Security Scanner**. Pasang pre-commit hook gitleaks lokal dan konfigurasi automated dependency audit di pipeline CI. File terkait: `.github/workflows/` atau hook lokal. Kriteria selesai: Secret scanner memblokir commit yang memuat kredensial.
- [ ] **REV-01** (M): **Eksekusi Review Panel Putaran 1**. Jalankan `/review-panel` secara independen untuk 6 persona agent reviewer, kumpulkan laporan dan susun daftar temuan. File terkait: [docs/REVIEW_PANEL.md](file:///docs/REVIEW_PANEL.md). Kriteria selesai: Tabel skor review putaran 1 lengkap.
- [ ] **REV-02** (M): **Resolusi Temuan Panel**. Kerjakan perbaikan untuk seluruh temuan berstatus BLOCKER dan temuan yang disepakati oleh konsensus multi-agent. File terkait: Tergantung temuan. Kriteria selesai: Semua isu blocker terselesaikan.
- [ ] **REV-03** (S): **Verifikasi Ulang Review Panel**. Jalankan evaluasi ulang `/review-panel` (maksimal 3 putaran) hingga seluruh syarat kelulusan terpenuhi (rata-rata >= 7.0, zero blocker, min score >= 5). File terkait: [docs/REVIEW_PANEL.md](file:///docs/REVIEW_PANEL.md). Kriteria selesai: Status verdict LULUS.

---

## ✅ Selesai (Done Archive)
- [x] **PGN-01** (S): **Kolam Koi Interaktif**. Menambahkan section kolam ikan koi realistis di `portfolio-alam/src/components/` (`Pond.jsx` + modul `pondColor/pondSprites/pondMotion/pondPaint/pondScene` — semua ≤300 baris, tanpa dependency baru): koi tampak-atas beranimasi unulasi tubuh dari 4 varietas, teratai & kaustik cahaya, riak air bertingkat saat klik/tap, kursor "jari celup" yang mengikuti pointer dengan riak geseran; murni canvas 2D hemat CPU (loop berhenti saat tab tersembunyi/keluar layar, DPR dibatasi 1.5, 7 ikan desktop / 5 mobile, statis penuh saat `prefers-reduced-motion`). Palet 100% dari design tokens via runtime mix (`pondColor.js`). Verifikasi: build lulus, lint taste-skill 0 FAIL, inspector 0 FAIL (1 WARN `no-footage` di-defense di PORT-01), probe CDP membuktikan riak & jari (riak konsentris terukur 14.859 px terang; animasi 10.908 px berubah/450 ms). Bug StrictMode double-bind pada guard `resize()` ditemukan & diperbaiki. Atas permintaan pengguna langsung (di luar daftar TASKS, dikonfirmasi via pertanyaan). Pembaruan 2026-11-18: air dibuat lebih realistis (caustic *tileable*, berkas sinar, vignette kedalaman, riak ambient; modul `pondWater.js`), band kolam +50% tinggi (`clamp(420px,66vh,690px)`), dan scrollbar dokumen disembunyikan tanpa mematikan gulir.
- [x] **CFG-01** (S): **Konfigurasi Gitignore File Development**. Menambahkan pengecualian git untuk artefak Claude, konfigurasi AI agents, dokumentasi internal (`docs/`), konfigurasi IDE/editor, dan pengujian ke `.gitignore`. File terkait: [.gitignore](file:///c:/Users/randy/OneDrive/Desktop/Ready%20Development/.gitignore). Kriteria selesai: File development terabaikan oleh git.
- [x] **TMP-01** (S): **Inisialisasi Repositori Template**. Membangun seluruh arsitektur dokumentasi netral stack, protokol AGENTS.md, integrasi taste-skill, hook verifikasi, 6 persona agent, dan 7 command otomasi.
- [x] **PORT-01** (M): **Aplikasi Portofolio "Alam"**. Membangun aplikasi portofolio lengkap di `portfolio-alam/` (React 18 + Vite 7 + Tailwind + Framer Motion LazyMotion): 7 section, sulur scroll-interaktif, cincin pohon interaktif, pemutar jazz, toggle tema, form kontak aman (honeypot + throttle + sanitasi), header keamanan (CSP), aksesibilitas AA, dan code splitting per section. Verifikasi: `npm run build` lulus, `npm audit` 0 vulnerabilities, lint taste-skill 0 FAIL, inspector browser riil 0 FAIL (1 WARN `no-footage` dapat dipertanggungjawabkan), keputusan palet dicatat di [docs/DECISIONS.md](file:///docs/DECISIONS.md) ADR-004.
