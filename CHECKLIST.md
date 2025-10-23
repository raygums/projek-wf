# ✅ CHECKLIST PENGUMPULAN UTS

## 📋 Persiapan Sebelum Demo

### Backend
- [ ] Install Laravel Sanctum: `composer require laravel/sanctum`
- [ ] Publish Sanctum: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- [ ] Copy .env: `copy .env.example .env`
- [ ] Generate key: `php artisan key:generate`
- [ ] Setup database di .env
- [ ] Setup email di .env (untuk welcome email)
- [ ] Jalankan migration: `php artisan migrate:fresh`
- [ ] Jalankan seeder: `php artisan db:seed`
- [ ] Test API: http://127.0.0.1:8000/api/greeting

### Frontend
- [ ] Install dependencies: `npm install`
- [ ] Check axios baseURL di App.jsx
- [ ] Test development: `npm run dev`
- [ ] Test di browser: http://localhost:5173

---

## 📦 Yang Harus Ditampilkan (Sesuai Instruksi Dosen)

### 1. File Migration ✅
**File**: `backend/database/migrations/2025_10_19_125504_create_books_table.php`

**Apa yang ditampilkan:**
- Schema lengkap dengan semua field
- Field yang ditambahkan: isbn, genre, description, cover_image, stock, price
- Jelaskan setiap field dan tipe datanya

**Demo:**
```bash
# Tampilkan isi migration
cat backend/database/migrations/2025_10_19_125504_create_books_table.php

# Atau buka di editor
code backend/database/migrations/2025_10_19_125504_create_books_table.php
```

---

### 2. Manipulasi Data (100 Buku) ✅
**File**: `backend/database/seeders/BookSeeder.php`

**Apa yang ditampilkan:**
- Kode seeder yang generate 100 buku
- Penggunaan Faker untuk data realistic
- List genre yang tersedia

**Demo:**
```bash
# Tampilkan isi seeder
cat backend/database/seeders/BookSeeder.php

# Jalankan seeder
php artisan db:seed

# Cek di database atau via API
curl http://127.0.0.1:8000/api/books-statistics
```

**Hasil yang diharapkan:**
- 100 buku tergenerate
- Data random tapi realistic
- Berbagai genre

---

### 3. Route API ✅
**File**: `backend/routes/api.php`

**Apa yang ditampilkan:**
- Semua route API yang tersedia
- Public routes vs Protected routes
- Authentication routes

**Menandakan menggunakan React:**
- Semua route dalam format `/api/*`
- REST API untuk SPA (Single Page Application)
- JSON response format
- Token-based authentication (Sanctum)

**Demo:**
```bash
# Test public API
curl http://127.0.0.1:8000/api/greeting
curl http://127.0.0.1:8000/api/books?per_page=5

# Test authentication flow
# 1. Register
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password","password_confirmation":"password"}'

# 2. Login (dapat token)
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

### 4. Plugin Package ✅

**Backend Plugins** (`backend/composer.json`):
```json
{
  "laravel/framework": "^12.0",           // Core framework
  "laravel/sanctum": "^4.0",              // 🌟 AUTHENTICATION
  "fakerphp/faker": "^1.23"               // 🌟 GENERATE DATA
}
```

**Frontend Plugins** (`frontend/package.json`):
```json
{
  "react": "^19.1.1",                     // UI Library
  "axios": "^1.12.2",                     // 🌟 HTTP CLIENT
  "vite": "npm:rolldown-vite@7.1.14"     // 🌟 BUILD TOOL
}
```

**Plugin di Luar Subjek:**
1. **Laravel Sanctum** - Authentication system (NILAI TAMBAH)
2. **FakerPHP** - Generate realistic fake data
3. **Axios** - Modern HTTP client untuk API calls
4. **Rolldown Vite** - Ultra-fast build tool

**Demo:**
```bash
# Tampilkan composer.json
cat backend/composer.json | grep -A 5 "require"

# Tampilkan package.json
cat frontend/package.json | grep -A 10 "dependencies"
```

---

### 5. File React ✅
**Location**: `frontend/src/`

**Struktur yang ditampilkan:**
```
src/
├── App.jsx                    # Main app + routing
├── App.css                    # Global styles
└── components/
    ├── Navbar.jsx             # Navigation
    ├── Login.jsx              # Login form
    ├── Register.jsx           # Register form
    ├── BookList.jsx           # List buku + filter
    ├── BookList.css           # Styles
    ├── BookCard.jsx           # Card component
    └── AddBook.jsx            # Form tambah buku
```

**Fitur React yang digunakan:**
- ✅ React Hooks (useState, useEffect)
- ✅ Component-based architecture
- ✅ Props & State management
- ✅ Conditional rendering
- ✅ Event handling
- ✅ API integration dengan Axios
- ✅ Form handling & validation

**Demo:**
```bash
# Tampilkan struktur
tree frontend/src/components

