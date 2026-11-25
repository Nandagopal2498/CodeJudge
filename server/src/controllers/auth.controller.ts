import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const COOKIE_NAME = 'token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Username, email, and password are required' });
      return;
    }

    if (username.length < 3 || username.length > 30) {
      res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existingEmail = UserModel.findByEmail(email);
    if (existingEmail) {
      res.status(409).json({ message: 'Email is already registered' });
      return;
    }

    const existingUsername = UserModel.findByUsername(username);
    if (existingUsername) {
      res.status(409).json({ message: 'Username is already taken' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = UserModel.create(username, email, passwordHash);
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Email/Username and password are required' });
      return;
    }

    let user = UserModel.findByEmail(emailOrUsername);
    if (!user) {
      user = UserModel.findByUsername(emailOrUsername);
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
}

export function getMe(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const user = UserModel.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({ user });
}
