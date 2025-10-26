import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';
import BookCard from './BookCard';

function BookList({ isAuthenticated, refresh, onViewBook, initialSearchQuery = '', initialSearchType = 'title', initialCategory = '' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearchQuery);
  const [searchType, setSearchType] = useState(initialSearchType);
  const [genre, setGenre] = useState(initialCategory);
  const [genres, setGenres] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Update search when initialSearchQuery changes
  useEffect(() => {
    if (initialSearchQuery) {
      setSearch(initialSearchQuery);
      setSearchType(initialSearchType);
    }
  }, [initialSearchQuery, initialSearchType]);

  // Update genre when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setGenre(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    fetchStatistics();
  }, [currentPage, search, genre, refresh]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/books', {
        params: {
          page: currentPage,
          per_page: 12,
          search,
          genre
        }
      });
      if (response.data.success) {
        setBooks(response.data.data.data);
        setLastPage(response.data.data.last_page);
        setTotalBooks(response.data.data.total);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/books-genres');
      if (response.data.success) {
        setGenres(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/books-statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await axios.delete(`/books/${id}`);
      if (response.data.success) {
        alert('Book deleted successfully!');
        fetchBooks();
        fetchStatistics();
      }
    } catch (error) {
      alert('Failed to delete book. ' + (error.response?.data?.message || ''));
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/books/${selectedBook.id}`, selectedBook);
      if (response.data.success) {
        alert('Book updated successfully!');
        setShowEditModal(false);
        fetchBooks();
        fetchStatistics();
      }
    } catch (error) {
      alert('Failed to update book. ' + (error.response?.data?.message || ''));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      {/* Header */}
      <div className="catalog-header">
        <div className="catalog-breadcrumb">
          <span className="breadcrumb-link">Beranda</span>
          <span> / </span>
          <span>Katalog Terbaru</span>
        </div>
        <h1 className="catalog-title">Katalog Terbaru</h1>
        <p className="catalog-count">
          Menampilkan {books.length} buku ({totalBooks} dari {statistics?.total_books || 0} buku)
        </p>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={genre} onChange={handleGenreChange} className="genre-select">
          <option value="">Semua Genre</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <div className="filter-sort">
          <span className="filter-label">Urutkan :</span>
          <select className="genre-select" style={{ minWidth: '150px' }}>
            <option>Semua</option>
            <option>Terbaru</option>
            <option>Terpopuler</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {books.length === 0 ? (
          <p className="no-books">Tidak ada buku ditemukan.</p>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isAuthenticated={isAuthenticated}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={onViewBook}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Book</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={selectedBook.title}
                  onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={selectedBook.author}
                  onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  value={selectedBook.published_year}
                  onChange={(e) => setSelectedBook({ ...selectedBook, published_year: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  value={selectedBook.genre || ''}
                  onChange={(e) => setSelectedBook({ ...selectedBook, genre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={selectedBook.price}
                  onChange={(e) => setSelectedBook({ ...selectedBook, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={selectedBook.stock}
                  onChange={(e) => setSelectedBook({ ...selectedBook, stock: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedBook.description || ''}
                  onChange={(e) => setSelectedBook({ ...selectedBook, description: e.target.value })}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
