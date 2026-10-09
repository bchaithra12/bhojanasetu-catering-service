import { useEffect, useState } from 'react';
import './Users.css';
import { getApiErrorMessage, userAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load users. Please try again.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    userAPI.getAllUsers()
      .then((response) => {
        if (active) setUsers(response.data.data);
      })
      .catch((err) => {
        if (active) {
          setError(getApiErrorMessage(err, 'Unable to load users. Please try again.'));
          console.error(err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  const handleSave = async (userId) => {
    try {
      await userAPI.updateUser(userId, editForm);
      loadUsers();
      setEditingId(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update this user. Please try again.'));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userAPI.deleteUser(userId);
      loadUsers();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete this user. Please try again.'));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="users-container"><p>Loading users...</p></div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>👥 User Management</h2>
        <p className="user-count">Total Users: {users.length}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className={`users-table-wrapper ${editingId && error ? 'form-has-error' : ''}`}>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className={editingId === user._id ? 'editing' : ''}>
                <td>
                  {editingId === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  {editingId === user._id ? (
                    <>
                      <button
                        className="btn-save"
                        onClick={() => handleSave(user._id)}
                      >
                        💾 Save
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default Users;
