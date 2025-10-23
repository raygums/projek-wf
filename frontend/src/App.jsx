import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import AddBook from './components/AddBook';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshBooks, setRefreshBooks] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentPage('books');
  };

  const handleLogout = () => {
    axios.post('/auth/logout')
      .finally(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        setCurrentPage('books');
      });
  };

  const handleBookAdded = () => {
    setCurrentPage('books');
    setRefreshBooks(prev => prev + 1);
  };

  const handleViewBook = (bookId) => {
    setSelectedBookId(bookId);
    setCurrentPage('book-detail');
  };

  const handleBackToBooks = () => {
    setCurrentPage('books');
    setSelectedBookId(null);
    setRefreshBooks(prev => prev + 1);
  };

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    setSearchType(type);
    setCurrentPage('books');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage 
          onNavigate={setCurrentPage} 
          onSearch={handleSearch}
        />;
      case 'books':
        return <BookList 
          isAuthenticated={isAuthenticated} 
          refresh={refreshBooks}
          onViewBook={handleViewBook}
          initialSearchQuery={searchQuery}
          initialSearchType={searchType}
        />;
      case 'book-detail':
        return <BookDetail 
          bookId={selectedBookId}
          onBack={handleBackToBooks}
          isAuthenticated={isAuthenticated}
        />;
      case 'add-book':
        return <AddBook onSuccess={handleBookAdded} />;
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onRegister={handleLogin} onSwitchToLogin={() => setCurrentPage('login')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;