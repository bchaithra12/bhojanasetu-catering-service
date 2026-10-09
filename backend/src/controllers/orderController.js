import Order from '../models/Order.js';
import { sendApiError } from '../utils/apiError.js';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${Date.now()}-${timestamp}${random}`;
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      });
    }

    if (!req.body.customerPhone || !req.body.customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required'
      });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Prepare order data
    const orderData = {
      ...req.body,
      orderNumber,
      paymentStatus: 'Completed',
      orderStatus: 'Confirmed'
    };

    // Create order in database
    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to place the order. Check the submitted details and try again.');
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load orders right now. Please try again.');
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load this order. Check the order ID and try again.');
  }
};

// Get orders by customer email
export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load orders for this email. Please check the email and try again.');
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to update the order status. Check the selected status and try again.');
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: 'Cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to cancel this order. Please try again.');
  }
};
