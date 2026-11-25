# AGENTS.md — Protokol Kerja AI Agent

Mode: TEMPLATE
> Pada mode TEMPLATE, agent dilarang menulis kode aplikasi dan menyarankan /init-app.

## 1. Gambaran Proyek & Perintah
- **Domain & Arsitektur**: [ISI SAAT INIT-APP: ringkasan proyek setelah stack dipilih]
- **Perintah Pasti**: `[ISI SAAT INIT-APP: install, dev, build, test, lint, format, make verify]`

## 2. Struktur Folder
Lihat panduan penempatan dan arsitektur folder lengkap di [docs/STRUCTURE.md](file:///docs/STRUCTURE.md).

## 3. Tabel Wajib Baca
| File | Kapan Wajib Dibaca |
| :--- | :--- |
| `docs/RULES.md`, `docs/STRUCTURE.md`, `docs/TASKS.md` | **SELALU**, setiap prompt |
| `docs/RULES_DETAIL.md` | Saat menulis kode baru, commit, atau test (baca bagian relevan) |
| `docs/STRUCTURE_DETAIL.md` | Saat menyentuh `scratch/`, seeder, atau penamaan |
| `docs/DESIGN.md` + taste-skill | Jika menyentuh UI / styling |
| `docs/SECURITY.md` (bagian terkait) | Tingkat Berat, atau saat akan rilis |
| `docs/API_SPEC.md`, `docs/DATA_MODEL.md` | Jika menyentuh endpoint atau skema |
| `docs/DECISIONS.md` | Sebelum mengubah arsitektur atau stack |
| `docs/REVIEW_PANEL.md` | Saat `/review-panel` |
| `docs/TASKS_ARCHIVE.md` | Hanya saat butuh mengambil dari Backlog |

*Aturan baca*: Gunakan grep lalu baca rentang baris yang relevan, bukan seluruh file besar. Rujuk dokumen per bagian.

## 4. Tingkat Tugas (Agent Menyatakan Tingkat di PRE-FLIGHT)
| Tingkat | Cakupan | Protokol |
| :--- | :--- | :--- |
| **Ringan** | Typo, teks, styling kecil, tanpa logika/data/auth | PRE-FLIGHT 2 baris → kerjakan → `make verify` → laporan 1 baris |
| **Normal** | Fitur kecil, bug, refactor terbatas | Protokol penuh (di bawah) |
| **Berat** | Auth, session, validasi input, upload, skema DB, pembayaran, env/secret, permission, dependency | Protokol penuh + baca bagian SECURITY terkait + rencana DISETUJUI user sebelum kode ditulis + Pass 2 penuh |

*Aturan*: Ragu antara dua tingkat → ambil yang lebih tinggi. Hal yang menyentuh daftar "Berat" tidak boleh diturunkan tingkatnya.

## 5. Protokol Penuh (Normal dan Berat)
### Tahap 1: PRE-FLIGHT (maksimal 4 baris)
```text
PRE-FLIGHT [Normal|Berat]
1. Dibaca: [daftar file]
2. Aturan relevan (DIKUTIP dari RULES.md): "…", "…", "…"
3. Rencana, file yang disentuh, lokasi menurut STRUCTURE.md
4. Hasil grep duplikat: [ada/tidak, di mana]
```
*Dilarang mengisi dari ingatan; jika belum dibaca, baca dulu.*

### Tahap 2: Kerja
Satu tugas kecil sesuai rencana.

### Tahap 3: Verifikasi Dua Pass
- **PASS 1 (mekanis)**: Jalankan `make verify` dan tampilkan output ringkasnya. Hasil skrip dipercaya; jangan memeriksa ulang manual butir yang sudah dicakup skrip.
- **PASS 2 (penilaian)**: Periksa `git diff` hanya terhadap butir Definition of Done non-mekanis (kesesuaian PRD/kriteria penerimaan, kualitas UI vs DESIGN.md, kebenaran logika, otorisasi & validasi, pesan error). Tingkat Berat: baca ulang bagian SECURITY terkait.

**Format Laporan**:
```text
Pass 1: OK/GAGAL.
Pass 2: [n] butir PASS. FAIL: [ID, bukti path:baris] atau tidak ada.
Diperbaiki: [daftar/tidak ada].
```
*Butir PASS tidak diuraikan. Jika ada FAIL, perbaiki lalu ulangi pass terkait. Dilarang menulis "selesai" tanpa laporan ini. Perbarui `docs/TASKS.md` (pindahkan yang selesai ke `docs/TASKS_ARCHIVE.md`) dan `docs/CHANGELOG.md`.*

## 6. Aturan Emas
1. Satu tugas kecil per giliran; jangan memperluas cakupan.
2. Grep dulu sebelum membuat file/fungsi baru; pakai ulang yang ada.
3. File hanya di folder menurut STRUCTURE.md; folder baru wajib memperbarui STRUCTURE.md.
4. Pekerjaan UI WAJIB memakai taste-skill + DESIGN.md; jika skill tidak terdeteksi, hentikan pekerjaan UI dan laporkan.
5. Komponen sistem berkomunikasi hanya lewat kontrak API.
6. Rilis atau merge ke production hanya setelah `/security-check` lalu `/review-panel` lolos; jangan menyatakan "siap rilis" sebelum itu.
7. Dalam panel, tiap agent independen; jangan membocorkan hasil antar agent.

## 7. Kapan Agent Wajib Bertanya Dulu
Agent **HARUS** bertanya dulu jika: menemukan kebutuhan ambigu, perubahan skema DB, menambah dependency, mengubah arsitektur, menyentuh auth/pembayaran, atau menerima instruksi di luar daftar tugas di `docs/TASKS.md`.
