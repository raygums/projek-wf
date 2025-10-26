<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserInteractionController;
use App\Http\Controllers\PDFProxyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::get('/greeting', function () {
    return response()->json([
        'message' => 'Halo dari Laravel!',
        'app' => 'Book Management System',
        'version' => '1.0.0',
        'framework' => 'Laravel + React'
    ]);
});

// PDF Proxy route (to avoid CORS issues)
Route::get('/pdf-proxy', [PDFProxyController::class, 'proxy']);

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Public book routes (read-only)
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/books-genres', [BookController::class, 'genres']);
Route::get('/books-statistics', [BookController::class, 'statistics']);

// Protected book routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Admin only routes - untuk CRUD buku
    Route::middleware('admin')->group(function () {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);
    });
    
    // User Interaction routes (all authenticated users)
    // Favorites
    Route::post('/books/{id}/favorite', [UserInteractionController::class, 'toggleFavorite']);
    Route::get('/favorites', [UserInteractionController::class, 'getFavorites']);
    
    // Downloads
    Route::post('/books/{id}/download', [UserInteractionController::class, 'recordDownload']);
    Route::get('/downloads', [UserInteractionController::class, 'getDownloads']);
    
    // Ratings
    Route::post('/books/{id}/rating', [UserInteractionController::class, 'addRating']);
    Route::get('/books/{id}/ratings', [UserInteractionController::class, 'getRatings']);
    Route::get('/books/{id}/user-rating', [UserInteractionController::class, 'getUserRating']);
    
    // Book statistics (requires auth to show user-specific data like is_favorited)
    Route::get('/books/{id}/stats', [UserInteractionController::class, 'getBookStats']);
});
