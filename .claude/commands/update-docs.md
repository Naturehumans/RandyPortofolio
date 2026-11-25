# Command: /update-docs

> **Tujuan**: Memeriksa dan menyinkronkan seluruh file dokumentasi di direktori `docs/` dengan kondisi aktual kode sumber aplikasi terkini tanpa menduplikasi informasi.

---

## Prosedur Kerja

1. **Pemindaian Kode & Kontrak**:
   - Pindai direktori aplikasi (`backend/`, `frontend/`, file konfigurasi, migrasi, dan routing).
   - Identifikasi rute baru, skema model baru, dependensi baru, atau variabel lingkungan baru yang belum tercatat.
2. **Sinkronisasi Dokumen Teknis**:
   - **`docs/STRUCTURE.md`**: Pastikan seluruh direktori aktual tercatat dalam Tabel Peta Folder.
   - **`docs/TECH_STACK.md`**: Pastikan seluruh library baru yang terinstal sudah masuk dalam allowlist dependensi.
   - **`docs/DATA_MODEL.md`**: Sinkronkan tabel, relasi, dan kolom baru hasil migrasi ke diagram ERD dan daftar entitas.
   - **`docs/API_SPEC.md`**: Perbarui spesifikasi endpoint jika ada perubahan path, method, header, payload request, atau status code response.
   - **`docs/DESIGN.md`**: Pastikan token desain baru tercatat jika ada penambahan token warna/dimensi.
3. **Pemberlakuan Prinsip Anti-Repetisi (DRY Docs)**:
   - Pastikan informasi hanya diperbarui pada dokumen asalnya (Single Source of Truth). Dokumen pendukung lain hanya menautkan tautan URL/path.
4. **Verifikasi TASKS.md, TASKS_ARCHIVE.md & CHANGELOG.md**:
   - Pindahkan tugas-tugas yang telah selesai dari [docs/TASKS.md](file:///docs/TASKS.md) ke [docs/TASKS_ARCHIVE.md](file:///docs/TASKS_ARCHIVE.md) bagian Selesai.
   - Catat ringkasan sinkronisasi ini di bawah bagian `[Unreleased]` pada [docs/CHANGELOG.md](file:///docs/CHANGELOG.md).
5. **Pemeriksaan Batas Ukuran File Selalu-Dimuat**:
   - Periksa jumlah kata pada file selalu-dimuat (`AGENTS.md`, `CLAUDE.md`, `docs/RULES.md`, `docs/STRUCTURE.md`, `docs/TASKS.md`) menggunakan `wc -w`.
   - Pastikan total kata tetap **<= 1.800 kata** dan batas baris masing-masing file tetap dipatuhi.
6. **Laporan Hasil Sinkronisasi**:
   - Tampilkan tabel dokumen yang diperbarui beserta ringkasan perubahan spesifiknya dan hasil hitungan kata.
