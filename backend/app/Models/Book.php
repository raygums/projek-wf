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
        'pdf_url',
        'stock'
    ];

    protected $casts = [
        'published_year' => 'integer',
        'stock' => 'integer'
    ];

    // Relationships
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Helper methods
    public function averageRating()
    {
        return $this->ratings()->avg('rating') ?? 0;
    }

    public function totalRatings()
    {
        return $this->ratings()->count();
    }

    public function totalDownloads()
    {
        return $this->downloads()->count();
    }

    public function isFavoritedBy($userId)
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }

    public function isRatedBy($userId)
    {
        return $this->ratings()->where('user_id', $userId)->exists();
    }
}
