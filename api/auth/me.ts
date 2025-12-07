import { Response } from 'express';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { User, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }

  try {
    const result = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ${req.userId}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      } as ApiResponse);
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      } as User,
    } as ApiResponse<User>);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
