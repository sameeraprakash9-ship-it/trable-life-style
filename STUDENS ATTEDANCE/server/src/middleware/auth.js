import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (request, response, next) => {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return response.status(401).json({ message: 'User is no longer available' });
    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired authorization token' });
  }
};
