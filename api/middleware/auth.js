import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'taskforge_jwt_access_secret_key_987654321';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const user = await dbService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
