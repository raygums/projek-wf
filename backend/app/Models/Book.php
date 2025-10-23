<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'published_year',
        'isbn',
        'genre',
        'description',
        'cover_image',
        'stock',
        'price'
    ];

    protected $casts = [
        'published_year' => 'integer',
        'stock' => 'integer',
        'price' => 'decimal:2'
    ];
}
