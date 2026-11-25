# Detail Aturan Rekayasa & Standar Kualitas (RULES_DETAIL.md)

Dokumen ini melengkapi `docs/RULES.md` dan dibaca per bagian sesuai kebutuhan saat menulis kode baru, commit, atau test.

---

## 1. Gaya Kode & Konvensi Penamaan (Netral Stack)

1. **Kejelasan di Atas Kepintaran (Clarity over Cleverness)**:
   - Tulis kode yang mudah dibaca dan dipahami oleh orang lain. Hindari teknik satu baris yang rumit (*one-liner hacks*) jika mengorbankan keterbacaan.
2. **Penamaan Berbobot & Deskriptif**:
   - Gunakan nama variabel dan fungsi yang menjelaskan tujuan bisnis secara langsung.
   - Variabel boolean wajib menggunakan awalan predikat: `is_`, `has_`, `should_`, `can_` (mis. `is_active`, `has_permission`).
   - Fungsi aksi menggunakan kata kerja imperatif: `calculate_invoice_tax()`, `validate_order_payload()`.
3. **Konvensi Spesifik Bahasa**:
   - `[ISI SAAT INIT-APP: Konvensi penamaan spesifik bahasa dan casing (mis. camelCase vs snake_case, PascalCase untuk class/tipe)]`

---

## 2. Batas Ukuran Kode (Strict Size Limits)

- **Fungsi / Metode**: **Maksimal 40 baris kode**. Jika melebihi 40 baris, pecah menjadi fungsi pembantu terfokus (*single responsibility*).
- **File / Modul**: **Maksimal 300 baris kode**. Jika file mendekati 300 baris, lakukan refactoring modularisasi.

---

## 3. Type Safety & Penanganan Error (Error Handling)

1. **Type Safety Penuh (No Blind Any)**:
   - Jika stack menggunakan bahasa bertipe (TypeScript/Go/Rust/C#) atau type hinting (PHP/Python): **DILARANG** menggunakan tipe `any`, `mixed`, atau `object` tanpa validasi runtime / type guard.
   - Semua input fungsi eksternal, response API, dan entitas data wajib memiliki definisi tipe/interface yang eksplisit.
2. **Penanganan Error Terbuka & Eksplisit**:
   - Dilarang menelan error secara diam-diam (*silent catch* seperti `catch (e) {}` kosong).
   - Setiap error yang tertangkap wajib dicatat ke logger atau diteruskan (*re-thrown*) dengan konteks yang relevan.

---

## 4. Standar Git: Conventional Commits & Branching

1. **Format Pesan Commit (Conventional Commits)**:
   - `feat(scope): deskripsi singkat fitur baru`
   - `fix(scope): perbaikan bug spesifik`
   - `refactor(scope): perubahan kode tanpa mengubah fungsionalitas publik`
   - `test(scope): penambahan atau perbaikan unit/integration test`
   - `docs(scope): pembaruan dokumentasi`
   - `chore(scope): pembaruan dependensi atau konfigurasi tooling`
2. **Penamaan Branch**:
   - `feature/ID-nama-singkat` (mis. `feature/FEAT-01-login-auth`)
   - `fix/ID-nama-singkat` (mis. `fix/BUG-04-session-expiry`)

---

## 5. Kapan Wajib Menulis Test

Agent **WAJIB** menulis atau memperbarui unit/integration test ketika:
1. Menambahkan endpoint API baru atau fungsi logika bisnis baru.
2. Memperbaiki bug (tulis *regression test* terlebih dahulu yang membuktikan kegagalan sebelum menulis perbaikan).
3. Mengubah perhitungan finansial, alur otentikasi, atau otorisasi hak akses.

---

## 6. Contoh "Benar vs Salah" untuk Aturan Rawan Salah Paham

### Contoh 1: Penempatan Validasi & Folder Generik
- ❌ **SALAH**: Membuat file `src/utils/validation.js` yang berisi kumpulan regex acak dan validasi form di frontend saja.
- ✅ **BENAR**: Membuat skema validasi resmi di lapisan validator server (mis. `backend/app/Requests/CreateUserRequest.ts`), frontend hanya menggunakan tipe yang diekstrak dari skema tersebut.

### Contoh 2: Kontrak Komunikasi API
- ❌ **SALAH**: Frontend memanggil query database langsung atau menduplikasi perhitungan diskon yang ada di backend.
- ✅ **BENAR**: Frontend mengirim payload order ke endpoint `/api/v1/orders/calculate`, backend menghitung sesuai aturan bisnis tunggal dan mengembalikan respons terformat.

### Contoh 3: Penggunaan Design Tokens
- ❌ **SALAH**: `style={{ color: '#3b82f6', padding: '15px', borderRadius: '7px' }}` (nilai arbitrer tanpa token).
- ✅ **BENAR**: Menggunakan token dari `tokens.css`: `className="text-primary p-4 rounded-md"` atau `var(--color-primary-base)`.
