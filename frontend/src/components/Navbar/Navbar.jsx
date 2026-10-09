import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, cartCount = 0, onLogout }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  return (
    <div className='navbar'>
      <div className='navbar-brand' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h2>🍽️ BhojanaSetu</h2>
        <p>Bridge connecting food and people</p>
      </div>
      
      <div className='navbar-right'>
        <button 
          className={`cart-button ${cartCount > 0 ? 'active' : ''}`}
          onClick={() => navigate('/cart')}
          title="View Shopping Cart"
        >
          🛒 Cart ({cartCount})
        </button>

        {isAdmin && (
          <>
            <button
              className="nav-link-btn"
              onClick={() => navigate('/admin')}
              title="Open Admin Panel and Orders"
            >
              ⚙️ Admin
            </button>
            <button
              className="nav-link-btn"
              onClick={() => navigate('/users')}
              title="Manage Users"
            >
              👥 Users
            </button>
          </>
        )}

        <button 
          className="nav-link-btn"
          onClick={() => navigate('/profile')}
          title="View Profile"
        >
          👤 {user?.name || 'Profile'}
        </button>

        <button 
          className="logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
