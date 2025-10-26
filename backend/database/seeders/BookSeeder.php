<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        $genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 
                   'Romance', 'Horror', 'Biography', 'History', 'Self-Help', 'Business', 
                   'Technology', 'Science', 'Poetry', 'Drama'];

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
                'pdf_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'stock' => $faker->numberBetween(0, 50)
            ]);
        }
    }
}
