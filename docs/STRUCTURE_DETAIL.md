# Detail Arsitektur & Aturan Direktori (STRUCTURE_DETAIL.md)

Dokumen ini melengkapi `docs/STRUCTURE.md` dan dibaca khusus saat menyentuh direktori `scratch/`, seeder database, atau penamaan file.

---

## 1. Aturan Direktori Scratch (`scratch/`)

1. **Fungsi Direktori**:
   - Hanya diperuntukkan bagi eksperimen sementara, prototipe fungsionalitas cepat, catatan debug, atau dump data tes.
2. **Aturan Git**:
   - Seluruh isi folder `scratch/*` masuk ke dalam `.gitignore` kecuali file `scratch/README.md`.
   - Dilarang men-track file eksperimen ke dalam repositori git.
3. **Larangan Impor (Strict)**:
   - **DILARANG KERAS** mengimpor file atau modul dari `scratch/` ke dalam kode aplikasi utama (`backend/`, `frontend/`, dsb.).
4. **Promosi Kode**:
   - Eksperimen yang dinyatakan layak dan akan dipakai dalam aplikasi utama **wajib** dipindahkan ke lokasi resmi sesuai [docs/STRUCTURE.md](file:///docs/STRUCTURE.md) dan ditulis ulang mengikuti standar kualitas [docs/RULES.md](file:///docs/RULES.md).
5. **Sanitasi Pra-Rilis**:
   - Sebelum deployment ke staging/production, pastikan direktori `scratch/` bersih dari data sensitif, token, dan secret.

---

## 2. Aturan Seeder Database

*Berlaku jika arsitektur aplikasi menggunakan basis data:*

1. **Entry Point Terpusat**:
   - Entry point seeder (mis. `DatabaseSeeder`) hanya bertugas memanggil seeder domain lain secara berurutan; tidak boleh berisi query insert langsung.
2. **Idempotensi di Lingkungan Production**:
   - Seeder yang berjalan di production (mis. data referensi awal/lookup) wajib bersifat **idempotent** (menggunakan operasi *upsert* / *firstOrCreate*), sehingga aman dijalankan berkali-kali tanpa memicu duplikasi data.
3. **Pemisahan Seeder Development vs Production**:
   - Seeder pengisi data dummy untuk development/staging **hanya boleh dieksekusi** jika environment secara eksplisit berstatus `local`, `development`, atau `testing`. Sistem wajib memblokir eksekusi seeder development di production.
4. **Data Dummy Melalui Factory**:
   - Pembuatan data testing/dummy wajib memanfaatkan *Factory* atau generator data palsu terstruktur (seperti Faker).
5. **Bebas Kredensial Asli**:
   - Dilarang keras menaruh email asli, password asli, atau data identitas pengguna nyata di dalam file seeder.

---

## 3. Konvensi Penamaan per Folder
> *Diisi secara spesifik saat `/init-app` mengacu pada konvensi bahasa dan framework yang dipilih.*

| Lapisan / Folder | Konvensi Penamaan | Contoh |
| :--- | :--- | :--- |
| **Komponen UI** | `[ISI SAAT INIT-APP: PascalCase.tsx / PascalCase.vue]` | `ButtonPrimary.tsx`, `UserCard.vue` |
| **Halaman / Pages** | `[ISI SAAT INIT-APP: kebab-case / PascalCase]` | `user-profile.tsx`, `Dashboard.vue` |
| **Layanan / Actions** | `[ISI SAAT INIT-APP: camelCase.ts / PascalCase.php]` | `calculateInvoice.ts`, `CreateUserAction.php` |
| **Model Data** | `[ISI SAAT INIT-APP: PascalCase]` | `User.ts`, `Order.php` |
| **File Test** | `[ISI SAAT INIT-APP: *.test.ts / *Test.php]` | `auth.test.ts`, `OrderServiceTest.php` |
| **Migrasi Database** | `[ISI SAAT INIT-APP: YYYY_MM_DD_HHMMSS_create_table.php]` | `2026_10_19_000001_create_users_table.php` |
