import { Request, Response, NextFunction } from 'express';
import { isFirebaseEnabled, getFirebaseAuth } from '../config/firebase';
import { prisma } from '../config/database';
import { environment } from '../config/environment';

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
    // If Firebase is disabled, use development mode with a test user
    if (!isFirebaseEnabled()) {
      console.log('⚠️  Auth bypassed - Firebase disabled (development mode)');

      // Get or create a test user for development
      let testUser = await prisma.user.findFirst({
        where: { email: 'test@example.com' },
        include: {
          householdMemberships: {
            include: {
              household: true,
            },
          },
        },
      });

      // Create test user if doesn't exist
      if (!testUser) {
        testUser = await prisma.user.create({
          data: {
            firebaseUid: 'test-user-dev',
            email: 'test@example.com',
            name: 'Test User',
          },
          include: {
            householdMemberships: {
              include: {
                household: true,
              },
            },
          },
        });
        console.log('✅ Created test user for development');
      }

      req.user = {
        id: testUser.id,
        firebaseUid: testUser.firebaseUid,
        email: testUser.email,
        name: testUser.name,
      };

      // Attach household ID if user belongs to one
      if (testUser.householdMemberships.length > 0) {
        req.householdId = testUser.householdMemberships[0].householdId;
      }

      return next();
    }

    // Normal Firebase authentication when enabled
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
