# Panduan Optimasi Token Opsional (OPTIMASI_OPSIONAL.md)

> **PERHATIAN**: File ini tidak dimuat otomatis. Berisi strategi penghematan token lanjutan yang **TIDAK diterapkan secara otomatis**. Terapkan sesuai kebutuhan dan ukur dampaknya terhadap efisiensi dan kualitas kode.

---

## 1. Efisiensi Cache & Prompt Caching
- **Stabilitas File Selalu-Dimuat**: Jaga agar file yang selalu dimuat (`AGENTS.md`, `CLAUDE.md`, `docs/RULES.md`, `docs/STRUCTURE.md`) jarang berubah agar memanfaatkan prompt caching penyedia LLM secara maksimal.
- **Urutan Konteks**: Letakkan bagian yang sering berubah (seperti daftar tugas aktif `docs/TASKS.md`) pada urutan paling akhir.
- **Hindari Data Dinamis Cepat Usang**: Jangan menaruh tanggal dinamis, timestamp, atau status yang sering berganti di dalam `AGENTS.md`.

---

## 2. Optimasi Panel Review Multi-Agent
- **Konteks Selektif**: Berikan agent reviewer hanya `git diff` dan dokumen yang relevan dengan perubahan, bukan seluruh repositori.
- **Evaluasi Ulang Terfokus (Putaran 2-3)**: Pada putaran berikutnya, hanya jalankan ulang persona agent yang sebelumnya menemukan `BLOCKER` atau memberikan skor di bawah ambang batas (ditambah satu cek regresi umum), alih-alih memanggil ulang ke-6 persona secara penuh.
- **Alokasi Model Cerdas**: Pertimbangkan menggunakan model yang lebih cepat/ekonomis untuk persona observasi perilaku pengguna (mis. Klien Awam, Klien Pelit) dan model penalaran tinggi untuk persona teknis mendalam (Klien Strict, Profesor, Freelancer Saingan).
- **Validasi Pilot**: Uji efektivitas strategi ini pada satu modul/fitur percontohan sebelum diterapkan ke seluruh proyek.

---

## 3. Strategi Pembacaan File Terfokus
- **Abaikan File Eksternal & Biner**: Konfigurasi file ignore untuk mengabaikan lockfile (`package-lock.json`, `composer.lock`), `vendor/`, `node_modules/`, output build (`dist/`), dan dump `scratch/`.
- **Targeted Reading**: Gunakan `grep` untuk menemukan nomor baris spesifik, lalu baca rentang baris yang relevan menggunakan slice/offset daripada membaca keseluruhan file berukuran besar.

---

## 4. Manajemen Sesi Kerja
- **Satu Tugas Per Sesi**: Terapkan prinsip satu tugas kecil per sesi percakapan untuk menjaga jendela konteks tetap bersih dan responsif.
- **Pembersihan Rutin**: Jalankan perintah pembersihan sesi (`/clear` atau `/compact`) jika konteks percakapan sudah terlalu panjang.
- **Rencana Bertingkat**: Untuk tugas tingkat **Berat**, selalu susun rencana terisolasi dan minta persetujuan pengguna sebelum penulisan kode dimulai.

---

## 5. Metrik & Pengukuran Efektivitas
- **Uji Komparasi**: Bandingkan konsumsi token dan kualitas hasil pada 3 contoh tugas representatif (Ringan, Normal, dan Berat).
- **Rollback Guard**: Jika penurunan biaya token menyebabkan degradasi kualitas atau memicu bug regresi, segera batalkan aturan pemangkasan tersebut.
