import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllDishes,
  getDishesByCategory,
  getAvailableDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish
} from '../controllers/dishController.js';

const router = express.Router();

// Public routes
router.get('/', getAllDishes);
router.get('/available', getAvailableDishes);
router.get('/category/:category', getDishesByCategory);
router.get('/:id', getDishById);

// Admin routes
router.post('/', authenticate, authorize(['admin']), createDish);
router.put('/:id', authenticate, authorize(['admin']), updateDish);
router.delete('/:id', authenticate, authorize(['admin']), deleteDish);

export default router;
