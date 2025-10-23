import React, { useState } from 'react';
import axios from 'axios';

function AddBook({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: new Date().getFullYear(),
    isbn: '',
    genre: '',
    description: '',
    cover_image: '',
    stock: 0,
    price: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 
                  'Romance', 'Horror', 'Biography', 'History', 'Self-Help', 'Business', 
                  'Technology', 'Science', 'Poetry', 'Drama'];

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

    try {
      const response = await axios.post('/books', formData);
      if (response.data.success) {
        alert('Book added successfully!');
        onSuccess();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to add book. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px' }}>
      <h2 className="form-title">Add New Book</h2>
      {errors.general && <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
            {errors.author && <div className="error-message">{errors.author}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="published_year">Published Year *</label>
            <input
              type="number"
              id="published_year"
              name="published_year"
              value={formData.published_year}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear() + 1}
              required
            />
            {errors.published_year && <div className="error-message">{errors.published_year}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN (optional)"
            />
            {errors.isbn && <div className="error-message">{errors.isbn}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">Select a genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="price">Price (Rp) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
            {errors.stock && <div className="error-message">{errors.stock}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cover_image">Cover Image URL</label>
          <input
            type="url"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            placeholder="Enter image URL (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter book description (optional)"
            rows="5"
          />
        </div>

        <button type="submit" className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
