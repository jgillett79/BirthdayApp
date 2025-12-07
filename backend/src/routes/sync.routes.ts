import { Router } from 'express';
import { SyncService } from '../services/sync.service';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const syncService = new SyncService(prisma);

// Push changes from client
router.post('/push', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { changes } = req.body;

    if (!Array.isArray(changes)) {
      return res.status(400).json({ error: 'changes must be an array' });
    }

    const result = await syncService.pushChanges(req.householdId, changes);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Pull changes since timestamp
router.get('/pull', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { since } = req.query;

    if (!since) {
      return res.status(400).json({ error: 'since timestamp is required' });
    }

    const timestamp = parseInt(since as string, 10);
    const changes = await syncService.pullChanges(req.householdId, timestamp);
    res.json(changes);
  } catch (error) {
    next(error);
  }
});

export default router;
