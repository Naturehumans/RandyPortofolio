# Strategi & Protokol Pengujian (TESTING.md)

Dokumen ini mendefinisikan piramida pengujian, peralatan uji (*testing tools*), target cakupan (*coverage*), konvensi penamaan file test, dan skenario kritis yang wajib diuji.

---

## 1. Piramida & Strategi Pengujian

```text
       /\
      /  \      E2E Tests (End-to-End)
     /----\     - Menguji alur kritis pengguna dari UI ke DB
    /      \    Integration Tests
   /--------\   - Menguji interaksi API endpoint, database, & middleware
  /          \  Unit Tests
 /------------\ - Menguji fungsi logika murni, parser, validator terisolasi
```

1. **Unit Tests (Dasar Piramida)**:
   - Fokus: Fungsi matematika, validator payload, utility tanggal, transformasi format, dan state reducers.
   - Karakteristik: Sangat cepat (< 1 ms per tes), murni in-memory, tanpa dependensi jaringan atau database nyata.
2. **Integration Tests (Tengah)**:
   - Fokus: Panggilan HTTP endpoint API, query database terhadap DB testing lokal, eksekusi middleware auth, dan skema validasi request.
   - Karakteristik: Menggunakan basis data testing terisolasi yang di-reset/di-rollback di setiap test suite.
3. **End-to-End (E2E) Tests (Puncak)**:
   - Fokus: Skenario bisnis paling berharga (login, checkout/pembayaran, pengisian form inti).
   - Karakteristik: Menggunakan browser automation (Playwright/Cypress) terhadap antarmuka nyata.

---

## 2. Peralatan Uji & Perintah Eksekusi
> *Disesuaikan saat `/init-app` berdasarkan stack terpilih.*

- **Backend Test Runner**: `[ISI SAAT INIT-APP: mis. Vitest / Jest / PHPUnit / PyTest]`
  - Perintah: `[ISI SAAT INIT-APP: perintah menjalankan test backend]`
- **Frontend Test Runner**: `[ISI SAAT INIT-APP: mis. Vitest + React Testing Library]`
  - Perintah: `[ISI SAAT INIT-APP: perintah menjalankan test frontend]`
- **E2E Test Runner**: `[ISI SAAT INIT-APP: mis. Playwright]`
  - Perintah: `[ISI SAAT INIT-APP: perintah menjalankan E2E]`

---

## 3. Target Cakupan (Coverage Targets)
- **Logika Bisnis Inti (Business Domain)**: Minimal **90%** branch coverage.
- **API Endpoints (Controllers & Middleware)**: Minimal **80%** line coverage.
- **Komponen Presentasi (UI Components)**: Minimal **70%** (menguji interaksi dan visual states).
- **Keseluruhan Sistem**: Minimal **80%** total coverage.

---

## 4. Konvensi Penamaan & Struktur File Test
1. **Penempatan Berdampingan (Colocated) atau Dedicated Folder**:
   - Backend: Diletakkan di direktori `tests/Unit/` dan `tests/Feature/` (atau berdampingan `*.spec.ts`).
   - Frontend: Diletakkan berdampingan dengan komponen, misalnya `Button.tsx` -> `Button.test.tsx`.
2. **Format Penamaan Kasus Uji**:
   - Pola deskripsi menggunakan: `it('should [expected result] when [condition/action]')`
   - Hindari deskripsi tes kabur seperti `it('works')`.

---

## 5. Mocking, Fixture, & Factory
1. **Aturan Mocking**:
   - Hanya mock layanan eksternal di luar kendali kita (Payment Gateway, penyedia Email, SMS, S3).
   - Dilarang memalsukan (mock) database lokal pada Integration Tests; gunakan SQLite in-memory atau container DB testing terisolasi.
2. **Penggunaan Fixtures & Factories**:
   - Selalu generate data dinamis menggunakan Factory (Faker) dengan identifier unik untuk menghindari *race conditions* atau data clash antar test runner paralel.

---

## 6. Skenario Kritis Wajib (Non-Negotiable Tests)
Setiap aplikasi wajib memiliki test otomatis untuk skenario berikut sebelum rilis:
1. **Alur Otentikasi**:
   - Login dengan kredensial benar mengembalikan token/sesi sah.
   - Login dengan password salah atau email tidak terdaftar mengembalikan HTTP 401 dan tidak membocorkan detail keberadaan user.
2. **Perlindungan Akses (Authorization / Anti-IDOR)**:
   - Pengguna A mengakses endpoint data miliknya -> HTTP 200.
   - Pengguna A mencoba mengakses atau memutasi ID milik Pengguna B -> Wajib HTTP 403 atau 404 (IDOR dicegah).
   - Pengguna anonim tanpa token mengakses rute privat -> HTTP 401.
3. **Integritas Validasi Input**:
   - Payload dengan tipe data salah atau field wajib hilang ditolak dengan HTTP 422.
4. **Boundary & Edge Cases**:
   - Penanganan string kosong, karakter unicode/emoji, angka nol, angka negatif, dan nilai string sangat panjang.