# Buka di editor
code frontend/src/App.jsx
code frontend/src/components/BookList.jsx
```

---

### 6. Demo Aplikasi ✅

**Skenario Demo (15 menit):**

#### A. Public Access (3 menit)
1. Buka http://localhost:5173
2. Tunjukkan 100 buku dengan pagination
3. Demo search functionality
4. Demo filter by genre
5. Tunjukkan statistics dashboard
6. Jelaskan: tombol Edit/Delete tidak muncul (perlu login)

#### B. Authentication - Register (3 menit)
1. Klik tombol "Register"
2. Isi form dengan data test
3. Submit → Tunjukkan **welcome email terkirim** (cek Mailtrap/Gmail)
4. User otomatis login
5. Navbar berubah, muncul nama user

#### C. Authentication - Login (2 menit)
1. Logout dulu
2. Login dengan admin@example.com / password
3. Berhasil login
4. Tombol "Add Book" muncul

#### D. CRUD Operations (5 menit)

**Create:**
1. Klik "Add Book"
2. Isi form lengkap
3. Submit → Buku baru muncul

**Read:**
1. Scroll list buku
2. Lihat detail di card
3. Test pagination

**Update:**
1. Klik "Edit" pada buku
2. Modal muncul
3. Ubah data (stock/price)
4. Save → Data terupdate

**Delete:**
1. Klik "Delete"
2. Konfirmasi
3. Buku hilang dari list

#### E. Features Highlight (2 menit)
1. Real-time search
2. Genre filter
3. Statistics update
4. Responsive design
5. Error handling

---

## 🌟 NILAI TAMBAH yang Harus Dijelaskan

### 1. Authentication (30 poin BONUS)
**Yang ditampilkan:**
- Laravel Sanctum setup
- Token-based authentication
- Protected routes
- Login/Register flow
- Logout functionality

**Kode yang ditunjukkan:**
- `app/Http/Controllers/AuthController.php`
- Middleware auth:sanctum di routes
- Frontend token management di App.jsx

### 2. Email Notification (BONUS)
**Yang ditampilkan:**
- Welcome email saat register
- Email template profesional
- SMTP configuration

**Kode yang ditunjukkan:**
- `app/Mail/WelcomeEmail.php`
- `resources/views/emails/welcome.blade.php`
- Send email di AuthController

**Demo email:**
- Buka Mailtrap atau Gmail
- Tunjukkan email yang masuk
- Tunjukkan isi email yang formatted

---

## 📹 VIDEO DEMO (Yang Direkam)

**Durasi**: 10-15 menit

**Outline Video:**
1. **Opening (30 detik)**
   - Perkenalan
   - Tech stack overview

2. **Code Review (5 menit)**
   - Migration file
   - Seeder (100 buku)
   - API Routes
   - Plugin packages
   - React components

3. **Live Demo (7 menit)**
   - Public access
   - Register (+ tunjukkan email)
   - Login
   - CRUD operations
   - Features showcase

4. **Bonus Features (2 menit)**
   - Authentication flow
   - Email notification
   - Extra features

5. **Closing (30 detik)**
   - Summary
   - Thank you

---

## 📊 PPT (PowerPoint)

**Slide Structure (10-15 slides):**

1. **Cover**
   - Judul: Book Management System
   - Nama & NIM
   - Tech Stack logos

2. **Overview**
   - Apa itu aplikasi ini?
   - Tech stack
   - Key features

3. **Architecture**
   - Backend: Laravel API
   - Frontend: React SPA
   - Database: MySQL
   - Authentication: Sanctum

4. **Migration**
   - Screenshot migration file
   - Schema diagram
   - Field explanation

5. **Data Seeding**
   - Screenshot seeder code
   - 100 buku sample
   - Faker usage

6. **API Routes**
   - List semua routes
   - Public vs Protected
   - Authentication routes

7. **Plugins & Packages**
   - Backend: Sanctum, Faker
   - Frontend: Axios
   - Why each plugin?

8. **React Components**
   - Component structure
   - Screenshot code
   - Component diagram

9. **Demo Screenshots**
   - Home page
   - Login/Register
   - Book list
   - Add/Edit form

10. **Authentication**
    - Sanctum flow diagram
    - Login/Register process
    - Token management

11. **Email Notification**
    - Email template screenshot
    - SMTP configuration
    - When email sent

12. **Features**
    - CRUD operations
    - Search & Filter
    - Pagination
    - Statistics

13. **Challenges & Solutions**
    - CORS handling
    - Authentication flow
    - Email setup

14. **Future Improvements**
    - Upload image
    - Book categories
    - User roles
    - etc.

15. **Thank You**
    - Contact info
    - Q&A

---

## 📝 LAPORAN (Written Report)

**Struktur Laporan (10-20 halaman):**

### BAB 1: PENDAHULUAN
- Latar Belakang
- Tujuan
- Ruang Lingkup

### BAB 2: LANDASAN TEORI
- Laravel Framework
- React Library
- REST API
- Authentication
- MySQL

### BAB 3: ANALISIS & DESAIN
- Requirement Analysis
- Database Design (ERD)
- API Design
- UI/UX Design

### BAB 4: IMPLEMENTASI
- Backend Implementation
  - Migration
  - Seeder
  - Controllers
  - Routes
  - Authentication
  - Email
- Frontend Implementation
  - Components
  - State Management
  - API Integration
  - UI/UX

### BAB 5: TESTING & HASIL
- Unit Testing
- Integration Testing
- User Testing
- Screenshots
- Performance

### BAB 6: PENUTUP
- Kesimpulan
- Saran

### LAMPIRAN
- Source Code
- Database Schema
- API Documentation
- User Manual

---

## 📧 EMAIL PENGUMPULAN

**Subject**: [UTS Web Framework] - [Nama Lengkap] - [NIM]

**Body**:
```
Yth. Bapak Mahen,

