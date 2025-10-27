<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

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
}
