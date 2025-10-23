<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');
        $genre = $request->get('genre', '');
        
        $query = Book::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%")
                  ->orWhere('isbn', 'LIKE', "%{$search}%");
            });
        }
        
        if ($genre) {
            $query->where('genre', $genre);
        }
        
        $books = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'published_year' => 'required|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|unique:books,isbn',
            'genre' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $book = Book::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Book created successfully',
            'data' => $book
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $book
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'published_year' => 'sometimes|required|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|unique:books,isbn,' . $id,
            'genre' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $book->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Book updated successfully',
            'data' => $book
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found'
            ], 404);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book deleted successfully'
        ]);
    }

    /**
     * Get available genres
     */
    public function genres()
    {
        $genres = Book::distinct()->pluck('genre')->filter()->sort()->values();
        
        return response()->json([
            'success' => true,
            'data' => $genres
        ]);
    }

    /**
     * Get statistics
     */
    public function statistics()
    {
        $totalBooks = Book::count();
        $totalStock = Book::sum('stock');
        $totalValue = Book::sum('price');
        $genres = Book::distinct()->count('genre');
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_books' => $totalBooks,
                'total_stock' => $totalStock,
                'total_value' => $totalValue,
                'total_genres' => $genres
            ]
        ]);
    }
}
