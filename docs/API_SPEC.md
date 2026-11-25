# Spesifikasi Kontrak API (API_SPEC.md)

Dokumen ini adalah **Kontrak Tunggal (Single Source of Truth)** untuk seluruh komunikasi antarmuka API (REST/JSON) antara klien (frontend, mobile, atau pihak ketiga) dan backend. Tipe data klien wajib diturunkan dari spesifikasi ini.

---

## 1. Konvensi Global API

- **Base URL**:
  - Development: `http://localhost:8000/api/v1` (atau port yang disepakati)
  - Production: `https://api.domain.com/v1`
- **Versioning**: URL prefix eksplisit (`/api/v1/`). Perubahan *breaking change* menaikkan versi menjadi `v2`.
- **Format Pertukaran Data**: `application/json; charset=utf-8` untuk seluruh request payload dan response.
- **Autentikasi**:
  - Bearer Token di header HTTP: `Authorization: Bearer <access_token>` atau via secure, httpOnly, sameSite session cookie.
- **Format Pagination Standar**:
  ```json
  {
    "data": [],
    "meta": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 120,
      "total_pages": 6
    },
    "links": {
      "next": "/api/v1/resource?page=2",
      "prev": null
    }
  }
  ```

---

## 2. Format Respons Baku

### Respons Berhasil (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {},
  "message": "Operasi berhasil dilakukan"
}
```

### Respons Validasi Gagal (HTTP 422 Unprocessable Entity)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Payload yang dikirim tidak memenuhi validasi skema",
    "details": [
      {
        "field": "email",
        "message": "Format alamat email tidak valid"
      }
    ]
  }
}
```

### Respons Error Global (HTTP 400, 401, 403, 404, 429, 500)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | RATE_LIMITED | INTERNAL_SERVER_ERROR",
    "message": "Pesan ramah untuk pengguna (tanpa stack trace atau query DB internal)"
  }
}
```

---

## 3. Spesifikasi Endpoint

### Domain: Autentikasi (`/auth`)

#### 1. Login Pengguna
- **Method**: `POST`
- **Path**: `/auth/login`
- **Otorisasi**: Publik (Tanpa Auth)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "PasswordRahasia123!"
  }
  ```
- **Response Berhasil (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "email": "user@example.com",
        "full_name": "Budi Santoso",
        "role": "user"
      }
    },
    "message": "Login berhasil"
  }
  ```
- **Response Gagal**:
  - `HTTP 401 Unauthorized`: Kredensial tidak valid.
  - `HTTP 422 Unprocessable Entity`: Field tidak lengkap.

#### 2. Profil Pengguna Saat Ini
- **Method**: `GET`
- **Path**: `/auth/me`
- **Otorisasi**: Wajib Auth (`Bearer <token>` / Valid Session)
- **Response Berhasil (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "email": "user@example.com",
      "full_name": "Budi Santoso",
      "role": "user"
    }
  }
  ```
- **Response Gagal**:
  - `HTTP 401 Unauthorized`: Token tidak ada atau kedaluwarsa.

---

### Domain: Entitas Bisnis Utama
> *Daftar endpoint bisnis aplikasi ditambahkan saat `/init-app` sesuai fitur PRD.*

`[ISI SAAT INIT-APP: Kontrak endpoint CRUD domain bisnis (Method, Path, Request, Response, Auth)]`
