import React from 'react';

function BookCard({ book, isAuthenticated, userRole, onDelete, onView }) {
  const isAdmin = userRole === 'admin';
  
  return (
    <div className="book-card" onClick={() => onView && onView(book.id)}>
      <div className="book-image">
        <img src={book.cover_image || 'https://via.placeholder.com/400x600?text=No+Cover'} alt={book.title} />
        <span className="book-badge pdf">PDF</span>
        {book.genre && <span className="book-badge level">{book.genre}</span>}
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-year">📅 {book.published_year}</p>
        {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
        <div className="book-details">

        </div>
        {isAuthenticated && isAdmin && (
          <div className="book-actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-danger" onClick={() => onDelete(book.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
