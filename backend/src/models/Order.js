import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide customer email'],
      lowercase: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide customer phone']
    },
    deliveryAddress: {
      street: String,
      city: String,
      zipCode: String,
      country: String
    },
    items: [
      {
        dishId: mongoose.Schema.Types.ObjectId,
        dishName: String,
        price: Number,
        quantity: Number,
        subtotal: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'UPI', 'Cash', 'Online'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    eventDate: {
      type: Date,
      required: true
    },
    specialInstructions: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
