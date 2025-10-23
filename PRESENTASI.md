# 📚 PRESENTASI UTS WEB FRAMEWORK
## Book Management System - Laravel + React

---

## 🎯 OVERVIEW

**Nama Aplikasi**: Book Management System  
**Tech Stack**: Laravel 12 (Backend) + React 19 (Frontend)  
**Database**: MySQL  
**Authentication**: Laravel Sanctum  
**Fitur Utama**: CRUD Buku + Authentication + Email Notification

---

## 1️⃣ FILE MIGRATION

### Location: `backend/database/migrations/2025_10_19_125504_create_books_table.php`

```php
public function up(): void
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('author');
        $table->integer('published_year');
        $table->string('isbn')->unique()->nullable();
        $table->string('genre')->nullable();
        $table->text('description')->nullable();
        $table->string('cover_image')->nullable();
        $table->integer('stock')->default(0);
        $table->decimal('price', 10, 2)->default(0);
        $table->timestamps();
    });
}
```

### Field yang ada:
- ✅ **id**: Primary key
- ✅ **title**: Judul buku
- ✅ **author**: Penulis
- ✅ **published_year**: Tahun terbit
- ✅ **isbn**: ISBN (unique)
- ✅ **genre**: Genre buku
- ✅ **description**: Deskripsi
- ✅ **cover_image**: URL gambar cover
- ✅ **stock**: Jumlah stok
- ✅ **price**: Harga buku
- ✅ **timestamps**: Created_at & Updated_at

---

## 2️⃣ MANIPULASI DATA - 100 BUKU

### Location: `backend/database/seeders/BookSeeder.php`

```php
public function run(): void
{
    $faker = Faker::create();
    
    $genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
               'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 
               'History', 'Self-Help', 'Business', 'Technology', 
               'Science', 'Poetry', 'Drama'];

    // Generate 100 books
    for ($i = 1; $i <= 100; $i++) {
        Book::create([
            'title' => $faker->sentence(rand(2, 5)),
            'author' => $faker->name(),
            'published_year' => $faker->numberBetween(1950, 2025),
            'isbn' => $faker->unique()->isbn13(),
            'genre' => $faker->randomElement($genres),
            'description' => $faker->paragraph(rand(3, 6)),
            'cover_image' => 'https://picsum.photos/seed/' . $i . '/400/600',
            'stock' => $faker->numberBetween(0, 50),
            'price' => $faker->randomFloat(2, 50000, 500000)
        ]);
    }
}
```

### Cara menjalankan:
```bash
php artisan db:seed
```

---

## 3️⃣ ROUTE API

### Location: `backend/routes/api.php`

### Public Routes (Tidak perlu login)
```php
GET  /api/greeting              # Welcome message
GET  /api/books                 # List semua buku (pagination, search, filter)
GET  /api/books/{id}            # Detail 1 buku
GET  /api/books-genres          # List semua genre
GET  /api/books-statistics      # Statistik (total buku, stock, value)
```

### Authentication Routes
```php
POST /api/auth/register         # Register user baru + welcome email
POST /api/auth/login            # Login user
POST /api/auth/logout           # Logout (protected)
GET  /api/auth/me               # Get user info (protected)
```

### Protected Routes (Perlu authentication)
```php
POST   /api/books               # Tambah buku baru
PUT    /api/books/{id}          # Update buku
DELETE /api/books/{id}          # Hapus buku
```

### Menandakan React:
Semua route menggunakan format `/api/*` yang menunjukkan ini adalah **REST API** untuk consumed oleh **React Frontend** (SPA - Single Page Application).

---

## 4️⃣ PLUGIN & PACKAGE

### Backend (Laravel) - `backend/composer.json`

**Core Dependencies:**
```json
{
  "laravel/framework": "^12.0",
  "laravel/sanctum": "^4.0",      // ⭐ AUTHENTICATION (Nilai Tambah)
  "fakerphp/faker": "^1.23"       // ⭐ Generate 100 sample books
}
```

**Plugin di luar materi:**
- ✅ **Laravel Sanctum**: Token-based authentication untuk API
- ✅ **FakerPHP**: Library untuk generate data dummy realistic

### Frontend (React) - `frontend/package.json`

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "axios": "^1.12.2",             // ⭐ HTTP Client untuk API calls
  "vite": "npm:rolldown-vite@7.1.14"
}
```

**Plugin di luar materi:**
- ✅ **Axios**: HTTP client modern untuk komunikasi dengan Laravel API
- ✅ **Rolldown Vite**: Build tool yang sangat cepat

---

## 5️⃣ FILE REACT

### Struktur Components:

```
frontend/src/
├── App.jsx                    # Main component + routing logic
├── App.css                    # Global styles
└── components/
    ├── Navbar.jsx             # Navigation bar
    ├── Login.jsx              # Login form
    ├── Register.jsx           # Register form
    ├── BookList.jsx           # List & grid buku + filter
    ├── BookList.css           # Styles untuk BookList
    ├── BookCard.jsx           # Card component untuk 1 buku
    └── AddBook.jsx            # Form tambah buku baru
