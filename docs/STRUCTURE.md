# Struktur Direktori & Penempatan Kode (STRUCTURE.md)

Dokumen ini mendefinisikan aturan anti-repetisi dan peta arsitektur folder resmi repositori.

## 1. Aturan Anti-Repetisi (Single Source of Truth)
1. Satu informasi, satu sumber; dokumen lain menautkan.
2. Kontrak API ditulis sekali di [docs/API_SPEC.md](file:///docs/API_SPEC.md); tipe klien di-generate darinya.
3. Aturan bisnis divalidasi di server; validasi klien hanya untuk kenyamanan UX.
4. Dilarang folder generik: `utils/`, `helpers/`, `common/`, `misc/`, atau `temp/`.
5. Aturan tiga: kode sama muncul ketiga kali wajib diekstrak menjadi modul bersama.
6. Grep sebelum membuat file/fungsi baru; pakai ulang kode yang ada.
7. File `.env` hanya di folder tiap aplikasi, tanpa `.env` di root yang menduplikasi nilai.
8. Satu route = satu definisi di file rute terdedikasi.
9. Konfigurasi hanya di folder config atau modul env terpusat.
10. Folder `scratch/` tidak pernah di-import atau di-commit (detail di [docs/STRUCTURE_DETAIL.md](file:///docs/STRUCTURE_DETAIL.md)).

## 2. Peta Folder Aplikasi (Folder Map)
> *Diisi lengkap saat `/init-app` setelah arsitektur dan stack dipilih.*

| Direktori / Folder | Fungsi Utama (Satu Kalimat) | Boleh Berisi | DILARANG Berisi |
| :--- | :--- | :--- | :--- |
| `docs/` | Dokumentasi arsitektur, PRD, dan panduan proyek | File markdown panduan | Kode aplikasi executable |
| `scratch/` | Eksperimen dan prototipe sementara | Catatan, tes lokal mandiri | File yang di-import oleh kode aplikasi |
| `scripts/` | Skrip otomasi dan verifikasi mekanis | Skrip shell pendukung | Kode logika bisnis aplikasi |
| `[ISI SAAT INIT-APP: Direktori 1]` | `[Fungsi]` | `[Allowed]` | `[Forbidden]` |
| `[ISI SAAT INIT-APP: Direktori 2]` | `[Fungsi]` | `[Allowed]` | `[Forbidden]` |

## 3. Pemetaan "Satu Fungsi, Satu Tempat" (Single Responsibility Matrix)
> *Diisi saat `/init-app` untuk menentukan letak pasti setiap lapisan tanggung jawab:*

| Tanggung Jawab / Fungsi | Lokasi Direktori Resmi | Penjelasan Singkat |
| :--- | :--- | :--- |
| **Validasi Input** | `[ISI SAAT INIT-APP: mis. backend/app/Requests atau validators/]` | Skema validasi payload request |
| **Logika Bisnis** | `[ISI SAAT INIT-APP: mis. backend/app/Actions atau services/]` | Domain logic murni terisolasi dari HTTP |
| **Format Response API** | `[ISI SAAT INIT-APP: mis. backend/app/Resources atau serializers/]` | Transformasi entitas ke JSON standar |
| **Otorisasi & Hak Akses** | `[ISI SAAT INIT-APP: mis. backend/app/Policies atau guards/]` | Pengecekan izin per role & resource |
| **Definisi Endpoint / Routes** | `[ISI SAAT INIT-APP: mis. backend/routes/api/v1/]` | Pemetaan URL ke controller spesifik |
| **Migrasi Database** | `[ISI SAAT INIT-APP: mis. backend/database/migrations/]` | Riwayat perubahan skema database |
| **Seed Data Produksi** | `[ISI SAAT INIT-APP: mis. backend/database/seeders/Production/]` | Seeder idempotent untuk data awal |
| **Seed Data Development** | `[ISI SAAT INIT-APP: mis. backend/database/seeders/Development/]`| Dummy data lewat factory untuk dev/testing |
| **Panggilan ke Backend (Client)** | `[ISI SAAT INIT-APP: mis. frontend/src/api/]` | Client HTTP fetcher berbasis kontrak |
| **Design Tokens** | `[ISI SAAT INIT-APP: mis. frontend/src/styles/tokens.css]` | Sumber tunggal variabel warna & dimensi UI |
| **Eksperimen / Debug** | `scratch/` | Prototipe sementara terisolasi |

*Catatan detail aturan scratch, seeder, dan penamaan per folder*: Lihat [docs/STRUCTURE_DETAIL.md](file:///docs/STRUCTURE_DETAIL.md).
