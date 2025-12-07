import { PrismaClient } from '@prisma/client';

interface SyncChange {
  id: string;
  entityType: 'person' | 'yearlyEvent' | 'householdMember';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

export class SyncService {
  constructor(private prisma: PrismaClient) {}

  async pushChanges(householdId: string, changes: SyncChange[]) {
    const results = [];

    for (const change of changes) {
      try {
        let result;

        switch (change.entityType) {
          case 'person':
            result = await this.syncPerson(householdId, change);
            break;
          case 'yearlyEvent':
            result = await this.syncYearlyEvent(householdId, change);
            break;
          case 'householdMember':
            result = await this.syncHouseholdMember(householdId, change);
            break;
          default:
            throw new Error(`Unknown entity type: ${change.entityType}`);
        }

        results.push({ success: true, id: change.id, result });
      } catch (error) {
        console.error(`Failed to sync change ${change.id}:`, error);
        results.push({ success: false, id: change.id, error: (error as Error).message });
      }
    }

    return {
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  async pullChanges(householdId: string, since: number) {
    const sinceDate = new Date(since);

    // Get all entities updated since the given timestamp
    const [people, yearlyEvents, members] = await Promise.all([
      this.prisma.person.findMany({
        where: {
          householdId,
          updatedAt: { gte: sinceDate },
        },
        include: {
          anchors: true,
        },
      }),
      this.prisma.yearlyEvent.findMany({
        where: {
          person: { householdId },
          updatedAt: { gte: sinceDate },
        },
      }),
      this.prisma.householdMember.findMany({
        where: {
          householdId,
          createdAt: { gte: sinceDate },
        },
      }),
    ]);

    return {
      people,
      yearlyEvents,
      members,
      timestamp: Date.now(),
    };
  }

  private async syncPerson(householdId: string, change: SyncChange) {
    switch (change.operation) {
      case 'create':
      case 'update':
        return await this.prisma.person.upsert({
          where: { id: change.entityId },
          update: {
            ...change.data,
            householdId,
          },
          create: {
            id: change.entityId,
            ...change.data,
            householdId,
          },
          include: {
            anchors: true,
          },
        });

      case 'delete':
        return await this.prisma.person.delete({
          where: { id: change.entityId },
        });

      default:
        throw new Error(`Unknown operation: ${change.operation}`);
    }
  }

  private async syncYearlyEvent(householdId: string, change: SyncChange) {
    // Verify person belongs to household
    const person = await this.prisma.person.findFirst({
      where: {
        id: change.data.personId,
        householdId,
      },
    });

    if (!person) {
      throw new Error('Person not found in household');
    }

    switch (change.operation) {
      case 'create':
      case 'update':
        return await this.prisma.yearlyEvent.upsert({
          where: {
            personId_year: {
              personId: change.data.personId,
              year: change.data.year,
            },
          },
          update: change.data,
          create: {
            id: change.entityId,
            ...change.data,
          },
        });

      case 'delete':
        return await this.prisma.yearlyEvent.delete({
          where: { id: change.entityId },
        });

      default:
        throw new Error(`Unknown operation: ${change.operation}`);
    }
  }

  private async syncHouseholdMember(householdId: string, change: SyncChange) {
    switch (change.operation) {
      case 'create':
      case 'update':
        return await this.prisma.householdMember.upsert({
          where: { id: change.entityId },
          update: {
            ...change.data,
            householdId,
          },
          create: {
            id: change.entityId,
            ...change.data,
            householdId,
          },
        });

      case 'delete':
        return await this.prisma.householdMember.delete({
          where: { id: change.entityId },
        });

      default:
        throw new Error(`Unknown operation: ${change.operation}`);
    }
  }
}
