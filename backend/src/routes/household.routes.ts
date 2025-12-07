import { Router } from 'express';
import { HouseholdService } from '../services/household.service';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { MemberRole } from '@prisma/client';

const router = Router();
const householdService = new HouseholdService(prisma);

// Create household
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id;
    const userName = req.user!.name;

    const household = await householdService.createHousehold(userId, userName, name);
    res.status(201).json(household);
  } catch (error) {
    next(error);
  }
});

// Get user's household
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'No household found' });
    }

    const household = await householdService.getHousehold(req.householdId);
    res.json(household);
  } catch (error) {
    next(error);
  }
});

// Join household with invite code
router.post('/join', async (req: AuthRequest, res, next) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user!.id;
    const userName = req.user!.name;

    if (!inviteCode) {
      return res.status(400).json({ error: 'inviteCode is required' });
    }

    const result = await householdService.joinHousehold(userId, userName, inviteCode);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Leave household
router.post('/leave', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { copyData } = req.body;
    const userId = req.user!.id;

    const result = await householdService.leaveHousehold(
      req.householdId,
      userId,
      copyData || false
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Add household member
router.post('/members', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { name, role, userId } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'name and role are required' });
    }

    const member = await householdService.addMember(
      req.householdId,
      name,
      role as MemberRole,
      userId
    );
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

// Remove household member
router.delete('/members/:id', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { id } = req.params;
    const userId = req.user!.id;

    const result = await householdService.removeMember(req.householdId, id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Regenerate invite code
router.post('/invite-code/regenerate', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const userId = req.user!.id;
    const household = await householdService.regenerateInviteCode(req.householdId, userId);
    res.json({ inviteCode: household.inviteCode });
  } catch (error) {
    next(error);
  }
});

export default router;
