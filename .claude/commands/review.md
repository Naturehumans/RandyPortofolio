# Command: /review

> **Tujuan**: Mengaudit kualitas kode yang baru ditulis atau dimodifikasi terhadap standar `docs/RULES.md`, kepatuhan arsitektur `docs/STRUCTURE.md`, integritas pengujian `docs/TESTING.md`, dan keamanan dasar `docs/SECURITY.md`.

---

## Prosedur Kerja

1. **Jalankan Pemeriksaan Mekanis (`make verify`)**:
   - Jalankan `make verify` (atau `bash scripts/verify.sh`).
   - Jika `make verify` gagal, hentikan review dan perbaiki kegagalan mekanis terlebih dahulu.
2. **Audit Kepatuhan Penilaian [P] di RULES.md**:
   - Periksa `git diff` hanya terhadap butir [P] yang tidak dicakup skrip:
     - Penempatan file resmi menurut `docs/STRUCTURE.md`.
     - Anti-duplikasi logika, validasi, rute, atau konstanta.
     - Handler tipis (Thin controller) dan isolasi logika bisnis.
     - Batas kontrak komunikasi API.
     - Kualitas UI terhadap `docs/DESIGN.md` dan `taste-skill`.
     - Validasi server dan proteksi autentikasi/otorisasi endpoint baru.
     - Pesan error aman generik bagi pengguna.
     - Kesesuaian perilaku terhadap kriteria penerimaan di `docs/PRD.md`.
     - Sinkronisasi dokumen `docs/TASKS.md` dan `docs/CHANGELOG.md`.
3. **Audit Struktur & Anti-Repetisi STRUCTURE.md**:
   - Pastikan setiap file berada di folder yang sah sesuai tabel peta folder.
   - Pastikan tidak ada kemunculan folder generik (`utils`, `helpers`, `common`).
   - Pastikan tidak ada impor dari direktori `scratch/`.
   - Cek apakah kode melanggar *Rule of Three* atau memicu duplikasi logika/validasi.
4. **Audit Integritas Desain & Keamanan**:
   - Jika menyentuh UI: pastikan tidak ada warna/ukuran font/spacing liar di luar design tokens (`docs/DESIGN.md`).
   - Cek apakah ada secret/kredensial yang tidak sengaja tertulis di diff.
   - Pastikan input baru divalidasi di server.
5. **Output Laporan Temuan**:
   - Sajikan laporan terstruktur dengan format:
     - **Ringkasan Status**: Lolos / Perlu Perbaikan
     - **Daftar Temuan**:
       - `[ID Temuan]` - Tingkat (BLOCKER/MAJOR/MINOR)
       - **Bukti Konkrit**: `path/to/file.ext:baris_angka`
       - **Pelanggaran**: [Aturan yang dilanggar]
       - **Rekomendasi Perbaikan**: [Langkah konkret penyelesaian]
