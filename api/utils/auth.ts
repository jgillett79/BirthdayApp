import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../shared/types';

// Get JWT_SECRET from environment with validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Validate JWT_SECRET is set and has minimum length
if (!JWT_SECRET) {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    console.error('   This is required for secure token generation and verification.');
    console.error('   Set JWT_SECRET to a strong random string before deploying to production.');
    process.exit(1);
  } else {
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using insecure development default.');
    console.warn('   This WILL cause authentication to fail if you restart the server.');
    console.warn('   Set JWT_SECRET environment variable for consistent token verification.');
  }
}

// Use the secret if provided, otherwise use a development default
const FINAL_JWT_SECRET = JWT_SECRET || 'dev-insecure-secret-do-not-use-in-production';

export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, FINAL_JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, FINAL_JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one letter',
    };
  }

  return { valid: true };
}
