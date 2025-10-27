<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserInteractionController;
use App\Http\Controllers\PDFProxyController;
use App\Http\Controllers\UserController;

Route::get('/greeting', function () {
    return response()->json([
        'message' => 'Halo dari Laravel!',
        'app' => 'Book Management System',
        'version' => '1.0.0',
        'framework' => 'Laravel + React'
    ]);
});

Route::get('/pdf-proxy', [PDFProxyController::class, 'proxy']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/books-genres', [BookController::class, 'genres']);
Route::get('/books-statistics', [BookController::class, 'statistics']);

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('admin')->group(function () {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);
        
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
    
    Route::post('/books/{id}/favorite', [UserInteractionController::class, 'toggleFavorite']);
    Route::get('/favorites', [UserInteractionController::class, 'getFavorites']);
    
    Route::post('/books/{id}/download', [UserInteractionController::class, 'recordDownload']);
    Route::get('/downloads', [UserInteractionController::class, 'getDownloads']);
    
    Route::post('/books/{id}/rating', [UserInteractionController::class, 'addRating']);
    Route::get('/books/{id}/ratings', [UserInteractionController::class, 'getRatings']);
    Route::get('/books/{id}/user-rating', [UserInteractionController::class, 'getUserRating']);
    
    Route::get('/books/{id}/stats', [UserInteractionController::class, 'getBookStats']);
});
