import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookDetail.css';
import FavoriteButton from './FavoriteButton';
import StarRating from './StarRating';

function BookDetail({ bookId, onBack, isAuthenticated }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    published_year: '',
    isbn: '',
    genre: '',
    description: '',
    cover_image: '',
    pdf_url: '',
    stock: ''
  });

  useEffect(() => {
    fetchBookDetail();
    
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [bookId]);

  const fetchBookDetail = async () => {
    try {
      const response = await axios.get(`/books/${bookId}`);
      if (response.data.success) {
        setBook(response.data.data);
        // Set form data for editing
        setEditForm({
          title: response.data.data.title || '',
          author: response.data.data.author || '',
          published_year: response.data.data.published_year || '',
          isbn: response.data.data.isbn || '',
          genre: response.data.data.genre || '',
          description: response.data.data.description || '',
          cover_image: response.data.data.cover_image || '',
          pdf_url: response.data.data.pdf_url || '',
          stock: response.data.data.stock || ''
        });
      }
    } catch (error) {
      console.error('Error fetching book detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      return;
    }

    try {
      const response = await axios.delete(`/books/${bookId}`);
      if (response.data.success) {
        alert('Buku berhasil dihapus!');
        onBack();
      }
    } catch (error) {
      alert('Gagal menghapus buku. ' + (error.response?.data?.message || ''));
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`/books/${bookId}`, editForm);
      if (response.data.success) {
        alert('Buku berhasil diupdate!');
        setShowEditModal(false);
        fetchBookDetail(); // Refresh data
      }
    } catch (error) {
      alert('Gagal mengupdate buku. ' + (error.response?.data?.message || ''));
    }
  };

  if (loading) {
    return (
      <div className="book-detail-loading">
        <div className="spinner"></div>
        <p>Memuat detail buku...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-error">
        <p>Buku tidak ditemukan</p>
        <button className="btn btn-primary" onClick={onBack}>
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <span className="breadcrumb-link" onClick={onBack}>Beranda</span>
        <span> / </span>
        <span className="breadcrumb-link" onClick={onBack}>Katalog</span>
        <span> / </span>
        <span>{book.title}</span>
      </div>

      <div className="detail-content">
        {/* Left Side - Book Cover */}
        <div className="detail-left">
          <div className="detail-cover">
            <img 
              src={book.cover_image || 'https://via.placeholder.com/400x600?text=No+Cover'} 
              alt={book.title}
            />
          </div>
          <div className="detail-badges">
            <span className="badge badge-pdf">Buku PDF</span>
          </div>
        </div>

        {/* Right Side - Book Info */}
        <div className="detail-right">
          <h1 className="detail-title">{book.title}</h1>
          
          <div className="detail-actions">
            <FavoriteButton bookId={bookId} />
            
            <button 
              className="btn btn-primary btn-large" 
              onClick={async () => {
                const pdfUrl = book.pdf_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                
                // Record download if user is authenticated
                const token = localStorage.getItem('token');
                if (token) {
                  try {
                    await axios.post(
                      `http://localhost:8000/api/books/${bookId}/download`,
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                  } catch (error) {
                    console.error('Error recording download:', error);
                  }
                }
                
                window.open(pdfUrl, '_blank');
              }}
            >
              Baca Online
            </button>
          </div>

          <div className="detail-info-section">
            <h2 className="section-title">DETAIL BUKU</h2>
            
            <div className="info-grid">
              <div className="info-row">
                <div className="info-label">Penerbit</div>
                <div className="info-value">Pusat Perbukuan</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">ISBN</div>
                <div className="info-value">{book.isbn || 'Tidak tersedia'}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Edisi</div>
                <div className="info-value">1</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Penulis</div>
                <div className="info-value">{book.author}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Tahun Terbit</div>
                <div className="info-value">{book.published_year}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Genre</div>
                <div className="info-value">{book.genre || 'Umum'}</div>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="detail-description">
              <h2 className="section-title">DESKRIPSI</h2>
              <p>{book.description}</p>
            </div>
          )}
          
          {/* Star Rating Section */}
          <div className="rating-section">
            <h2 className="section-title">RATING & ULASAN</h2>
            <StarRating bookId={bookId} />
          </div>

          {/* Admin Actions */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="detail-admin-actions">
              <h3>Admin Actions</h3>
              <div className="admin-buttons">
                <button className="btn btn-warning" onClick={handleEditClick}>
                  Edit Buku
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Hapus Buku
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Buku</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Judul Buku *</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Penulis *</label>
                  <input
                    type="text"
                    name="author"
                    value={editForm.author}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={editForm.isbn}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Tahun Terbit *</label>
                  <input
                    type="number"
                    name="published_year"
                    value={editForm.published_year}
                    onChange={handleEditChange}
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="url"
                    name="cover_image"
                    value={editForm.cover_image}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>PDF URL</label>
                  <input
                    type="url"
                    name="pdf_url"
                    value={editForm.pdf_url}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stok *</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
