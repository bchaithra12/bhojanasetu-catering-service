import { useState } from 'react';
import { categoryAPI, getApiErrorMessage } from '../../services/api';
import './OrderCheckout.css';

function OrderCheckout({ items, user, subtotal, deliveryCharge, total, onBack }) {
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    deliveryAddress: {
      street: user?.address || '',
      city: '',
      zipCode: '',
      country: ''
    },
    eventDate: '',
    paymentMethod: 'Card',
    specialInstructions: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const paymentMethods = [
    { id: 'Card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay' },
    { id: 'UPI', label: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, BHIM' },
    { id: 'Cash', label: 'Cash on Delivery', icon: '💵', description: 'Pay at delivery' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage('');
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          dishId: item._id,
          dishName: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        totalAmount: total,
        deliveryCharge
      };

      const response = await categoryAPI.createOrder(orderData);
      setOrderNumber(response.data.data.orderNumber);
      setOrderPlaced(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to place your order. Please check your details and try again.'));
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (paymentProcessing) {
    return (
      <div className="payment-processing">
        <div className="processing-card">
          <div className="spinner"></div>
          <h3>Placing your order...</h3>
          <p>Saving your order details. No payment is being collected.</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card">
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p className="order-number">Order #: {orderNumber}</p>
          <p className="order-amount">Total Amount: ₹{total.toFixed(2)}</p>
          
          <div className="confirmation-details">
            <div className="detail-row">
              <span className="label">Customer Name:</span>
              <span className="value">{formData.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{formData.customerPhone}</span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Method:</span>
              <span className="value">{formData.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Status:</span>
              <span className="value">Completed (Demo)</span>
            </div>
            <div className="detail-row">
              <span className="label">Delivery Address:</span>
              <span className="value">{formData.deliveryAddress.city}, {formData.deliveryAddress.zipCode}</span>
            </div>
          </div>

          <p className="confirmation-message">
            Your order has been saved successfully. Payment is marked completed for this demo only; no money was charged.
          </p>

          <button 
            className="btn-continue"
            onClick={() => window.location.reload()}
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-checkout">
      <button className="btn-back" onClick={onBack}>← Back to Cart</button>

      <h2>Order Checkout</h2>

      <form onSubmit={handleSubmit} className={`checkout-form ${errorMessage ? 'form-has-error' : ''}`}>
        {errorMessage && <div className="form-error-message" role="alert">{errorMessage}</div>}
        {/* Customer Information */}
        <fieldset>
          <legend>Customer Information</legend>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Delivery Address */}
        <fieldset>
          <legend>Delivery Address</legend>
          
          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="deliveryAddress.street"
              value={formData.deliveryAddress.street}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="deliveryAddress.city"
                value={formData.deliveryAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Zip Code *</label>
              <input
                type="text"
                name="deliveryAddress.zipCode"
                value={formData.deliveryAddress.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="deliveryAddress.country"
              value={formData.deliveryAddress.country}
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        {/* Event Date */}
        <fieldset>
          <legend>Event Details</legend>
          
          <div className="form-group">
            <label>Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Any dietary restrictions, preferences, etc."
              rows="3"
            />
          </div>
        </fieldset>

        {/* Payment Method Selection */}
        <fieldset>
          <legend>Payment Method</legend>
          <p className="payment-demo-notice">
            Payment is not collected online in this demo. Your selection is saved as a preference.
          </p>
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <label key={method.id} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleInputChange}
                />
                <div className="payment-card">
                  <span className="payment-icon">{method.icon}</span>
                  <div className="payment-info">
                    <div className="payment-label">{method.label}</div>
                    <div className="payment-desc">{method.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({items.length} items):</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charge:</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit"
          className="btn-place-order"
          disabled={paymentProcessing}
        >
          {paymentProcessing ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default OrderCheckout;
