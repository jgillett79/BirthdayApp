import { Router } from 'express';
import { PeopleService } from '../services/people.service';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { RelationshipType, LeapYearPreference } from '@prisma/client';

const router = Router();
const peopleService = new PeopleService(prisma);

// Get all people in household
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { anchorMemberId, relationshipType, search } = req.query;

    const people = await peopleService.getPeople(req.householdId, {
      anchorMemberId: anchorMemberId as string,
      relationshipType: relationshipType as RelationshipType,
      search: search as string,
    });

    res.json(people);
  } catch (error) {
    next(error);
  }
});

// Get upcoming birthdays
router.get('/upcoming', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { days } = req.query;
    const daysAhead = days ? parseInt(days as string, 10) : 30;

    const people = await peopleService.getUpcomingBirthdays(req.householdId, daysAhead);
    res.json(people);
  } catch (error) {
    next(error);
  }
});

// Create person
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const {
      name,
      birthdayMonth,
      birthdayDay,
      birthYear,
      relationshipType,
      notes,
      isDeceased,
      leapYearPref,
      reminderDays,
      reminderTime,
      anchorMemberIds,
    } = req.body;

    if (!name || !birthdayMonth || !birthdayDay) {
      return res.status(400).json({
        error: 'name, birthdayMonth, and birthdayDay are required',
      });
    }

    const person = await peopleService.createPerson(
      {
        householdId: req.householdId,
        name,
        birthdayMonth,
        birthdayDay,
        birthYear,
        relationshipType,
        notes,
        isDeceased,
        leapYearPref,
        reminderDays,
        reminderTime,
        anchorMemberIds,
      },
      req.user!.id
    );

    res.status(201).json(person);
  } catch (error) {
    next(error);
  }
});

// Get person by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { id } = req.params;
    const person = await peopleService.getPerson(id, req.householdId);
    res.json(person);
  } catch (error) {
    next(error);
  }
});

// Update person
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { id } = req.params;
    const person = await peopleService.updatePerson({ id, ...req.body });
    res.json(person);
  } catch (error) {
    next(error);
  }
});

// Delete person
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { id } = req.params;
    const result = await peopleService.deletePerson(id, req.householdId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Import from contacts
router.post('/import', async (req: AuthRequest, res, next) => {
  try {
    if (!req.householdId) {
      return res.status(404).json({ error: 'Not a member of any household' });
    }

    const { contacts } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ error: 'contacts must be an array' });
    }

    const result = await peopleService.importFromContacts(
      req.householdId,
      contacts,
      req.user!.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
