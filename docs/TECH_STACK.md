# Pilihan Tumpukan Teknologi (TECH_STACK.md)

Dokumen ini mendefinisikan teknologi yang disepakati untuk proyek ini, dependensi yang diizinkan, serta aturan penambahan dependensi baru.

---

## 1. Tabel Teknologi Utama
> *Diisi secara final saat menjalankan perintah `/init-app`.*

| Komponen / Lapisan | Teknologi Terpilih | Versi | Fungsi Utama | Alasan Pemilihan | Alternatif Ditolak & Alasan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend Language & Runtime** | `[ISI SAAT INIT-APP: Bahasa]` | `[Versi]` | `[Fungsi]` | `[Rasional performa/ekosistem]` | `[Alternatif: Alasan ditolak]` |
| **Backend Framework** | `[ISI SAAT INIT-APP: Framework]` | `[Versi]` | `[Fungsi]` | `[Rasional produktivitas/arsitektur]` | `[Alternatif: Alasan ditolak]` |
| **Frontend Framework / UI** | `[ISI SAAT INIT-APP: Library/Framework]` | `[Versi]` | `[Fungsi]` | `[Rasional reaktivitas/ekosistem]` | `[Alternatif: Alasan ditolak]` |
| **Styling & CSS** | `[ISI SAAT INIT-APP: CSS Solution]` | `[Versi]` | `[Fungsi]` | `[Rasional konsistensi tokens]` | `[Alternatif: Alasan ditolak]` |
| **Basis Data Primer** | `[ISI SAAT INIT-APP: Database]` | `[Versi]` | `[Fungsi]` | `[Rasional integritas data]` | `[Alternatif: Alasan ditolak]` |
| **ORM / Query Builder** | `[ISI SAAT INIT-APP: ORM]` | `[Versi]` | `[Fungsi]` | `[Rasional type-safety/kecepatan]` | `[Alternatif: Alasan ditolak]` |
| **Testing Framework** | `[ISI SAAT INIT-APP: Test Runner]` | `[Versi]` | `[Fungsi]` | `[Rasional coverage & kecepatan]` | `[Alternatif: Alasan ditolak]` |
| **Infrastruktur / Deployment** | `[ISI SAAT INIT-APP: Platform]` | `[Versi]` | `[Fungsi]` | `[Rasional kemudahan operasional]` | `[Alternatif: Alasan ditolak]` |

---

## 2. Daftar Dependensi yang Diizinkan (Allowlist)
*Daftar paket/library resmi yang disetujui untuk digunakan:*
- **Backend Core**: `[ISI SAAT INIT-APP: Daftar paket yang disetujui, mis. zod, jsonwebtoken, pg, dll.]`
- **Frontend Core**: `[ISI SAAT INIT-APP: Daftar paket yang disetujui, mis. lucide-react, clsx, dll.]`
- **Development & Tooling**: `[ISI SAAT INIT-APP: Linter, formatter, types, runner]`

---

## 3. Aturan Ketat Menambah Dependensi Baru

Agent atau developer **DILARANG KERAS** menginstal paket/library baru sebelum memenuhi protokol berikut:
1. **Pemeriksaan Fungsi Bawaan (Built-in First)**:
   - Evaluasi apakah fitur yang dibutuhkan sudah didukung oleh pustaka standar runtime/bahasa (mis. `fetch`, `crypto`, `Intl`, `URLSearchParams`).
2. **Kriteria Kelayakan Library**:
   - Lisensi wajib permisif (MIT, Apache 2.0, BSD). Dilarang lisensi GPL/AGPL jika proyek ditujukan untuk proprietary.
   - Proyek aktif dirawat (update terakhir < 6 bulan, riwayat commit aktif, isu keamanan cepat ditambal).
   - Ukuran bundle wajar (cek melalui Bundlephobia untuk dependensi frontend).
   - Zero critical CVE pada laporan audit keamanan (mis. `npm audit` / `composer audit`).
3. **Persetujuan Pengguna**:
   - Agent **WAJIB** meminta izin kepada pengguna sebelum menjalankan perintah `install`/`add`, dengan format:
     ```text
     Saya mengusulkan menambah dependency: [nama paket]@[versi]
     Fungsi: [apa yang diselesaikan]
     Ukuran dampak: [perkiraan ukuran bundle / footprint]
     Alasan tidak menulis fungsi sendiri: [efisiensi/kompleksitas/keamanan]
     Apakah Anda menyetujui instalasi ini? (Y/N)
     ```
4. **Pencatatan Resmi**:
   - Jika disetujui, tambahkan dependensi ke tabel allowlist di atas dan catat di [docs/DECISIONS.md](file:///docs/DECISIONS.md).
