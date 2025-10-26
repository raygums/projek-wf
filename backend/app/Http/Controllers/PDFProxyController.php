<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PDFProxyController extends Controller
{
    /**
     * Proxy PDF files to avoid CORS issues
     */
    public function proxy(Request $request)
    {
        $url = $request->query('url');

        if (!$url) {
            return response()->json([
                'success' => false,
                'message' => 'URL parameter is required'
            ], 400);
        }

        // Validate URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid URL'
            ], 400);
        }

        try {
            // Fetch PDF from external URL
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                ])
                ->get($url);

            if ($response->successful()) {
                return response($response->body())
                    ->header('Content-Type', 'application/pdf')
                    ->header('Access-Control-Allow-Origin', '*')
                    ->header('Access-Control-Allow-Methods', 'GET')
                    ->header('Content-Disposition', 'inline');
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch PDF from URL'
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
