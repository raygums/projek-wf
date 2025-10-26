import { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoriteButton.css';

function FavoriteButton({ bookId, onToggle }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    // Check if book is already favorited
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!token) return;
            
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/books/${bookId}/stats`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setIsFavorited(response.data.is_favorited);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [bookId, token]);

    const handleToggleFavorite = async () => {
        if (!token) {
            alert('Silakan login terlebih dahulu untuk menambahkan favorit');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/books/${bookId}/favorite`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setIsFavorited(response.data.is_favorited);
            
            // Call parent callback if provided
            if (onToggle) {
                onToggle(response.data.is_favorited);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            if (error.response?.status === 401) {
                alert('Sesi Anda telah berakhir. Silakan login kembali.');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                alert('Gagal mengubah status favorit');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            disabled={loading}
            title={isFavorited ? 'Hapus dari favorit' : 'Tambahkan ke favorit'}
        >
            <svg
                className="heart-icon"
                viewBox="0 0 24 24"
                fill={isFavorited ? '#e74c3c' : 'none'}
                stroke={isFavorited ? '#e74c3c' : '#2c3e50'}
                strokeWidth="2"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{isFavorited ? 'Hapus Favorit' : 'Tambah Favorit'}</span>
        </button>
    );
}

export default FavoriteButton;
