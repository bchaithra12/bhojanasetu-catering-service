import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CateringService from './components/Catering/CateringService';
import AdminPanel from './components/Admin/AdminPanel';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
import Users from './components/Users/Users';
import CartPage from './pages/CartPage';
import './App.css';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to parse user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [cartState, setCartState] = useState({ items: [], showCart: false });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleUserUpdate = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCartState({ items: [], showCart: false });
  };

  const removeFromCart = (dishId) => {
    setCartState(prev => ({
      ...prev,
      items: prev.items.filter(item => item._id !== dishId)
    }));
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCartState(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item._id === dishId
            ? { ...item, quantity }
            : item
        )
      }));
    }
  };

  return (
    <Router>
      <div className="App">
        {user && (
          <Navbar 
            user={user}
            cartCount={cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
            onLogout={handleLogout}
          />
        )}
        <main className="main-content">
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<CateringService cartState={cartState} setCartState={setCartState} />} />
                <Route path="/cart" element={<CartPage cart={cartState.items} user={user} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />} />
                <Route path="/profile" element={<Profile user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} />} />
                <Route path="/admin" element={<ProtectedRoute user={user}><AdminPanel /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute user={user}><Users /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
