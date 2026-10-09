import { useState } from 'react';
import './Profile.css';
import { authAPI, getApiErrorMessage } from '../../services/api';

const Profile = ({ user, onUserUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');
    setMessageType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setFormData({
          name: response.data.user.name || '',
          phone: response.data.user.phone || '',
          address: response.data.user.address || ''
        });
        onUserUpdate?.(response.data.user);
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Unable to update your profile. Please try again.'));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((current) => ({ ...current, [name]: value }));
    setPasswordMessage('');
    setPasswordMessageType('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    setPasswordMessageType('');

    try {
      const response = await authAPI.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setVisiblePasswords({});
      setPasswordMessage(response.data.message || 'Password changed successfully.');
      setPasswordMessageType('success');
    } catch (error) {
      setPasswordMessage(getApiErrorMessage(error, 'Unable to change your password. Please try again.'));
      setPasswordMessageType('error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>👤 My Profile</h2>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="profile-info">
          <div className="info-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="info-item">
            <label>Role</label>
            <p className={`role ${user.role}`}>{user.role.toUpperCase()}</p>
          </div>

          <div className="info-item">
            <label>Status</label>
            <p className={`status ${user.status}`}>{user.status}</p>
          </div>

          <div className="info-item">
            <label>Joined</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="profile-details">
              <div className="detail-item">
                <label>Name</label>
                <p>{user.name || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p>{user.address || 'Not provided'}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
              <button 
                className="btn btn-danger"
                onClick={onLogout}
              >
                🚪 Logout
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={`profile-form ${messageType === 'error' ? 'form-has-error' : ''}`}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}

        <section className="password-section">
          <h3>Change Password</h3>
          {passwordMessage && (
            <div className={`message ${passwordMessageType}`} role="alert">
              {passwordMessage}
            </div>
          )}
          <form
            onSubmit={handlePasswordSubmit}
            className={`profile-form ${passwordMessageType === 'error' ? 'form-has-error' : ''}`}
          >
            {[
              { name: 'currentPassword', label: 'Current Password', autoComplete: 'current-password' },
              { name: 'newPassword', label: 'New Password', autoComplete: 'new-password' },
              { name: 'confirmPassword', label: 'Confirm New Password', autoComplete: 'new-password' }
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <div className="password-input-wrapper">
                  <input
                    id={field.name}
                    type={visiblePasswords[field.name] ? 'text' : 'password'}
                    name={field.name}
                    value={passwordData[field.name]}
                    onChange={handlePasswordChange}
                    autoComplete={field.autoComplete}
                    required
                    minLength={field.name === 'currentPassword' ? undefined : 8}
                  />
                  <button
                    type="button"
                    className="password-visibility-button"
                    aria-label={visiblePasswords[field.name] ? 'Hide password' : 'Show password'}
                    title={visiblePasswords[field.name] ? 'Hide password' : 'Show password'}
                    onClick={() => setVisiblePasswords((visible) => ({
                      ...visible,
                      [field.name]: !visible[field.name]
                    }))}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                      {visiblePasswords[field.name] && <path d="m4 4 16 16" />}
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
