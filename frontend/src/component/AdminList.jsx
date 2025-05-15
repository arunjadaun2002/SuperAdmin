import React, { useEffect, useState } from 'react';
import './AdminList.css';

const API_URL = 'http://localhost:5000/api';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admins`);
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
      setError(null);
    } catch (err) {
      setError('Failed to load admins. Please try again later.');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    setFormData({ username: '', password: '' });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    fetchAdmins();
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      password: admin.password
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await fetch(`${API_URL}/admins/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete admin');
      await fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin. Please try again later.');
      console.error('Error deleting admin:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = showEditModal 
        ? `${API_URL}/admins/${selectedAdmin.id}`
        : `${API_URL}/admins`;
      
      const method = showEditModal ? 'PUT' : 'POST';
      const payload = {
        username: formData.username,
        password: formData.password
      };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save admin');
      
      await fetchAdmins();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ username: '', password: '' });
      setSuccessMessage(showEditModal ? 'Admin updated in the database!' : 'Admin added to the database!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save admin. Please try again later.');
      console.error('Error saving admin:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-list-container">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-actions">
        <button className="admin-button add-button" onClick={handleAddAdmin}>
          Add New Admin
        </button>
        <button className="admin-button update-button" onClick={handleUpdate}>
          Update
        </button>
      </div>

      <div className="admin-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="empty-state">
            <p>No admins found</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.username}</td>
                  <td>{admin.password}</td>
                  <td>
                    <button 
                      className="action-button edit"
                      onClick={() => handleEdit(admin)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{showEditModal ? 'Edit Admin' : 'Add New Admin'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="admin-button add-button">
                  {showEditModal ? 'Update' : 'Add'}
                </button>
                <button 
                  type="button" 
                  className="admin-button cancel-button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList; 