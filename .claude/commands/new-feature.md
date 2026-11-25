# Command: /new-feature

> **Tujuan**: Membangun fitur baru secara bertahap mengikuti Protokol 3 Tahap, berbasis kriteria penerimaan PRD, terisolasi, dan teruji penuh.

---

## Alur Prosedur Kerja

### Langkah 1: Penelaahan Kebutuhan (PRD & TASKS)
1. Buka [docs/PRD.md](file:///docs/PRD.md) dan [docs/TASKS.md](file:///docs/TASKS.md).
2. Pastikan fitur yang akan dikerjakan tercatat di `TASKS.md` dan memiliki User Story serta Kriteria Penerimaan (*Given/When/Then*) di `PRD.md`.
3. Pindahkan tugas terkait ke status **Sedang Dikerjakan** di `TASKS.md`.

### Langkah 2: Blok PRE-FLIGHT (Wajib)
Awali respon kerja dengan mencetak blok PRE-FLIGHT:
```text
PRE-FLIGHT
- File yang sudah dibaca: [daftar path file yang dibaca]
- Aturan paling relevan untuk tugas ini: [3-5 poin DIKUTIP dari RULES.md]
- Rencana, file yang akan disentuh, dan lokasinya menurut STRUCTURE.md: [penjelasan]
- Hasil pencarian (grep) apakah fungsi/komponen serupa sudah ada: [hasil grep]
```

### Langkah 3: Rencana Teknis & Implementasi Bertahap
1. Tentukan urutan pengerjaan komponen:
   - Jika ada perubahan data: Migration & Data Model (`docs/DATA_MODEL.md`)
   - Lapisan bisnis / action domain
   - Endpoint & Controller API (`docs/API_SPEC.md`)
   - Komponen UI & Halaman (wajib mematuhi `docs/DESIGN.md`, `taste-skill`, dan token desain)
2. Kerjakan perubahan secara bertahap dan terfokus. Batasi fungsi maksimal 40 baris dan file maksimal 300 baris.

### Langkah 4: Penulisan Pengujian Otomatis (Tests)
1. Buat unit test untuk fungsi bisnis baru.
2. Buat integration test untuk endpoint baru (menguji alur sukses, validasi 422, dan error otorisasi 401/403).

### Langkah 5: Pembaruan Dokumentasi (Update Docs)
1. Sinkronkan dokumen kontrak di `docs/API_SPEC.md` jika ada penambahan rute/payload baru.
2. Sinkronkan `docs/STRUCTURE.md` jika ada folder baru yang disetujui.

### Langkah 6: Verifikasi Dua Pass (PASS 1 & PASS 2)
1. Jalankan **PASS 1**: Test runner, linter, dan build production.
2. Jalankan **PASS 2**: Evaluasi seluruh checklist Definition of Done di `docs/RULES.md`.
3. Laporkan hasil dengan format penutup wajib:
   ```text
   Pass 1: [hasil test, lint, build].
   Pass 2: [hasil evaluasi DoD].
   Pelanggaran ditemukan dan diperbaiki: [daftar perbaikan / tidak ada].
   ```
4. Pindahkan tugas ke status **Selesai** di [docs/TASKS.md](file:///docs/TASKS.md) dan catat di [docs/CHANGELOG.md](file:///docs/CHANGELOG.md) bagian *Added*.
