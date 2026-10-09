import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCheckout from '../components/Catering/OrderCheckout';
import '../components/Catering/ShoppingCart.css';

function CartPage({ cart, user, onRemove, onUpdateQuantity }) {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = 50;
  const total = subtotal + deliveryCharge;

  if (showCheckout) {
    return (
      <OrderCheckout
        items={cart}
        user={user}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>🛒 Shopping Cart</h2>
        <button className="btn-close" onClick={() => navigate('/')}>← Back to Menu</button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>🛒 Your cart is empty</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                {item.image && (
                  <img src={item.image} alt={item.name} className="item-image" />
                )}
                
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">₹{item.price} each</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => onRemove(item._id)}
                  className="btn-remove"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button 
              className="btn-checkout"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
