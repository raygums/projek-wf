import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      setDeleteLoading(userId);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userId));
        alert('User berhasil dihapus');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-users-loading">Memuat data user...</div>;
  }

  if (error) {
    return <div className="admin-users-error">{error}</div>;
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1>Kelola Pengguna</h1>
        <p>Total {users.length} pengguna terdaftar</p>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Favorit</th>
              <th>Unduhan</th>
              <th>Rating</th>
              <th>Terdaftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{user.favorites_count || 0}</td>
                <td>{user.downloads_count || 0}</td>
                <td>{user.ratings_count || 0}</td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={deleteLoading === user.id}
                  >
                    {deleteLoading === user.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>Tidak ada pengguna terdaftar</p>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
