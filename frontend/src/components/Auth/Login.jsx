import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { authAPI, getApiErrorMessage } from '../../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.register(
          formData.name,
          formData.email,
          formData.password,
          formData.confirmPassword
        );
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to complete your request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-brand">
          <h1>🍽️ BhojanaSetu</h1>
          <p>Bridge connecting food and people</p>
        </div>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className={error ? 'form-has-error' : ''}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={visiblePasswords.password ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                minLength={isLogin ? undefined : 8}
                required
              />
              <button
                type="button"
                className="password-visibility-button"
                aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}
                title={visiblePasswords.password ? 'Hide password' : 'Show password'}
                onClick={() => setVisiblePasswords((visible) => ({
                  ...visible,
                  password: !visible.password
                }))}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {visiblePasswords.password && <path d="m4 4 16 16" />}
                </svg>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={visiblePasswords.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-visibility-button"
                  aria-label={visiblePasswords.confirmPassword ? 'Hide password' : 'Show password'}
                  title={visiblePasswords.confirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setVisiblePasswords((visible) => ({
                    ...visible,
                    confirmPassword: !visible.confirmPassword
                  }))}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {visiblePasswords.confirmPassword && <path d="m4 4 16 16" />}
                  </svg>
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
