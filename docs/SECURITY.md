# Kebijakan & Checklist Keamanan Sistem (SECURITY.md)

Dokumen ini mendefinisikan kebijakan keamanan aplikasi dan daftar periksa wajib (*Pre-Launch Security Checklist*) 20 poin yang wajib diaudit sebelum kode dirilis ke lingkungan production.

---

## Bagian A: Kebijakan Keamanan Sistem

1. **Autentikasi & Pengelolaan Sesi**:
   - Autentikasi berbasis token atau session cookie terenkripsi.
   - Session cookie wajib memiliki atribut: `HttpOnly`, `Secure`, `SameSite=Lax` (atau `Strict`), dengan masa kedaluwarsa pendek dan perpanjangan terkontrol.
2. **Otorisasi & Kontrol Akses (ABAC / RBAC)**:
   - Setiap permintaan akses ke resource individual wajib diverifikasi kepemilikannya di tingkat database/service (Anti-IDOR).
   - Penentuan peran (role) pengguna mutlak berasal dari data server yang diverifikasi, bukan dari klaim payload klien.
3. **Pengelolaan Secret & Kredensial**:
   - Semua secret, token API eksternal, dan encryption key disimpan di environment variables server.
   - Dilarang keras menaruh nilai rahasia di dalam repositori kode git atau bundle javascript publik.
4. **Perlindungan Data Pribadi (Privasi)**:
   - Data sensitif pengguna (password, token, informasi pembayaran) tidak boleh dicatat dalam plain-text di log, database, atau cache. Password wajib di-hash menggunakan Argon2id atau bcrypt dengan cost factor yang memadai.
