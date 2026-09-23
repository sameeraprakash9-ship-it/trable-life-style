import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });

export const register = async (request, response) => {
  const { name, email, password, role } = request.body;
  if (!name || !email || !password) return response.status(400).json({ message: 'Name, email, and password are required' });
  if (password.length < 6) return response.status(400).json({ message: 'Password must be at least 6 characters' });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return response.status(409).json({ message: 'Email is already registered' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role });
  return response.status(201).json({ token: createToken(user.id), user: publicUser(user) });
};

export const login = async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) return response.status(401).json({ message: 'Invalid email or password' });
  return response.json({ token: createToken(user.id), user: publicUser(user) });
};

export const me = (request, response) => response.json({ user: publicUser(request.user) });
