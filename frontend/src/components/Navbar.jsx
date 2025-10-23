import React from 'react';

function Navbar({ isAuthenticated, user, onNavigate, onLogout, currentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <div className="navbar-brand-icon">📚</div>
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
        <a 
          className={`navbar-link ${currentPage === 'categories' ? 'active' : ''}`}
          onClick={() => onNavigate('books')}
        >
          Kategori Buku
        </a>
        
        {isAuthenticated ? (
          <>
            <a 
              className={`navbar-link ${currentPage === 'add-book' ? 'active' : ''}`}
              onClick={() => onNavigate('add-book')}
            >
              Petunjuk
              <span className="badge-new">Admin</span>
            </a>
            <div className="navbar-user">
              <span className="user-info">👤 {user?.name}</span>
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