5. **Header Keamanan HTTP**:
   - Seluruh respons HTTP wajib menyertakan header keamanan modern:
     - `Content-Security-Policy (CSP)`
     - `Strict-Transport-Security (HSTS)`
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY` (atau `SAMEORIGIN`)
     - `Referrer-Policy: strict-origin-when-cross-origin`
- **Detail Implementasi Spesifik Stack**: `[ISI SAAT INIT-APP: Konfigurasi middleware security, CORS, dan rate limiter]`

---

## Bagian B: Checklist Keamanan Pre-Launch 20 Poin

*Ke-20 poin di bawah ini WAJIB dievaluasi secara nyata melalui perintah `/security-check`. Status yang diizinkan: `PASS`, `FAIL`, `N/A`, atau `MANUAL`.*

| No | Poin Keamanan | Acuan Verifikasi & Standar | Status | Bukti / Catatan Verifikasi | Terakhir Dicek |
| :-: | :--- | :--- | :-: | :--- | :--- |
| **1** | **API key aman** | Hanya dipakai di server, tidak ada di bundle frontend, scope terbatas, bisa di-rotate | `BELUM_DICEK` | Periksa bundle dist/ dan kode klien | - |
| **2** | **.env tidak public** | Ada di .gitignore; `git ls-files \| grep .env` kosong; `https://domain/.env` -> 404 | `BELUM_DICEK` | Cek status git dan konfigurasi web server | - |
| **3** | **Tanpa hardcode secret** | Audit menggunakan gitleaks/trufflehog; `grep` key=, token=, password= pada repo | `BELUM_DICEK` | Hasil scan scanner secret | - |
| **4** | **Tidak ada secret di Git** | `gitleaks detect` pada seluruh riwayat commit; jika bocor, segera rotate kredensial | `BELUM_DICEK` | Riwayat git audit | - |
| **5** | **Debug OFF** | Mode debug dinonaktifkan di production; source maps tidak diakses publik | `BELUM_DICEK` | Cek flag environment production | - |
| **6** | **Error tidak bocor** | Pancing error di production: pesan generik, tanpa stack trace/path file/query DB | `BELUM_DICEK` | Uji respons error 500 | - |
| **7** | **Validasi input** | Skema validasi di semua endpoint tulis: tipe, panjang, format, whitelist field | `BELUM_DICEK` | Cek request validation schemas | - |
| **8** | **Sanitasi input** | Normalisasi format, escaping karakter berbahaya, HTML sanitizer untuk rich text | `BELUM_DICEK` | Cek sanitasi controller / DTO | - |
| **9** | **Anti-SQL Injection** | ORM / query builder berparameter; tidak ada concat string pada query SQL mentah | `BELUM_DICEK` | Audit file query dan model DB | - |
| **10** | **Anti-XSS** | Output encoding otomatis; tidak ada `dangerouslySetInnerHTML` / innerHTML user input; CSP aktif | `BELUM_DICEK` | Audit komponen antarmuka | - |
| **11** | **Autentikasi server-side**| Middleware auth di semua rute privat server; menyembunyikan tombol UI tidak cukup | `BELUM_DICEK` | Cek deklarasi routing dan middleware | - |
| **12** | **Cek akses user (Anti-IDOR)**| Otorisasi per resource; uji ganti ID: User A dilarang mengakses/memutasi data User B | `BELUM_DICEK` | Integration test verifikasi IDOR | - |
| **13** | **Role admin aman** | Role dihitung dan ditentukan di server; tanpa default admin credential; MFA aktif | `BELUM_DICEK` | Cek logic session dan privilege | - |
| **14** | **Database tidak public** | Port database tidak terekspos ke internet publik; private VPC/allowlist IP; TLS aktif | `BELUM_DICEK` | Konfigurasi jaringan hosting / docker | - |
| **15** | **Permission DB ketat** | User DB aplikasi tanpa hak superuser/DROP table; migrasi terpisah hak aksesnya | `BELUM_DICEK` | Cek grant privilese user DB | - |
| **16** | **Password di-hash** | Menggunakan algoritma Argon2id atau bcrypt; password tidak pernah dicatat di log | `BELUM_DICEK` | Cek controller auth dan logger masking | - |
| **17** | **Session aman** | Cookie HttpOnly, Secure, SameSite; session timeout; regenerate ID saat login; rate limit login | `BELUM_DICEK` | Cek konfigurasi cookie dan rate limit | - |
| **18** | **Reset password aman** | Token acak kriptografis, single-use, kedaluwarsa singkat, disimpan hash, respon sama terdaftar/tidak | `BELUM_DICEK` | Alur reset password di backend | - |
| **19** | **Batasi upload berkas** | Whitelist ekstensi, MIME type, magic bytes; batasan size; nama file diacak; simpan di luar webroot | `BELUM_DICEK` | Handler upload dan validasi file | - |
| **20** | **Scan berkas upload** | Scanning malware (ClamAV/cloud scan); karantina sebelum publikasi; re-encode gambar dan buang EXIF | `BELUM_DICEK` | Pipeline pemrosesan berkas upload | - |

---

## Bagian C: Klasifikasi Tingkat Keparahan (Severity Matrix)

- **STATUS KRITIS (Poin 1, 2, 3, 4, 9, 11, 12, 13, 14, 15, 16, 18)**:
  - **Dampak Rilis**: Jika ada **1 (satu) saja** poin Kritis yang berstatus `FAIL`, rilis ke staging/production **MUTLAK DIBLOKIR**.
  - Wajib diperbaiki dan diverifikasi ulang sebelum pekerjaan lain dilanjutkan.
- **STATUS TINGGI (Poin 5, 6, 7, 8, 10, 17, 19, 20)**:
  - Wajib diperbaiki sesegera mungkin.
  - Jika ada alasan teknis yang mengharuskan penundaan sementara, hal tersebut wajib disetujui pengguna dan dicatat secara transparan di [docs/DECISIONS.md](file:///docs/DECISIONS.md) sebagai *risiko yang diterima (accepted risk)*.

---

## Bagian D: Riwayat Audit Keamanan (Security Audit Log)

| Tanggal Audit | Pelaksana Audit | Lingkup / Versi | Ringkasan Hasil | Temuan Terbuka (Open Issues) |
| :--- | :--- | :--- | :--- | :--- |
| *[Tgl]* | *AI Agent (/security-check)* | *v0.1.0 (Template)* | *Checklist awal dibuat* | *Menunggu implementasi stack* |
