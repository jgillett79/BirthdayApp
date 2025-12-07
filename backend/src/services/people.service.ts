import { PrismaClient, RelationshipType, LeapYearPreference } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { DateUtils } from '../utils/dateUtils';

interface CreatePersonInput {
  householdId: string;
  name: string;
  birthdayMonth: number;
  birthdayDay: number;
  birthYear?: number;
  relationshipType?: RelationshipType;
  notes?: string;
  isDeceased?: boolean;
  leapYearPref?: LeapYearPreference;
  reminderDays?: number[];
  reminderTime?: string;
  anchorMemberIds?: string[];
}

interface UpdatePersonInput extends Partial<CreatePersonInput> {
  id: string;
}

export class PeopleService {
  constructor(private prisma: PrismaClient) {}

  async createPerson(input: CreatePersonInput, createdByUserId: string) {
    // Validate date
    if (!DateUtils.isValidDate(input.birthdayMonth, input.birthdayDay)) {
      throw new AppError('Invalid birthday date', 400);
    }

    const { anchorMemberIds, ...personData } = input;

    const person = await this.prisma.person.create({
      data: {
        ...personData,
        createdByUserId,
        anchors: anchorMemberIds
          ? {
              create: anchorMemberIds.map(memberId => ({
                householdMemberId: memberId,
              })),
            }
          : undefined,
      },
      include: {
        anchors: {
          include: {
            householdMember: true,
          },
        },
      },
    });

    // Create yearly event if birthday is within 60 days
    const daysUntil = DateUtils.daysUntilBirthday(
      person.birthdayMonth,
      person.birthdayDay
    );

    if (daysUntil <= 60) {
      const currentYear = new Date().getFullYear();
      await this.prisma.yearlyEvent.create({
        data: {
          personId: person.id,
          year: daysUntil === 0 ? currentYear : currentYear + (person.birthdayMonth < new Date().getMonth() + 1 ? 1 : 0),
        },
      });
    }

    return person;
  }

  async updatePerson(input: UpdatePersonInput) {
    const { id, anchorMemberIds, ...updateData } = input;

    // Validate date if provided
    if (input.birthdayMonth && input.birthdayDay) {
      if (!DateUtils.isValidDate(input.birthdayMonth, input.birthdayDay)) {
        throw new AppError('Invalid birthday date', 400);
      }
    }

    // Update person
    const person = await this.prisma.person.update({
      where: { id },
      data: updateData,
      include: {
        anchors: {
          include: {
            householdMember: true,
          },
        },
      },
    });

    // Update anchors if provided
    if (anchorMemberIds !== undefined) {
      // Delete existing anchors
      await this.prisma.personAnchor.deleteMany({
        where: { personId: id },
      });

      // Create new anchors
      if (anchorMemberIds.length > 0) {
        await this.prisma.personAnchor.createMany({
          data: anchorMemberIds.map(memberId => ({
            personId: id,
            householdMemberId: memberId,
          })),
        });
      }
    }

    return person;
  }

  async deletePerson(personId: string, householdId: string) {
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

    await this.prisma.person.delete({
      where: { id: personId },
    });

    return { success: true };
  }

  async getPerson(personId: string, householdId: string) {
    const person = await this.prisma.person.findFirst({
      where: {
        id: personId,
        householdId,
      },
      include: {
        anchors: {
          include: {
            householdMember: true,
          },
        },
        yearlyEvents: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });

    if (!person) {
      throw new AppError('Person not found', 404);
    }

    // Calculate age and days until birthday
    const age = person.birthYear
      ? DateUtils.calculateAge(person.birthYear, person.birthdayMonth, person.birthdayDay)
      : null;

    const daysUntil = DateUtils.daysUntilBirthday(
      person.birthdayMonth,
      person.birthdayDay
    );

    const zodiacSign = DateUtils.getZodiacSign(person.birthdayMonth, person.birthdayDay);

    return {
      ...person,
      age,
      daysUntil,
      zodiacSign,
    };
  }

  async getPeople(householdId: string, filters?: {
    anchorMemberId?: string;
    relationshipType?: RelationshipType;
    search?: string;
  }) {
    const where: any = { householdId };

    if (filters?.anchorMemberId) {
      where.anchors = {
        some: {
          householdMemberId: filters.anchorMemberId,
        },
      };
    }

    if (filters?.relationshipType) {
      where.relationshipType = filters.relationshipType;
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const people = await this.prisma.person.findMany({
      where,
      include: {
        anchors: {
          include: {
            householdMember: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Add calculated fields
    return people.map(person => {
      const age = person.birthYear
        ? DateUtils.calculateAge(person.birthYear, person.birthdayMonth, person.birthdayDay)
        : null;

      const daysUntil = DateUtils.daysUntilBirthday(
        person.birthdayMonth,
        person.birthdayDay
      );

      const zodiacSign = DateUtils.getZodiacSign(person.birthdayMonth, person.birthdayDay);

      return {
        ...person,
        age,
        daysUntil,
        zodiacSign,
      };
    });
  }

  async getUpcomingBirthdays(householdId: string, daysAhead: number = 30) {
    const people = await this.getPeople(householdId);

    // Filter and sort by days until birthday
    const upcoming = people
      .filter(p => p.daysUntil <= daysAhead)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    return upcoming;
  }

  async importFromContacts(householdId: string, contacts: CreatePersonInput[], userId: string) {
    const created = [];

    for (const contact of contacts) {
      try {
        const person = await this.createPerson(
          { ...contact, householdId },
          userId
        );
        created.push(person);
      } catch (error) {
        console.error(`Failed to import contact: ${contact.name}`, error);
        // Continue with other contacts
      }
    }

    return { imported: created.length, total: contacts.length, people: created };
  }
}
