import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Middleware to authenticate requests
 */
export function authenticate(
  handler: (req: AuthenticatedRequest, res: Response) => Promise<any>
) {
  return async (req: AuthenticatedRequest, res: Response) => {
    try {
      const token = extractToken(req.headers.authorization as string);

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No authentication token provided',
        });
      }

      const payload = verifyToken(token);
      req.userId = payload.userId;
      req.userEmail = payload.email;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  };
}

/**
 * Handle CORS
 */
export function cors(handler: Function) {
  return async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}
