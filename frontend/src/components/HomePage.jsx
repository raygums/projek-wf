import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage({ onNavigate, onSearch }) {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    try {
      const response = await axios.get('/books', {
        params: { per_page: 8 }
      });
      if (response.data.success) {
        setPopularBooks(response.data.data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching popular books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    // Will implement book detail navigation
    onNavigate('books');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to BookList with search query
      if (onSearch) {
        onSearch(searchQuery, searchCategory);
      }
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Buku untuk Semua</h1>
          <p className="hero-subtitle">Akses di mana pun, kapan pun, Baca buku yuk!</p>
          
          <div className="search-container">
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Cari judul buku, penulis, atau ISBN..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="search-select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="title">Judul Buku</option>
                <option value="author">Penulis</option>
                <option value="isbn">ISBN</option>
              </select>
              <button type="submit" className="search-button">Cari</button>
            </form>
          </div>
        </div>
        
        <div className="hero-illustration">
          <div className="illustration-books">
            <div className="floating-book book-1">📚</div>
            <div className="floating-book book-2">📖</div>
            <div className="floating-book book-3">📕</div>
          </div>
          <div className="hero-people">
            <span className="person-icon">👨‍🎓</span>
            <span className="person-icon">👩‍🎓</span>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="section popular-section">
        <div className="section-header">
          <h2 className="section-title">Buku terpopuler</h2>
          <p className="section-subtitle">Jelajahi buku populer dari pusat perbukuan resmi</p>
        </div>
        
        {loading ? (
          <div className="popular-loading">
            <div className="spinner"></div>
            <p>Memuat buku populer...</p>
          </div>
        ) : (
          <>
            <div className="popular-books-grid">
              {popularBooks.map((book) => (
                <div key={book.id} className="popular-book-card" onClick={() => handleBookClick(book.id)}>
                  <div className="popular-book-image">
                    <img 
                      src={book.cover_image || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                      alt={book.title} 
                    />
                    <span className="popular-badge">PDF</span>
                  </div>
                  <div className="popular-book-info">
                    <h3 className="popular-book-title">{book.title}</h3>
                    <p className="popular-book-author">{book.author}</p>
                    <span className="popular-book-genre">{book.genre || 'Umum'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="popular-footer">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => onNavigate('books')}
              >
                Lihat Semua Buku
              </button>
            </div>
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Buku Digital</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500K+</div>
            <div className="stat-label">Pembaca Aktif</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Gratis</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Akses Online</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Buku Berkualitas</h3>
            <p className="feature-desc">Koleksi buku dari Kementerian Pendidikan</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆓</div>
            <h3 className="feature-title">100% Gratis</h3>
            <p className="feature-desc">Akses semua buku tanpa biaya apapun</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Multi Platform</h3>
            <p className="feature-desc">Baca di komputer, tablet, atau smartphone</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Mudah Dicari</h3>
            <p className="feature-desc">Temukan buku dengan mudah dan cepat</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
