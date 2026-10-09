import Dish from '../models/Dish.js';
import { sendApiError } from '../utils/apiError.js';

// Get all dishes
export const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load dishes right now. Please try again.');
  }
};

// Get dishes by category
export const getDishesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const dishes = await Dish.find({ category, isAvailable: true });
    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load dishes in this category. Please try again.');
  }
};

// Get available dishes only
export const getAvailableDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isAvailable: true });
    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load available dishes. Please try again.');
  }
};

// Get single dish by ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load this dish. Check the dish ID and try again.');
  }
};

// Create new dish (Admin)
export const createDish = async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to create the dish. Check the submitted fields and try again.');
  }
};

// Update dish (Admin)
export const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to update the dish. Check the submitted fields and try again.');
  }
};

// Delete dish (Admin)
export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to delete this dish. Please try again.');
  }
};
