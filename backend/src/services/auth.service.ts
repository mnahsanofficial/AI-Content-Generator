import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiResponse } from '../types';

const JWT_EXPIRES_IN = '7d';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export class AuthService {
  /**
   * Register a new user
   */
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: Partial<IUser>; token: string }>> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), {
        expiresIn: JWT_EXPIRES_IN,
      });

      // Return user without password
      const userResponse = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        success: true,
        data: {
          user: userResponse,
          token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: Partial<IUser>; token: string }>> {
    try {
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), {
        expiresIn: JWT_EXPIRES_IN,
      });

      // Return user without password
      const userResponse = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        success: true,
        data: {
          user: userResponse,
          token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }
}

