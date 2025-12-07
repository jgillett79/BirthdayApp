import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

interface UpdateYearlyEventInput {
  partyDate?: Date;
  partyTime?: string;
  partyLocation?: string;
  giftBought?: boolean;
  giftDescription?: string;
  rsvpSent?: boolean;
  cardSent?: boolean;
  notes?: string;
}

export class YearlyEventService {
  constructor(private prisma: PrismaClient) {}

  async getYearlyEvent(personId: string, year: number, householdId: string) {
    // Verify person belongs to household
    const person = await this.prisma.person.findFirst({
      where: {
        id: personId,
        householdId,
      },
    });

    if (!person) {
      throw new AppError('Person not found in this household', 404);
    }

    let yearlyEvent = await this.prisma.yearlyEvent.findUnique({
      where: {
        personId_year: {
          personId,
          year,
        },
      },
    });

    // Create if doesn't exist
    if (!yearlyEvent) {
      yearlyEvent = await this.prisma.yearlyEvent.create({
        data: {
          personId,
          year,
        },
      });
    }

    return yearlyEvent;
  }

  async updateYearlyEvent(
    personId: string,
    year: number,
    householdId: string,
    data: UpdateYearlyEventInput
  ) {
    // Verify person belongs to household
    const person = await this.prisma.person.findFirst({
      where: {
        id: personId,
        householdId,
      },
    });

    if (!person) {
      throw new AppError('Person not found in this household', 404);
    }

    const yearlyEvent = await this.prisma.yearlyEvent.upsert({
      where: {
        personId_year: {
          personId,
          year,
        },
      },
      update: data,
      create: {
        personId,
        year,
        ...data,
      },
    });

    return yearlyEvent;
  }

  async getYearlyEventsForPerson(personId: string, householdId: string) {
    // Verify person belongs to household
    const person = await this.prisma.person.findFirst({
      where: {
        id: personId,
        householdId,
      },
    });

    if (!person) {
      throw new AppError('Person not found in this household', 404);
    }

    const events = await this.prisma.yearlyEvent.findMany({
      where: { personId },
      orderBy: {
        year: 'desc',
      },
    });

    return events;
  }

  async createYearlyEventsForUpcoming(householdId: string) {
    // Get all people in household
    const people = await this.prisma.person.findMany({
      where: { householdId },
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const created = [];

    for (const person of people) {
      // Calculate which year the upcoming birthday is in
      const birthdayYear = person.birthdayMonth < currentMonth
        ? currentYear + 1
        : currentYear;

      // Check if yearly event exists
      const existing = await this.prisma.yearlyEvent.findUnique({
        where: {
          personId_year: {
            personId: person.id,
            year: birthdayYear,
          },
        },
      });

      if (!existing) {
        const yearlyEvent = await this.prisma.yearlyEvent.create({
          data: {
            personId: person.id,
            year: birthdayYear,
          },
        });
        created.push(yearlyEvent);
      }
    }

    return { created: created.length };
  }
}
