# Regulasi Panel Review 6 Agent (REVIEW_PANEL.md)

Dokumen ini mendefinisikan protokol evaluasi independen multi-persona menggunakan 6 subagent reviewer untuk menjamin kualitas, keamanan, viabilitas bisnis, dan kesiapan rilis aplikasi.

---

## Bagian A: Kapan Panel Review Wajib Dijalankan
Panel review wajib dieksekusi melalui perintah `/review-panel` pada saat:
1. Pengerjaan seluruh fitur MVP di `docs/PRD.md` dan `docs/TASKS.md` selesai dibangun.
2. Sebelum rilis publik atau merge branch utama ke lingkungan production.
3. Setelah terjadi perubahan arsitektural atau refaktorisasi sistem berskala besar.
4. **Prasyarat Mutlak**: Panel review **HANYA BOLEH DIJALANKAN SETELAH** perintah `/security-check` dinyatakan **LULUS** (seluruh poin KRITIS berstatus `PASS`).

---

## Bagian B: Prinsip Independensi Reviewer
1. **Isolasi Penuh**:
   - Setiap agent reviewer dijalankan dalam konteks/subagent terpisah secara independen.
   - Reviewer **DILARANG KERAS** melihat, membaca, atau mendiskusikan laporan dari agent reviewer lainnya.
2. **Berbasis Artefak Nyata (Evidence-Based)**:
   - Penilaian wajib didasarkan pada artefak nyata: membaca kode sumber aktual, mengecek dokumen `docs/`, menjalankan test runner, dan menguji antarmuka langsung.
   - Dilarang memberikan skor atau temuan berdasarkan spekulasi atau asumsi tanpa bukti konkrit.

---

## Bagian C: Format Laporan Standar Reviewer

Seluruh reviewer wajib menggunakan template laporan seragam berikut:

```markdown
### Laporan Review: [Nama Persona Agent]

- **Skor**: [Skala 1 - 10]
- **Alasan Skor (Satu Kalimat)**: [Rasional ringkas dan lugas atas skor yang diberikan]

#### 1. Temuan Masalah (Findings)
- **ID Temuan**: [REV-AGENT-01]
  - **Tingkat Keparahan**: BLOCKER / MAJOR / MINOR
  - **Bukti Konkrit**: [Path:baris kode, tangkapan layar, atau langkah reproduksi persis]
  - **Dampak**: [Dampak nyata terhadap pengguna, bisnis, atau sistem]
  - **Saran Perbaikan**: [Langkah teknis terarah untuk menyelesaikan masalah]

#### 2. Hal yang Sudah Bagus (Minimal 2 Poin)
1. [Kelebihan nyata yang ditemukan dalam kode/arsitektur/UX]
2. [Kelebihan nyata yang ditemukan dalam kode/arsitektur/UX]

#### 3. Verdict
- **Status**: LOLOS / LOLOS BERSYARAT / DITOLAK
  *(LOLOS: Siap rilis tanpa catatan; LOLOS BERSYARAT: Catatan minor yang dapat diselesaikan pasca-rilis; DITOLAK: Terdapat blocker yang wajib diperbaiki).*

#### 4. Pertanyaan untuk Developer
- [Pertanyaan mendasar mengenai pertimbangan desain, trade-off, atau keputusan teknis]
```

---

## Bagian D: Syarat Kelulusan Panel (Pass Criteria)

Aplikasi dinyatakan **LULUS REVIEW PANEL** dan siap rilis jika memenuhi **SELURUH** kriteria berikut:
1. **Nol BLOCKER**: Tidak ada temuan berstatus `BLOCKER` yang masih terbuka.
2. **Rata-rata Skor Minimal 7.0**: Nilai rata-rata dari ke-6 persona reviewer wajib `>= 7.0`.
3. **Tanpa Skor Ekstrem Buruk**: Tidak boleh ada satu pun reviewer yang memberikan skor `< 5`.
4. **Batas Maksimal 3 Putaran**:
   - Jika setelah 3 putaran evaluasi panel belum mencapai syarat kelulusan, proses otomatis dihentikan dan dilakukan **eskalasi ke manusia (pemilik proyek)** dengan menyertakan ringkasan konflik antar-reviewer.
5. **Larangan Manipulasi**: Dilarang menurunkan standar kualifikasi atau mengubah syarat kelulusan hanya agar aplikasi terlihat lulus.

---

## Bagian E: Riwayat Evaluasi Panel (Review History)

| Tanggal | Versi / Commit | Strict | Awam | Saingan | Pelit | Profesional | Profesor | Skor Rata-rata | Status Verdict | Temuan Terbuka |
| :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :--- |
| *[Tgl]* | *v0.1.0-init* | - | - | - | - | - | - | - | *Template Awal* | *Menunggu /init-app* |
