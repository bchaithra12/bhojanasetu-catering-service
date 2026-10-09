import User from '../models/User.js';
import { sendApiError } from '../utils/apiError.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load users right now. Please try again.');
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to load this user. Please try again.');
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, status, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status, phone, address, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to update this user. Please try again.');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    sendApiError(res, error, 'Unable to delete this user. Please try again.');
  }
};
