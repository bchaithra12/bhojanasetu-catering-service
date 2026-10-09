import { useState } from 'react';
import OrderCheckout from './OrderCheckout';
import './ShoppingCart.css';

function ShoppingCart({ items, onRemove, onUpdateQuantity, onClose }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = 50;
  const total = subtotal + deliveryCharge;

  if (showCheckout) {
    return (
      <OrderCheckout
        items={items}
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
        <h2>Shopping Cart</h2>
        <button className="btn-close" onClick={onClose}>✕ Back to Menu</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>🛒 Your cart is empty</p>
          <button className="btn-primary" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
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

export default ShoppingCart;
