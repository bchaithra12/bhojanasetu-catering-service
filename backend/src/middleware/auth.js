import jwt from 'jsonwebtoken';
import getJwtSecret from '../config/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured.') {
      return res.status(500).json({
        success: false,
        message: 'Authentication is not configured on the server.'
      });
    }
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    next();
  };
};
