import { useState, useEffect } from 'react';
import axios from 'axios';
import './Favorites.css';

function Favorites({ onBookClick }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        
        loadFavorites();
    }, [token]);

    const loadFavorites = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/favorites',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setFavorites(response.data.favorites || []);
        } catch (error) {
            console.error('Error loading favorites:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (bookId) => {
        try {
            await axios.post(
                `http://localhost:8000/api/books/${bookId}/favorite`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Remove from local state
            setFavorites(favorites.filter(fav => fav.book.id !== bookId));
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Gagal menghapus dari favorit');
        }
    };

    if (!token) {
        return (
            <div className="favorites-container">
                <div className="login-required">
                    <h2>Login Diperlukan</h2>
                    <p>Silakan login untuk melihat daftar favorit Anda</p>
                    <a href="/login" className="btn btn-primary">Login</a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="favorites-container">
                <div className="loading">Memuat favorit...</div>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <h1>Buku Favorit Saya</h1>
                <p className="subtitle">
                    {favorites.length} buku tersimpan di favorit Anda
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-favorites">
                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h3>Belum ada favorit</h3>
                    <p>Mulai tambahkan buku ke favorit Anda dengan klik tombol hati di halaman detail buku</p>
                    <a href="/" className="btn btn-primary">Jelajahi Buku</a>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="favorite-card">
                            <div 
                                className="favorite-image" 
                                onClick={() => onBookClick && onBookClick(favorite.book.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {favorite.book.cover_image ? (
                                    <img src={favorite.book.cover_image} alt={favorite.book.title} />
                                ) : (
                                    <div className="placeholder-image">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            <div className="favorite-info">
                                <h3 
                                    onClick={() => onBookClick && onBookClick(favorite.book.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {favorite.book.title}
                                </h3>
                                <p className="author">{favorite.book.author}</p>
                                <p className="genre">{favorite.book.genre}</p>
                                <span className="favorite-date">
                                    Ditambahkan: {new Date(favorite.created_at).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                            
                            <button
                                className="btn-remove"
                                onClick={() => handleRemoveFavorite(favorite.book.id)}
                                title="Hapus dari favorit"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