Bersama ini saya lampirkan tugas UTS Web Framework dengan rincian:

Nama: [Nama Lengkap]
NIM: [NIM]
Aplikasi: Book Management System (Laravel + React)

File yang dilampirkan:
1. PPT Presentasi (PDF/PPTX)
2. Laporan (PDF)
3. Video Demo (Link Google Drive/YouTube)
4. Source Code (Link GitHub)

Tech Stack:
- Backend: Laravel 12 + MySQL
- Frontend: React 19
- Authentication: Laravel Sanctum
- Email: Laravel Mail

Fitur Utama:
✅ CRUD Buku (100 sample data)
✅ Authentication (Sanctum)
✅ Email Notification
✅ Search & Filter
✅ Statistics Dashboard

Link:
- Repository: [GitHub Link]
- Video Demo: [YouTube/Drive Link]
- Live Demo (optional): [Deployment Link]

Terima kasih.

Hormat saya,
[Nama Lengkap]
```

---

## ⏰ TIMELINE PENGERJAAN

**Deadline: 27 Oktober 2025, 23:59**
**Penalty: -1 poin per menit keterlambatan**

### Hari 1-2 (19-20 Oktober):
- [x] Setup project
- [x] Migration & seeder
- [x] API routes
- [x] Authentication

### Hari 3-4 (21-22 Oktober):
- [x] React components
- [x] Integration testing
- [x] Email notification

### Hari 5 (23 Oktober):
- [ ] Testing menyeluruh
- [ ] Bug fixing
- [ ] UI/UX polish

### Hari 6 (24 Oktober):
- [ ] Video recording
- [ ] Video editing

### Hari 7 (25 Oktober):
- [ ] PPT creation
- [ ] Laporan writing

### Hari 8 (26 Oktober):
- [ ] Final review
- [ ] Practice presentation

### Hari 9 (27 Oktober):
- [ ] Submit sebelum 23:59
- [ ] Backup ke beberapa tempat

---

## 🚀 TIPS PRESENTASI

### Do's ✅
- Bicara jelas dan percaya diri
- Tunjukkan kode yang clean
- Jelaskan fitur dengan detail
- Demo secara live (bukan screenshot)
- Highlight nilai tambah (auth + email)
- Jawab pertanyaan dengan tenang

### Don'ts ❌
- Jangan baca slide terus
- Jangan terlalu cepat
- Jangan skip error handling
- Jangan lupa demo email
- Jangan lupakan 100 buku
- Jangan telat submit!

---

## 📞 TROUBLESHOOTING

### Masalah Umum & Solusi

**1. CORS Error**
```php
// backend/config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

**2. Migration Error**
```bash
php artisan migrate:fresh
php artisan db:seed
```

**3. Email tidak kirim**
- Check .env MAIL_* configuration
- Gunakan Mailtrap untuk testing
- Test dengan `php artisan tinker`

**4. Authentication Error**
```php
// Pastikan Sanctum terinstall
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**5. React tidak connect ke API**
```javascript
// Cek App.jsx
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
```

---

## ✅ FINAL CHECKLIST SEBELUM SUBMIT

- [ ] Semua kode berjalan tanpa error
- [ ] 100 buku tergenerate di database
- [ ] Authentication berfungsi (login/register/logout)
- [ ] Email notification terkirim
- [ ] CRUD operations lengkap
- [ ] Search & filter berfungsi
- [ ] UI responsive dan menarik
- [ ] PPT sudah dibuat (10-15 slides)
- [ ] Laporan sudah ditulis (10-20 halaman)
- [ ] Video sudah direkam (10-15 menit)
- [ ] Source code di GitHub
- [ ] README.md lengkap
- [ ] Email pengumpulan sudah disiapkan
- [ ] Submit sebelum 27 Oktober 23:59

---

## 🎉 SELAMAT MENGERJAKAN!

**Semangat!** Aplikasi sudah 90% selesai, tinggal:
1. Install Sanctum
2. Setup email configuration
3. Test semua fitur
4. Buat PPT & Laporan
5. Record video
6. Submit!

**Good luck!** 🍀
