import React, { useState } from 'react';
import axios from 'axios';
import './AddBook.css';

function AddBook({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: new Date().getFullYear(),
    isbn: '',
    genre: '',
    description: '',
    cover_image: '',
    pdf_url: '',
    stock: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const genres = [
    'Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 
    'Biografi', 'Self-Help', 'Bisnis', 'Anak-Anak', 'Pendidikan',
    'Agama', 'Filsafat', 'Psikologi', 'Ekonomi', 'Politik'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validasi token
    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'Anda harus login terlebih dahulu untuk menambah buku.' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/books', formData);
      if (response.data.success) {
        alert('✅ Buku berhasil ditambahkan!');
        onSuccess();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ general: 'Sesi Anda telah berakhir. Silakan login kembali.' });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Gagal menambahkan buku. Silakan coba lagi.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-header">
        <h1 className="add-book-title">Tambah Buku Baru</h1>
        <p className="add-book-subtitle">Lengkapi form di bawah untuk menambahkan buku ke katalog</p>
      </div>

      <div className="add-book-form">
        {errors.general && (
          <div className="general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Informasi Dasar */}
          <div className="form-section">
            <h3 className="section-title">Informasi Dasar</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">
                  Judul Buku<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul buku"
                  required
                />
                {errors.title && <div className="error-message">{errors.title}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="author">
                  Penulis<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Masukkan nama penulis"
                  required
                />
                {errors.author && <div className="error-message">{errors.author}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="published_year">
                  Tahun Terbit<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="published_year"
                  name="published_year"
                  value={formData.published_year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
                {errors.published_year && <div className="error-message">{errors.published_year}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Pilih genre</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-full">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Masukkan ISBN (opsional)"
              />
              <span className="helper-text">Contoh: 978-3-16-148410-0</span>
              {errors.isbn && <div className="error-message">{errors.isbn}</div>}
            </div>
          </div>

          {/* Detail Buku */}
          <div className="form-section">
            <h3 className="section-title">Detail Buku</h3>
            
            <div className="form-group-full">
              <label htmlFor="description">Deskripsi</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Masukkan deskripsi singkat tentang buku (opsional)"
                rows="5"
              />
            </div>

            <div className="form-group-full">
              <label htmlFor="cover_image">URL Cover Buku</label>
              <input
                type="url"
                id="cover_image"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
              />
              <span className="helper-text">Masukkan URL gambar cover buku (opsional)</span>
              
              {formData.cover_image && (
                <div className="upload-preview">
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    className="preview-image"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div className="form-group-full">
              <label htmlFor="pdf_url">URL File PDF</label>
              <input
                type="url"
                id="pdf_url"
                name="pdf_url"
                value={formData.pdf_url}
                onChange={handleChange}
                placeholder="https://example.com/book.pdf"
              />
              <span className="helper-text">
                Masukkan URL file PDF untuk baca online & download. 
                Contoh: Link Google Drive, Dropbox, atau hosting PDF lainnya
              </span>
            </div>
          </div>

          {/* Stok & Harga */}
          <div className="form-section">
            <h3 className="section-title">Stok Buku</h3>
            
            <div className="form-group-full">
              <label htmlFor="stock">
                Jumlah Stok<span className="required">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
                required
              />
              {errors.stock && <div className="error-message">{errors.stock}</div>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? 'Menambahkan...' : 'Tambah Buku'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
