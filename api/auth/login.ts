import { Request, Response } from 'express';
import { sql } from '../db';
import { comparePassword, generateToken } from '../utils/auth';
import { UserLogin, AuthResponse, ApiResponse } from '../../shared/types';
import { cors } from '../middleware/auth';

async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }

  try {
    const { email, password } = req.body as UserLogin;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      } as ApiResponse);
    }

    // Find user
    const result = await sql`
      SELECT id, email, name, password_hash, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      } as ApiResponse);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      } as ApiResponse);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });

    return res.status(200).json({
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
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(handler);
