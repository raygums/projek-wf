<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Favorite;
use App\Models\Download;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserInteractionController extends Controller
{
    // Favorites
    public function toggleFavorite(Request $request, $bookId)
    {
        $user = Auth::user();
        $book = Book::findOrFail($bookId);

        $favorite = Favorite::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'message' => 'Buku dihapus dari favorit',
                'is_favorited' => false
            ]);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'book_id' => $bookId
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Buku ditambahkan ke favorit',
                'is_favorited' => true
            ]);
        }
    }

    public function getFavorites(Request $request)
    {
        $user = Auth::user();
        $favorites = Favorite::where('user_id', $user->id)
            ->with('book')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'favorites' => $favorites
        ]);
    }

    // Downloads
    public function recordDownload(Request $request, $bookId)
    {
        $user = Auth::user();
        $book = Book::findOrFail($bookId);

        Download::create([
            'user_id' => $user->id,
            'book_id' => $bookId
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Download berhasil dicatat',
            'total_downloads' => $book->totalDownloads()
        ]);
    }

    public function getDownloads(Request $request)
    {
        $user = Auth::user();
        $downloads = Download::where('user_id', $user->id)
            ->with('book')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $downloads
        ]);
    }

    // Ratings
    public function addRating(Request $request, $bookId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000'
        ]);

        $user = Auth::user();
        $book = Book::findOrFail($bookId);

        $rating = Rating::updateOrCreate(
            [
                'user_id' => $user->id,
                'book_id' => $bookId
            ],
            [
                'rating' => $request->rating,
                'review' => $request->review
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Rating berhasil disimpan',
            'data' => $rating,
            'average_rating' => round($book->averageRating(), 1),
            'total_ratings' => $book->totalRatings()
        ]);
    }

    public function getRatings($bookId)
    {
        $book = Book::findOrFail($bookId);
        $ratings = Rating::where('book_id', $bookId)
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'ratings' => $ratings,
            'average_rating' => round($book->averageRating(), 1),
            'total_ratings' => $book->totalRatings()
        ]);
    }

    public function getUserRating($bookId)
    {
        $user = Auth::user();
        $rating = Rating::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $rating
        ]);
    }

    // Book Stats
    public function getBookStats($bookId)
    {
        $book = Book::findOrFail($bookId);
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data' => [
                'average_rating' => round($book->averageRating(), 1),
                'total_ratings' => $book->totalRatings(),
                'total_downloads' => $book->totalDownloads(),
                'is_favorited' => $user ? $book->isFavoritedBy($user->id) : false,
                'user_rating' => $user ? $book->ratings()->where('user_id', $user->id)->first() : null
            ]
        ]);
    }
}
