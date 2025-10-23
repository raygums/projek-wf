# Book Management System - Laravel + React

Aplikasi manajemen buku berbasis web menggunakan Laravel sebagai backend dan React sebagai frontend.

## 🚀 Features

### Core Features
- ✅ CRUD Operations untuk buku (Create, Read, Update, Delete)
- ✅ 100 data buku sample menggunakan Faker
- ✅ Search & Filter berdasarkan title, author, ISBN, dan genre
- ✅ Pagination
- ✅ Statistics Dashboard

### Nilai Tambah
- 🔐 **Authentication menggunakan Laravel Sanctum**
  - Register dengan validasi
  - Login/Logout
  - Protected routes untuk Create, Update, Delete
  
- 📧 **Email Notification**
  - Welcome email saat registrasi
  - Email template yang profesional

### Additional Features
- 📊 Real-time statistics (Total books, stock, value, genres)
- 🎨 Modern UI dengan responsive design
- 🔍 Advanced search dan filter
- 📱 Mobile-friendly interface
- 💰 Manajemen harga dan stok
- 🖼️ Cover image untuk setiap buku

## 📁 Struktur Project

```
projek_wf/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   └── BookController.php
│   │   ├── Models/
│   │   │   ├── Book.php
│   │   │   └── User.php
│   │   └── Mail/
│   │       └── WelcomeEmail.php
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 2025_10_19_125504_create_books_table.php
│   │   └── seeders/
│   │       ├── BookSeeder.php
│   │       └── DatabaseSeeder.php
│   └── routes/
│       └── api.php
│
└── frontend/             # React App
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── BookList.jsx
        │   ├── BookCard.jsx
        │   └── AddBook.jsx
        ├── App.jsx
        └── App.css
```

## 🛠️ Installation

### Backend Setup (Laravel)

1. Install dependencies:
```bash
cd backend
composer install
```

2. Install Laravel Sanctum:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

3. Copy .env file:
```bash
copy .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_management
DB_USERNAME=root
DB_PASSWORD=
```

6. Configure mail di `.env` (untuk email notification):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

7. Run migrations dan seeder (100 buku):
```bash
php artisan migrate
php artisan db:seed
```

8. Start Laravel server:
```bash
php artisan serve
```

### Frontend Setup (React)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## 📋 API Routes

### Public Routes

```
GET  /api/greeting              # Welcome message
GET  /api/books                 # List semua buku (dengan pagination)
GET  /api/books/{id}            # Detail buku
GET  /api/books-genres          # List semua genre
GET  /api/books-statistics      # Statistik buku
```

### Authentication Routes

```
POST /api/auth/register         # Register user baru (+ kirim welcome email)
POST /api/auth/login            # Login user
POST /api/auth/logout           # Logout (protected)
GET  /api/auth/me               # Get user info (protected)
```

### Protected Routes (Requires Authentication)

```
POST   /api/books               # Tambah buku baru
PUT    /api/books/{id}          # Update buku
DELETE /api/books/{id}          # Hapus buku
```

## 🎯 API Parameters

### GET /api/books
Query parameters:
- `page` - Nomor halaman (default: 1)
- `per_page` - Jumlah data per halaman (default: 10)
- `search` - Cari berdasarkan title, author, atau ISBN
- `genre` - Filter berdasarkan genre

Example:
```
GET /api/books?page=1&per_page=12&search=harry&genre=Fantasy
```

## 📦 Plugin & Package yang Digunakan

### Backend (Laravel)
- **laravel/framework**: ^12.0 - Core framework
- **laravel/sanctum**: Authentication system (NILAI TAMBAH)
- **fakerphp/faker**: Generate sample data untuk 100 buku

### Frontend (React)
- **react**: ^19.1.1 - UI Library
- **axios**: ^1.12.2 - HTTP client untuk API calls
- **vite**: Build tool

## 💾 Database Schema

### Books Table
```sql
- id (bigint, primary key, auto increment)
- title (varchar)
- author (varchar)
- published_year (integer)
- isbn (varchar, unique, nullable)
- genre (varchar, nullable)
- description (text, nullable)
- cover_image (varchar, nullable)
- stock (integer, default: 0)
- price (decimal(10,2), default: 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### Users Table (untuk authentication)
```sql
- id (bigint, primary key, auto increment)
- name (varchar)
- email (varchar, unique)
- password (varchar, hashed)
- created_at (timestamp)
- updated_at (timestamp)
```

## 👤 Default Users

Setelah seeding, tersedia 2 user:

1. **Admin User**
   - Email: admin@example.com
   - Password: password

2. **Test User**
   - Email: test@example.com
   - Password: password

## 🎨 Fitur Unggulan

### 1. Authentication System (NILAI TAMBAH - 30 poin)
- Register dengan validasi
- Login/Logout menggunakan Laravel Sanctum
- Token-based authentication
- Protected routes untuk operasi sensitive

### 2. Email Notification (NILAI TAMBAH)
- Welcome email otomatis saat register
- Template email HTML yang profesional
- Menggunakan Laravel Mail system

### 3. Advanced Search & Filter
- Real-time search
- Filter berdasarkan genre
- Pagination untuk performa optimal

### 4. Modern UI/UX
- Responsive design
- Gradient background
- Smooth animations
- Card-based layout
- Modal untuk edit

### 5. Statistics Dashboard
- Total buku
- Total stok
- Total value
- Total genre

## 🔧 Troubleshooting

### CORS Error
Pastikan di `backend/config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Email tidak terkirim
- Gunakan Mailtrap untuk testing
- Atau configure Gmail SMTP dengan App Password
- Check `.env` konfigurasi MAIL_*

## 📝 Catatan untuk Presentasi

1. **File Migration**: `backend/database/migrations/2025_10_19_125504_create_books_table.php`
2. **Manipulasi Data (100 buku)**: `backend/database/seeders/BookSeeder.php`
3. **Route API**: `backend/routes/api.php`
4. **Plugin Package**: Lihat composer.json dan package.json
5. **File React**: Semua ada di `frontend/src/components/`

## 🎬 Demo

1. Jalankan backend: `php artisan serve`
2. Jalankan frontend: `npm run dev`
3. Buka browser: http://localhost:5173
4. Demo flow:
   - Lihat list buku (public)
   - Register user baru (dapat welcome email)
   - Login
   - Tambah buku baru
   - Edit buku
   - Hapus buku
   - Logout

## 📊 Nilai Maksimal

✅ CRUD Buku - 40 poin
✅ Migration & Seeder - 10 poin
✅ API Routes - 10 poin
✅ React Frontend - 10 poin
✅ **Authentication (Sanctum) - 30 poin BONUS**
✅ **Email Notification - BONUS**

**Total: 100+ poin** 🎉

## 👨‍💻 Author

Developed for Web Framework Final Project
