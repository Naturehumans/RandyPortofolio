# Scratch Directory

Direktori ini digunakan khusus untuk kebutuhan eksplorasi sementara selama proses pengembangan (vibe coding).

## Aturan Penggunaan Direktori Scratch

1. **Tujuan**:
   - Eksperimen kode cepat
   - Pembuatan prototipe fungsionalitas liar
   - Catatan debug dan investigasi masalah
   - Dump data atau payload testing sementara

2. **Git & Versi**:
   - Seluruh isi direktori `scratch/*` masuk ke dalam `.gitignore`, **kecuali** file `README.md` ini.
   - Jangan pernah melakukan commit file kerja di folder ini ke repositori publik/tim.

3. **Larangan Impor (Strict)**:
   - **DILARANG KERAS** mengimpor kode, modul, atau artefak dari `scratch/` ke dalam kode aplikasi utama (`backend/`, `frontend/`, dsb.).
   - Kode aplikasi tidak boleh memiliki ketergantungan apa pun pada folder ini.

4. **Promosi Kode**:
   - Eksperimen yang terbukti layak dan ingin digunakan dalam aplikasi utama **wajib** dipindahkan ke lokasi resmi sesuai [docs/STRUCTURE.md](file:///docs/STRUCTURE.md) dan ditulis ulang sesuai standar kualitas [docs/RULES.md](file:///docs/RULES.md).

5. **Sanitasi Sebelum Rilis**:
   - Sebelum rilis ke staging/production, seluruh file di dalam `scratch/` harus dibersihkan dari token, secret, dan kredensial.

*Panduan lengkap arsitektur dan aturan scratch dapat dibaca di [docs/STRUCTURE_DETAIL.md](file:///docs/STRUCTURE_DETAIL.md).*
