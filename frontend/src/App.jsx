import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Alamat lengkap ke API Laravel Anda
    axios.get('http://127.0.0.1:8000/api/greeting')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Terjadi error:', error);
        setMessage('Gagal memuat data dari backend.');
      });
  }, []); // Array kosong berarti efek ini hanya berjalan sekali setelah render pertama

  return (
    <div className="App">
      <header className="App-header">
        <h1>Proyek React + Laravel</h1>
        <p>
          Pesan dari Backend: <strong>{message || 'Memuat...'}</strong>
        </p>
      </header>
    </div>
  );
}

export default App;