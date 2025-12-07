import { Request, Response } from 'express';
import { sql } from '../db';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '../utils/auth';
import { UserRegistration, AuthResponse, ApiResponse } from '../../shared/types';
import { cors } from '../middleware/auth';

async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }

  console.log('Registration attempt started');
  console.log('Environment check:', {
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });

  try {
    const { email, password, name } = req.body as UserRegistration;
    console.log('Registration request for email:', email);

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required',
      } as ApiResponse);
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      } as ApiResponse);
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message,
      } as ApiResponse);
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      } as ApiResponse);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name, created_at, updated_at
    `;

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      } as AuthResponse,
    } as ApiResponse<AuthResponse>);
  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message
    } as ApiResponse);
  }
}

export default cors(handler);
