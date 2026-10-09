import mongoose from 'mongoose';
import Dish from './src/models/Dish.js';
import dotenv from 'dotenv';
dotenv.config();

async function seedDishes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing dishes
    await Dish.deleteMany({});
    console.log('Cleared existing dishes');

    const dishes = [
      // Appetizers
      {
        name: 'Samosa',
        description: 'Crispy triangular pastry with spiced potato filling',
        category: 'Appetizers',
        price: 150,
        isAvailable: true,
        servings: 2,
        spicyLevel: 2,
        isVegetarian: true
      },
      {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese cubes with Indian spices',
        category: 'Appetizers',
        price: 250,
        isAvailable: true,
        servings: 2,
        spicyLevel: 2,
        isVegetarian: true
      },
      {
        name: 'Chicken Tikka',
        description: 'Succulent chicken pieces grilled to perfection',
        category: 'Appetizers',
        price: 280,
        isAvailable: true,
        servings: 2,
        spicyLevel: 2,
        isVegetarian: false
      },

      // Main Course
      {
        name: 'Biryani',
        description: 'Fragrant basmati rice with tender meat and aromatic spices',
        category: 'Main Course',
        price: 350,
        isAvailable: true,
        servings: 2,
        spicyLevel: 2,
        isVegetarian: false
      },
      {
        name: 'Vegetable Biryani',
        description: 'Mixed vegetables with fragrant rice and herbs',
        category: 'Main Course',
        price: 280,
        isAvailable: true,
        servings: 2,
        spicyLevel: 1,
        isVegetarian: true
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato sauce with butter',
        category: 'Main Course',
        price: 320,
        isAvailable: true,
        servings: 2,
        spicyLevel: 1,
        isVegetarian: false
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in rich creamy tomato gravy',
        category: 'Main Course',
        price: 300,
        isAvailable: true,
        servings: 2,
        spicyLevel: 1,
        isVegetarian: true
      },

      // Desserts
      {
        name: 'Gulab Jamun',
        description: 'Soft milk solids in fragrant sugar syrup',
        category: 'Desserts',
        price: 120,
        isAvailable: true,
        servings: 2,
        spicyLevel: 0,
        isVegetarian: true
      },
      {
        name: 'Kheer',
        description: 'Creamy rice pudding with dry fruits and cardamom',
        category: 'Desserts',
        price: 100,
        isAvailable: true,
        servings: 2,
        spicyLevel: 0,
        isVegetarian: true
      },
      {
        name: 'Rasgulla',
        description: 'Spongy cottage cheese balls in light sugar syrup',
        category: 'Desserts',
        price: 100,
        isAvailable: true,
        servings: 2,
        spicyLevel: 0,
        isVegetarian: true
      },

      // Beverages
      {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt-based mango drink',
        category: 'Beverages',
        price: 80,
        isAvailable: true,
        servings: 1,
        spicyLevel: 0,
        isVegetarian: true
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian tea with aromatic spices',
        category: 'Beverages',
        price: 50,
        isAvailable: true,
        servings: 1,
        spicyLevel: 1,
        isVegetarian: true
      },
      {
        name: 'Iced Coffee',
        description: 'Chilled coffee with milk and ice',
        category: 'Beverages',
        price: 70,
        isAvailable: true,
        servings: 1,
        spicyLevel: 0,
        isVegetarian: true
      }
    ];

    await Dish.insertMany(dishes);
    console.log(`✅ Seeded ${dishes.length} dishes successfully!`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedDishes();
