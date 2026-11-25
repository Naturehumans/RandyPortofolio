# Command: /security-check

> **Tujuan**: Mengaudit seluruh 20 poin Checklist Keamanan Pre-Launch di `docs/SECURITY.md` Bagian B secara faktual berdasarkan kode sumber, konfigurasi, dan riwayat git aktual. Dilarang menebak status tanpa bukti.

---

## Prosedur Audit Nyata (Faktual)

Agent wajib memeriksa setiap poin dengan memeriksa file, menjalankan grep, atau menjalankan alat audit:

0. **Pemeriksaan Mekanis (Poin 2, 3, 4)**:
   - Jalankan `bash scripts/verify.sh` terlebih dahulu dan gunakan hasilnya langsung untuk Poin 2 (.env), Poin 3 (Pola secret), dan Poin 4 (Gitleaks).
   - Jangan diperiksa ulang secara manual. Jika gitleaks berstatus `SKIP` di output skrip, tandai Poin 4 sebagai `MANUAL` (perlu cek manual).
1. **Poin 1 (API key aman)**: Periksa bundel frontend (`dist/` atau file sumber `frontend/src/`) untuk memastikan tidak ada API secret key (hanya public publishable key yang diizinkan).
2. **Poin 2 (.env tidak public)**: Hasil dari `scripts/verify.sh` check `env-tidak-ter-track`. Pastikan hanya `.env.example` yang terlacak.
3. **Poin 3 (Tanpa hardcode secret)**: Hasil dari `scripts/verify.sh` check `tanpa-pola-secret` / gitleaks.
4. **Poin 4 (Tidak ada secret di Git)**: Hasil dari `scripts/verify.sh` check `gitleaks` pada seluruh riwayat commit git (jika SKIP, tandai MANUAL). **PENTING**: Jika ditemukan secret yang pernah ter-commit, tegaskan bahwa secret tersebut **WAJIB DI-ROTATE** (menghapus dari file/git saja tidak cukup karena kredensial sudah terekspos).
5. **Poin 5 (Debug OFF)**: Periksa konfigurasi production di `.env.example`, `config/`, atau `docker-compose.yml`. Pastikan flag debug dimatikan.
6. **Poin 6 (Error tidak bocor)**: Periksa global exception handler. Pastikan tidak me-return stack trace atau raw error message di environment production.
7. **Poin 7 (Validasi input)**: Buka definisi rute dan controller. Pastikan setiap endpoint POST/PUT/PATCH memiliki skema validator yang memeriksa tipe, panjang, dan format data.
8. **Poin 8 (Sanitasi input)**: Periksa penanganan data input khusus teks/HTML, pastikan terdapat sanitizer atau normalizer.
9. **Poin 9 (Anti-SQLi)**: Grep pencarian query mentah: cari pola konkatenasi string SQL (`SELECT`, `WHERE ... +`, `$query . $input`). Pastikan seluruh query menggunakan prepared statement berparameter.
10. **Poin 10 (Anti-XSS)**: Grep di komponen frontend: cari penggunaan `dangerouslySetInnerHTML`, `v-html`, atau modifikasi `innerHTML` langsung tanpa sanitizer.
11. **Poin 11 (Autentikasi server-side)**: Periksa seluruh definisi rute API privat. Pastikan middleware autentikasi aktif melindungi endpoint, bukan sekadar menyembunyikan navigasi di frontend.
12. **Poin 12 (Cek akses user / Anti-IDOR)**: Periksa controller resource. Pastikan ada pemeriksaan kepemilikan data (e.g. `WHERE id = $id AND user_id = $currentUser->id`).
13. **Poin 13 (Role admin aman)**: Periksa middleware otorisasi role. Pastikan peran admin diverifikasi dari sesi server dan tidak mengizinkan bypass kredensial default.
14. **Poin 14 (Database tidak public)**: Periksa konfigurasi port database (`docker-compose.yml`, config cloud). Pastikan port database (5432, 3306, 27017) tidak di-bind ke `0.0.0.0`.
15. **Poin 15 (Permission DB ketat)**: Periksa kredensial koneksi DB runtime aplikasi. Pastikan tidak menggunakan user `root` atau `superuser`.
16. **Poin 16 (Password di-hash)**: Periksa logika registrasi dan login. Pastikan enkripsi menggunakan Argon2id atau bcrypt. Cek konfigurasi logger untuk memastikan kata sandi di-masking.
17. **Poin 17 (Session aman)**: Periksa konfigurasi cookie: flag `HttpOnly=true`, `Secure=true`, `SameSite=Lax/Strict`, masa expired, dan proteksi rate limiting pada endpoint auth.
18. **Poin 18 (Reset password aman)**: Periksa logika reset password. Token harus kriptografis acak, tersimpan dalam bentuk hash, masa berlaku singkat (< 15 menit), sekali pakai, dan respons timing identik apakah email terdaftar atau tidak.
19. **Poin 19 (Batasi upload berkas)**: Periksa controller upload. Wajib ada whitelist ekstensi file, validasi MIME type, pengecekan ukuran maksimal, dan nama file diacak (UUID).
20. **Poin 20 (Scan berkas upload)**: Periksa pipeline pemrosesan berkas. Pastikan ada proteksi scanning malware atau re-encoding gambar yang membuang metadata EXIF.

> *Catatan*: Poin yang tidak bisa diverifikasi langsung dari kode repositori (seperti aturan firewall server hosting, DNS, atau konfigurasi jaringan cloud) **WAJIB DITANDAI DENGAN STATUS `MANUAL` (PERLU DICEK MANUAL)** dan disertai panduan langkah konkret pengujiannya bagi pengguna.

---

## Format Laporan Keamanan Wajib

Tampilkan hasil audit dalam format tabel 20 baris lengkap:

```markdown
### Laporan Audit Keamanan Pre-Launch (20 Poin)

| No | Poin Keamanan | Status | Bukti / Catatan Verifikasi | Perbaikan Disarankan |
| :-: | :--- | :-: | :--- | :--- |
| 1 | API key aman | PASS / FAIL / N/A / MANUAL | [Path file / hasil grep] | [Saran perbaikan] |
| ... | ... | ... | ... | ... |
| 20 | Scan berkas upload | PASS / FAIL / N/A / MANUAL | [Path file / hasil grep] | [Saran perbaikan] |

#### Ringkasan Hasil
- **PASS**: X poin
- **FAIL**: Y poin (Kritis: ..., Tinggi: ...)
- **MANUAL**: Z poin
- **N/A**: W poin

**Status Kelulusan**: [LULUS / DIBLOKIR KARENA POIN KRITIS GAGAL]
```

---

## Kebijakan Penanganan
1. **Dilarang Memperbaiki Otomatis**: Tampilkan laporan terlebih dahulu kepada pengguna. Tanyakan kepada pengguna temuan mana yang ingin diperbaiki terlebih dahulu.
2. **Pembaruan Dokumen**: Perbarui kolom Status dan tabel Riwayat Audit di [docs/SECURITY.md](file:///docs/SECURITY.md) sesuai temuan nyata ini.
