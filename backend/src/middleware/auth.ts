import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    email: string | null;
    name: string;
  };
  householdId?: string;
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify Firebase token
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        householdMemberships: {
          include: {
            household: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
    };

    // Attach household ID if user belongs to one
    if (user.householdMemberships.length > 0) {
      req.householdId = user.householdMemberships[0].householdId;
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
