import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a dish name'],
      trim: true,
      maxlength: [100, 'Dish name cannot be more than 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
      type: String,
      enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages'],
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0
    },
    image: {
      type: String,
      default: null
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    servings: {
      type: String,
      default: 'per plate'
    },
    spicyLevel: {
      type: Number,
      enum: [0, 1, 2, 3], // 0=mild, 1=medium, 2=hot, 3=very hot
      default: 0
    },
    isVegetarian: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Dish', dishSchema);
