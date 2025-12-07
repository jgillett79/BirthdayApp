import { Router } from 'express';
import { YearlyEventService } from '../services/yearlyEvent.service';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const yearlyEventService = new YearlyEventService(prisma);

// Get all yearly events for a person
router.get('/person/:personId', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { personId } = req.params;
    const events = await yearlyEventService.getYearlyEventsForPerson(
      personId,
      req.householdId
    );
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Get yearly event for specific year
router.get('/person/:personId/year/:year', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { personId, year } = req.params;
    const event = await yearlyEventService.getYearlyEvent(
      personId,
      parseInt(year, 10),
      req.householdId
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Update yearly event
router.put('/person/:personId/year/:year', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { personId, year } = req.params;
    const event = await yearlyEventService.updateYearlyEvent(
      personId,
      parseInt(year, 10),
      req.householdId,
      req.body
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create yearly events for all upcoming birthdays
router.post('/create-upcoming', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const result = await yearlyEventService.createYearlyEventsForUpcoming(
      req.householdId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