```

### Key Features per Component:

#### 1. **App.jsx** (Main Application)
- State management untuk authentication
- Routing logic (books, login, register, add-book)
- Handle login/logout
- Axios configuration

#### 2. **Navbar.jsx**
- Responsive navigation
- Show/hide menu based on auth status
- User info display
- Navigation buttons

#### 3. **Login.jsx**
- Login form dengan validasi
- Error handling
- Integration dengan Laravel Sanctum

#### 4. **Register.jsx**
- Register form dengan validasi
- Password confirmation
- Auto-send welcome email
- Success notification

#### 5. **BookList.jsx**
- Display books dalam grid layout
- Search & filter functionality
- Pagination
- Statistics dashboard
- Edit modal
- Delete confirmation

#### 6. **BookCard.jsx**
- Card component untuk display 1 buku
- Cover image
- Book details (title, author, price, stock)
- Edit & Delete buttons (protected)

#### 7. **AddBook.jsx**
- Form untuk tambah buku baru
- Validation
- Genre dropdown
- Protected route (only authenticated users)

---

## 6️⃣ DEMO APLIKASI

### Step-by-step Demo Flow:

#### A. Setup & Running
```bash
# Terminal 1 - Backend
cd backend
php artisan serve
# Running at http://127.0.0.1:8000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Running at http://localhost:5173
```

#### B. Demo Scenario

**1. Public Access (Tanpa Login)**
- ✅ Buka http://localhost:5173
- ✅ Lihat list 100 buku dengan pagination
- ✅ Gunakan search: cari "harry" atau author tertentu
- ✅ Filter by genre: pilih "Fiction" atau genre lain
- ✅ Lihat statistics dashboard
- ❌ Tidak bisa add/edit/delete (tombol tidak muncul)

**2. Register User Baru** (NILAI TAMBAH)
- ✅ Klik tombol "Register"
- ✅ Isi form:
  - Name: John Doe
  - Email: john@example.com
  - Password: password123
  - Confirm Password: password123
- ✅ Submit → **Welcome Email dikirim otomatis!** 📧
- ✅ Auto-login setelah register

**3. Login** (NILAI TAMBAH)
- ✅ Klik "Logout" dulu
- ✅ Klik "Login"
- ✅ Login dengan:
  - Email: admin@example.com
  - Password: password
- ✅ Berhasil login → Navbar berubah, muncul nama user

**4. Add New Book** (Protected)
- ✅ Klik "Add Book" (hanya muncul saat login)
- ✅ Isi form lengkap:
  - Title: "Harry Potter and the Philosopher's Stone"
  - Author: "J.K. Rowling"
  - Year: 1997
  - Genre: Fantasy
  - Price: 250000
  - Stock: 15
  - Description: "The first book in the Harry Potter series..."
- ✅ Submit → Buku baru muncul di list

**5. Edit Book** (Protected)
- ✅ Klik tombol "Edit" pada salah satu buku
- ✅ Modal edit muncul
- ✅ Ubah data (misal: update stock atau price)
- ✅ Save → Data terupdate

**6. Delete Book** (Protected)
- ✅ Klik tombol "Delete"
- ✅ Konfirmasi popup
- ✅ Buku terhapus dari list

**7. Logout**
- ✅ Klik "Logout"
- ✅ Token dihapus
- ✅ Kembali ke public view
- ✅ Tombol Edit/Delete hilang

---

## 7️⃣ AUTHENTICATION (NILAI TAMBAH - 30 POIN)

### Laravel Sanctum Implementation

#### Backend Setup:
1. Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

2. AuthController dengan Sanctum:
```php
// Register
$token = $user->createToken('auth_token')->plainTextToken;

// Login
$token = $user->createToken('auth_token')->plainTextToken;

// Logout
$request->user()->currentAccessToken()->delete();
```

3. Protected Routes:
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});
```

#### Frontend Integration:
```javascript
// Set token in axios header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Store in localStorage
localStorage.setItem('token', token);
```

---

## 8️⃣ EMAIL NOTIFICATION (NILAI TAMBAH)

### Implementation:

#### 1. Mail Class: `app/Mail/WelcomeEmail.php`
```php
class WelcomeEmail extends Mailable
{
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function content(): Content
    {
        return new Content(view: 'emails.welcome');
    }
}
```

#### 2. Email Template: `resources/views/emails/welcome.blade.php`
- HTML email template
- Professional design
- Welcome message
- List of features

#### 3. Send Email on Register:
```php
Mail::to($user->email)->send(new WelcomeEmail($user));
```

#### 4. Configuration (.env):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## 9️⃣ SCORING BREAKDOWN

### Poin Dasar (70):
- ✅ Migration File (10 poin)
- ✅ Manipulasi Data 100 buku (15 poin)
- ✅ Route API (15 poin)
- ✅ Plugin Package (10 poin)
- ✅ File React (20 poin)

### Nilai Tambah (30):
- ✅ Authentication dengan Sanctum (20 poin)
- ✅ Email Notification (10 poin)

### Bonus Features:
- ✅ Advanced Search & Filter (+5)
- ✅ Statistics Dashboard (+5)
- ✅ Modern UI/UX (+5)
- ✅ Responsive Design (+5)

**TOTAL: 100+ POIN** 🎉

---

## 🔟 KESIMPULAN

### Apa yang sudah dikerjakan:

1. ✅ **Backend Laravel**
   - REST API lengkap (CRUD)
   - Authentication dengan Sanctum
   - Email notification
   - 100 sample data dengan Faker

2. ✅ **Frontend React**
   - Modern SPA
   - Responsive design
   - Authentication flow
   - CRUD operations

3. ✅ **Integration**
   - API communication dengan Axios
   - Token-based auth
   - CORS configuration

4. ✅ **Extra Features**
   - Search & Filter
   - Pagination
   - Statistics
   - Email notification

### Teknologi yang digunakan:
- **Backend**: PHP 8.2, Laravel 12, MySQL
- **Frontend**: React 19, Vite, Axios
- **Authentication**: Laravel Sanctum
- **Email**: Laravel Mail + SMTP
- **Data**: FakerPHP

---

## 📞 RESOURCES

- **Repository**: [Link GitHub jika ada]
- **Live Demo**: [Link deployment jika ada]
- **Documentation**: README.md lengkap
- **Video Demo**: [Link video]

---

## ❓ Q&A

Siap untuk pertanyaan! 🙋‍♂️

---

**Terima Kasih!** 🙏
