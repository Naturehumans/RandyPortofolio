# Command: /review-panel

> **Tujuan**: Mengorkestrasi evaluasi multi-persona panel review 6 agent secara independen untuk mengaudit kesiapan rilis aplikasi, menyintesis temuan konsensus, dan memvalidasi syarat kelulusan rilis.

---

## Alur Prosedur Kerja

### Langkah 1: Pemeriksaan Prasyarat (Pre-requisites)
1. Pastikan aplikasi dapat dijalankan (development server / container aktif).
2. Pastikan `make verify` (atau `bash scripts/verify.sh`) menghasilkan **VERIFY OK**.
3. Pastikan perintah `/security-check` sudah dijalankan sebelumnya.
4. **PENGHENTIAN WAJIB**: Jika `make verify` gagal atau pada `docs/SECURITY.md` masih terdapat temuan **KRITIS yang berstatus FAIL**, hentikan review panel seketika. Selesaikan perbaikan terlebih dahulu.

---

### Langkah 2: Pemanggilan 6 Persona Reviewer Secara Terpisah
Jalankan ke-6 agent di `.claude/agents/` dalam subagent terpisah (secara paralel jika didukung platform):
1. `01-client-strict.md`
2. `02-client-awam.md`
3. `03-freelancer-saingan.md`
4. `04-client-pelit.md`
5. `05-client-profesional.md`
6. `06-client-profesor.md`

> **ATURAN MUTLAK INDEPENDENSI**:
> Setiap agent hanya diberi akses membaca kode repositori dan dokumen `docs/`. 
> **DILARANG KERAS** memperlihatkan atau membocorkan isi laporan dari satu reviewer ke reviewer lainnya.

---

### Langkah 3: Sintesis Hasil Evaluasi Panel
Kumpulkan ke-6 laporan independen dan susun sintesis menyeluruh yang memuat:

#### (a) Tabel Skor & Verdict
| Persona Reviewer | Skor (1-10) | Verdict | BLOCKER | MAJOR | MINOR | Alasan Utama (Satu Kalimat) |
| :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 01. Client Strict | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| 02. Client Awam | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| 03. Freelancer Saingan | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| 04. Client Pelit | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| 05. Client Profesional | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| 06. Client Profesor | ... | LOLOS/BERSYARAT/TOLAK | ... | ... | ... | ... |
| **RATA-RATA PANEL** | **... / 10** | **[STATUS AKHIR]** | **Σ ...** | **Σ ...** | **Σ ...** | - |

#### (b) Temuan Konsensus (Prioritas Tertinggi)
Daftar isu atau kritik yang disuarakan oleh **>= 2 agent** secara independen. Isu ini merupakan kelemahan paling nyata dan wajib diprioritaskan.

#### (c) Analisis Konflik & Trade-off Antar-Reviewer
Analisis jika terjadi pertentangan sudut pandang (mis. *Client Pelit* meminta memotong server backup untuk menghemat biaya vs *Client Profesional* yang mewajibkan backup multi-region). Sajikan rekomendasi trade-off seimbang bagi pemilik proyek.

#### (d) Rencana Perbaikan Terurut (Action Plan)
Urutan penyelesaian masalah yang terstruktur:
1. Seluruh temuan berstatus **BLOCKER** (wajib 0 sebelum rilis).
2. Seluruh temuan **Konsensus Multi-Agent**.
3. Temuan berstatus **MAJOR**.
4. Temuan penyempurnaan **MINOR**.

#### (e) Pitch Rebutan Freelancer & Jawaban Tangkis Developer
Sajikan 3 argumen perebutan proyek dari *Freelancer Saingan* beserta jawaban pembelaan berbasis bukti yang disiapkan oleh developer.

---

### Langkah 4: Evaluasi Syarat Kelulusan (Pass Criteria)
Evaluasi apakah hasil review memenuhi syarat kelulusan di [docs/REVIEW_PANEL.md](file:///docs/REVIEW_PANEL.md) Bagian D:
- [ ] Tidak ada temuan BLOCKER terbuka (0 Blocker).
- [ ] Rata-rata skor keseluruhan >= 7.0.
- [ ] Tidak ada skor reviewer individual < 5.
- [ ] Belum melampaui batas maksimal 3 putaran review.

> **LARANGAN KERAS**: Dilarang menurunkan standar kualifikasi atau memodifikasi skor agar proyek terlihat lulus secara artifisial.

---

### Langkah 5: Tindak Lanjut & Siklus Perbaikan
1. **Dilarang Memperbaiki Otomatis**: Tampilkan sintesis lengkap kepada pengguna. Tanyakan kepada pengguna bagian mana yang akan disetujui untuk diperbaiki.
2. Catat hasil putaran ini ke dalam tabel Riwayat Evaluasi di [docs/REVIEW_PANEL.md](file:///docs/REVIEW_PANEL.md).
3. Setelah developer menyelesaikan perbaikan, jalankan kembali `/review-panel` (maksimal 3 putaran per rilis). Jika setelah 3 putaran belum lolos, lakukan eskalasi ringkasan konflik kepada pengguna.
