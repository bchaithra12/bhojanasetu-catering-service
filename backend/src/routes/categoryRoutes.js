import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/active', getActiveCategories);
router.get('/:id', getCategoryById);

// Category changes are restricted to administrators.
router.post('/', authenticate, authorize(['admin']), createCategory);
router.put('/:id', authenticate, authorize(['admin']), updateCategory);
router.delete('/:id', authenticate, authorize(['admin']), deleteCategory);

export default router;
