import { useCallback, useEffect, useState } from 'react';
import './AdminPanel.css';
import { categoryAPI, getApiErrorMessage } from '../../services/api';

const AdminPanel = () => {
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('dishes');
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Appetizers',
    price: '',
    servings: 2,
    spicyLevel: 0,
    isVegetarian: false,
    isAvailable: true
  });

  const loadDishes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAllDishes();
      setDishes(response.data.data);
    } catch (error) {
      console.error('Error loading dishes:', error);
      alert(getApiErrorMessage(error, 'Unable to load dishes. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const response = await categoryAPI.getAllOrders();
      setOrders(response.data.data);
    } catch (error) {
      setOrdersError(getApiErrorMessage(error, 'Unable to load orders. Please try again.'));
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    categoryAPI.getAllDishes()
      .then((response) => {
        if (active) setDishes(response.data.data);
      })
      .catch((error) => {
        if (active) {
          console.error('Error loading dishes:', error);
          alert(getApiErrorMessage(error, 'Unable to load dishes. Please try again.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    categoryAPI.getAllOrders()
      .then((response) => {
        if (active) setOrders(response.data.data);
      })
      .catch((error) => {
        if (active) setOrdersError(getApiErrorMessage(error, 'Unable to load orders. Please try again.'));
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOrderStatusChange = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setOrdersError('');
      const response = await categoryAPI.updateOrderStatus(orderId, orderStatus);
      setOrders((currentOrders) =>
        currentOrders.map((order) => order._id === orderId ? response.data.data : order)
      );
    } catch (error) {
      setOrdersError(getApiErrorMessage(error, 'Unable to update this order. Please try again.'));
    } finally {
      setUpdatingOrderId('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormError('');
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing dish
        await categoryAPI.updateDish(editingId, formData);
        alert('✅ Dish updated successfully!');
      } else {
        // Create new dish
        await categoryAPI.createDish(formData);
        alert('✅ Dish added successfully!');
      }
      
      // Reset form and reload
      setFormData({
        name: '',
        description: '',
        category: 'Appetizers',
        price: '',
        servings: 2,
        spicyLevel: 0,
        isVegetarian: false,
        isAvailable: true
      });
      setShowForm(false);
      setEditingId(null);
      loadDishes();
    } catch (error) {
      console.error('Error saving dish:', error);
      setFormError(getApiErrorMessage(error, 'Unable to save this dish. Please check the submitted fields and try again.'));
    }
  };

  const handleEdit = (dish) => {
    setFormData(dish);
    setEditingId(dish._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await categoryAPI.deleteDish(id);
        alert('✅ Dish deleted successfully!');
        loadDishes();
      } catch (error) {
        console.error('Error deleting dish:', error);
        alert(getApiErrorMessage(error, 'Unable to delete this dish. Please try again.'));
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Appetizers',
      price: '',
      servings: 2,
      spicyLevel: 0,
      isVegetarian: false,
      isAvailable: true
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Appetizers': '#FF6B6B',
      'Main Course': '#4ECDC4',
      'Desserts': '#FFE66D',
      'Beverages': '#95E1D3'
    };
    return colors[category] || '#667eea';
  };

  const completedOrders = orders.filter((order) =>
    ['Delivered', 'Cancelled'].includes(order.orderStatus)
  );
  const activeOrders = orders.filter((order) =>
    !['Delivered', 'Cancelled'].includes(order.orderStatus)
  );
  const visibleOrders = showCompletedOrders ? completedOrders : activeOrders;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🍽️ Admin Panel</h1>
        {activeTab === 'dishes' && (
          <button
            className="btn-add-dish"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Dish
          </button>
        )}
      </div>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'dishes' ? 'active' : ''}`}
          aria-selected={activeTab === 'dishes'}
          onClick={() => setActiveTab('dishes')}
        >
          🍽️ Dishes ({dishes.length})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          aria-selected={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
        >
          🧾 Orders ({activeOrders.length})
        </button>
      </nav>

      {/* Form Section */}
      {activeTab === 'dishes' && showForm && (
        <div className="admin-form-wrapper">
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Dish' : 'Add New Dish'}</h2>
            <form onSubmit={handleSubmit} className={formError ? 'form-has-error' : ''}>
              {formError && <p className="form-error-message" role="alert">{formError}</p>}
              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Paneer Tikka"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Marinated cottage cheese..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option>Appetizers</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 250"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Spice Level (0-3)</label>
                  <input
                    type="number"
                    name="spicyLevel"
                    value={formData.spicyLevel}
                    onChange={handleInputChange}
                    min="0"
                    max="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                  />
                  <label>Vegetarian</label>
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  <label>Available</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? 'Update Dish' : 'Add Dish'}
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dishes List */}
      {activeTab === 'dishes' && <div className="admin-dishes-section">
        <h2>📋 All Dishes ({dishes.length})</h2>
        
        {loading ? (
          <p className="loading">Loading dishes...</p>
        ) : dishes.length === 0 ? (
          <p className="no-dishes">No dishes found. Add one to get started!</p>
        ) : (
          <div className="dishes-grid">
            {dishes.map((dish) => (
              <div key={dish._id} className="dish-card">
                <div 
                  className="dish-category-badge"
                  style={{ backgroundColor: getCategoryColor(dish.category) }}
                >
                  {dish.category}
                </div>

                <h3>{dish.name}</h3>
                <p className="dish-desc">{dish.description}</p>

                <div className="dish-details">
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value">₹{dish.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Servings:</span>
                    <span className="value">{dish.servings}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Spice:</span>
                    <span className="value">{'🌶️'.repeat(dish.spicyLevel)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">
                      {dish.isVegetarian ? '🌱 Veg' : '🍗 Non-Veg'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`value ${dish.isAvailable ? 'available' : 'unavailable'}`}>
                      {dish.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>

                </div>

                <div className="dish-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(dish)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(dish._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>}

      {activeTab === 'orders' && <section className="admin-orders-section">
        <div className="admin-orders-heading">
          <div>
            <h2>🧾 Customer Orders</h2>
            <p>{showCompletedOrders ? 'Completed order history' : `${activeOrders.length} active`}</p>
          </div>
          <div className="orders-heading-actions">
            <button
              className="orders-refresh-btn"
              onClick={() => setShowCompletedOrders((show) => !show)}
            >
              {showCompletedOrders ? `← Active orders (${activeOrders.length})` : `Completed (${completedOrders.length})`}
            </button>
            <button className="orders-refresh-btn" onClick={loadOrders} disabled={ordersLoading}>
              {ordersLoading ? 'Refreshing...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {ordersError && <p className="orders-error" role="alert">{ordersError}</p>}

        {ordersLoading ? (
          <p className="loading">Loading orders...</p>
        ) : visibleOrders.length === 0 ? (
          <p className="no-dishes">
            {showCompletedOrders ? 'No completed orders yet.' : 'No active customer orders.'}
          </p>
        ) : (
          <div className="orders-list">
            {visibleOrders.map((order) => (
              <article key={order._id} className="order-card">
                <div className="order-card-heading">
                  <div>
                    <h3>{order.orderNumber}</h3>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="order-actions">
                    <label className="order-status-control">
                      <span>Status</span>
                      <select
                        value={order.orderStatus}
                        onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}
                        disabled={updatingOrderId === order._id}
                      >
                        {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    {!showCompletedOrders && (
                      <button
                        type="button"
                        className="complete-order-btn"
                        onClick={() => handleOrderStatusChange(order._id, 'Delivered')}
                        disabled={updatingOrderId === order._id}
                      >
                        {updatingOrderId === order._id ? 'Saving...' : '✓ Complete order'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="order-card-details">
                  <div>
                    <strong>Customer</strong>
                    <span>{order.customerName}</span>
                    <span>{order.customerEmail}</span>
                    <span>{order.customerPhone}</span>
                  </div>
                  <div>
                    <strong>Delivery address</strong>
                    <span>
                      {[
                        order.deliveryAddress?.street,
                        order.deliveryAddress?.city,
                        order.deliveryAddress?.zipCode,
                        order.deliveryAddress?.country
                      ].filter(Boolean).join(', ') || 'Not provided'}
                    </span>
                    <span>Event date: {new Date(order.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <strong>Items</strong>
                    {order.items.map((item, index) => (
                      <span key={`${item.dishId || item.dishName}-${index}`}>
                        {item.dishName} × {item.quantity} — ₹{Number(item.subtotal || 0).toFixed(2)}
                      </span>
                    ))}
                    <strong>Total: ₹{Number(order.totalAmount).toFixed(2)}</strong>
                    <span>Payment: {order.paymentMethod} ({order.paymentStatus})</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <p className="order-instructions">
                    <strong>Instructions:</strong> {order.specialInstructions}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>}
    </div>
  );
};

export default AdminPanel;
