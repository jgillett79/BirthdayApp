import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { HouseholdService } from '../services/household.service';
import { prisma } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const authService = new AuthService(prisma);
const householdService = new HouseholdService(prisma);

// Register new user
router.post('/register', async (req: AuthRequest, res, next) => {
  try {
    const { firebaseUid, email, name } = req.body;

    if (!firebaseUid || !name) {
      return res.status(400).json({ error: 'firebaseUid and name are required' });
    }

    const user = await authService.registerUser(firebaseUid, email, name);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await authService.getUser(req.user!.firebaseUid);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await authService.updateUser(req.user!.firebaseUid, { name, email });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Delete user account
router.delete('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    await authService.deleteUser(req.user!.firebaseUid);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
