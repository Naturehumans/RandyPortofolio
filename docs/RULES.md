# Aturan Rekayasa & Definition of Done (RULES.md)

Dokumen ini mendefinisikan larangan keras mutlak dan checklist evaluasi Definition of Done (DoD).

## 1. Larangan Keras (Non-Negotiable)
1. Dilarang hardcode secret, API key, password, token, atau credential di kode sumber maupun diff.
2. Dilarang mengubah skema database atau migrasi tanpa persetujuan eksplisit pengguna.
3. Dilarang menghapus atau menimpa file di luar cakupan tugas aktif saat ini.
4. Dilarang menambah dependency atau package baru tanpa konfirmasi pengguna.
5. Dilarang melakukan refactor di luar cakupan tugas yang sedang dikerjakan.
6. Dilarang menulis fungsi > 40 baris kode atau file modul > 300 baris kode.
7. Dilarang membuat commit tanpa format Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, dsb.).

## 2. Definition of Done (Checklist Evaluasi PASS 1 & PASS 2)
Tanda **[M]** = Diperiksa mekanis oleh `make verify` (jangan diperiksa ulang manual).
Tanda **[P]** = Penilaian kualitatif yang wajib dievaluasi pada **PASS 2**.

- [ ] **[M] Test, lint, build lulus**: Perintah test, lint, dan build dieksekusi tanpa error.
- [ ] **[M] Tidak ada secret/kredensial**: Bebas dari pola key/token/password di kode maupun git diff.
- [ ] **[M] Batas struktural**: Tanpa folder generik, tanpa import scratch, ukuran file kode <= 300 baris.
- [ ] **[M] Kepatuhan token desain**: Tidak ada warna/dimensi di luar design tokens (aktif setelah init-app).
- [ ] **[P] Penempatan file benar**: File baru diletakkan di folder resmi sesuai [docs/STRUCTURE.md](file:///docs/STRUCTURE.md).
- [ ] **[P] Tanpa duplikasi**: Tidak ada duplikasi logika bisnis, skema validasi, rute, atau konstanta.
- [ ] **[P] Handler tipis**: Controller/handler tipis; logika bisnis terisolasi di lapisan khusus.
- [ ] **[P] Batas kontrak**: Komunikasi antar-komponen hanya melalui antarmuka/kontrak API yang sah.
- [ ] **[P] Kualitas UI**: Antarmuka mematuhi [docs/DESIGN.md](file:///docs/DESIGN.md) dan standar `taste-skill`.
- [ ] **[P] Validasi & proteksi**: Input baru divalidasi di server; endpoint baru memiliki autentikasi & otorisasi.
- [ ] **[P] Pesan error aman**: Pesan error ke pengguna generik; detail teknis hanya dicatat di log server.
- [ ] **[P] Kesesuaian PRD**: Perilaku fitur terbukti memenuhi kriteria penerimaan di [docs/PRD.md](file:///docs/PRD.md).
- [ ] **[P] Sinkronisasi dokumen**: `docs/TASKS.md` dan `docs/CHANGELOG.md` diperbarui mencerminkan perubahan.
- [ ] **(Menjelang Rilis) Security check lolos**: `/security-check` lulus (seluruh poin kritis PASS).
- [ ] **(Menjelang Rilis) Review panel lolos**: `/review-panel` mencapai rata-rata >= 7.0, zero BLOCKER, min score >= 5; temuan konsensus diperbaiki atau dicatat di `docs/DECISIONS.md`.

*Catatan detail gaya kode, type safety, error handling, dan contoh benar/salah*: Lihat [docs/RULES_DETAIL.md](file:///docs/RULES_DETAIL.md).
