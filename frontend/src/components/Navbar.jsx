import React, { useState } from 'react';

function Navbar({ isAuthenticated, user, onNavigate, onLogout, currentPage, onCategorySelect }) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const categories = [
    'Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 
    'Biografi', 'Self-Help', 'Bisnis', 'Anak-Anak', 'Pendidikan',
    'Agama', 'Filsafat', 'Psikologi', 'Ekonomi', 'Politik'
  ];

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    setShowCategoryDropdown(false);
    onNavigate('books');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <div className="navbar-brand-text">
          <div className="navbar-brand-title">Sistem Informasi</div>
          <div className="navbar-brand-subtitle">Perbukuan Indonesia</div>
        </div>
      </div>
      
      <div className="navbar-menu">
        <a 
          className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Beranda
        </a>
        <a 
          className={`navbar-link ${currentPage === 'books' ? 'active' : ''}`}
          onClick={() => onNavigate('books')}
        >
          Katalog Terbaru
        </a>
        <div 
          className="navbar-dropdown"
          onMouseEnter={() => setShowCategoryDropdown(true)}
          onMouseLeave={() => setShowCategoryDropdown(false)}
        >
          <a 
            className={`navbar-link ${currentPage === 'categories' ? 'active' : ''}`}
          >
            Kategori Buku
            <span className="dropdown-arrow">▼</span>
          </a>
          {showCategoryDropdown && (
            <div className="dropdown-menu">
              {categories.map((category) => (
                <div 
                  key={category}
                  className="dropdown-item"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {isAuthenticated ? (
          <>
            <a 
              className={`navbar-link ${currentPage === 'favorites' ? 'active' : ''}`}
              onClick={() => onNavigate('favorites')}
            >
              Favorit Saya
            </a>
            
            {/* Only show Add Book for admin */}
            {user?.role === 'admin' && (
              <a 
                className={`navbar-link ${currentPage === 'add-book' ? 'active' : ''}`}
                onClick={() => onNavigate('add-book')}
              >
                Add Book
                <span className="badge-new">Admin</span>
              </a>
            )}
            
            <div className="navbar-user">
              <span className="user-info">{user?.name}</span>
              <button className="btn btn-outline" onClick={onLogout}>
                Keluar
              </button>
            </div>
          </>
        ) : (
          <>
            <button 
              className="btn btn-outline"
              onClick={() => onNavigate('login')}
            >
              Masuk
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
