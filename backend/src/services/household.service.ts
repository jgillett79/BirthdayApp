import { PrismaClient, MemberRole } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export class HouseholdService {
  constructor(private prisma: PrismaClient) {}

  async createHousehold(userId: string, userName: string, householdName?: string) {
    // Create household with the user as owner
    const household = await this.prisma.household.create({
      data: {
        name: householdName,
        members: {
          create: {
            userId,
            name: userName,
            role: MemberRole.ADULT,
            isOwner: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return household;
  }

  async getHousehold(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        people: {
          include: {
            anchors: {
              include: {
                householdMember: true,
              },
            },
          },
        },
      },
    });

    if (!household) {
      throw new AppError('Household not found', 404);
    }

    return household;
  }

  async joinHousehold(userId: string, userName: string, inviteCode: string) {
    // Find household by invite code
    const household = await this.prisma.household.findUnique({
      where: { inviteCode },
    });

    if (!household) {
      throw new AppError('Invalid invite code', 404);
    }

    // Check if user is already a member
    const existingMember = await this.prisma.householdMember.findFirst({
      where: {
        householdId: household.id,
        userId,
      },
    });

    if (existingMember) {
      throw new AppError('Already a member of this household', 400);
    }

    // Add user as adult member
    const member = await this.prisma.householdMember.create({
      data: {
        householdId: household.id,
        userId,
        name: userName,
        role: MemberRole.ADULT,
        isOwner: false,
      },
    });

    return { household, member };
  }

  async addMember(householdId: string, name: string, role: MemberRole, userId?: string) {
    const member = await this.prisma.householdMember.create({
      data: {
        householdId,
        name,
        role,
        userId,
        isOwner: false,
      },
    });

    return member;
  }

  async removeMember(householdId: string, memberId: string, requestingUserId: string) {
    // Check if requesting user is owner
    const requestingMember = await this.prisma.householdMember.findFirst({
      where: {
        householdId,
        userId: requestingUserId,
        isOwner: true,
      },
    });

    if (!requestingMember) {
      throw new AppError('Only household owner can remove members', 403);
    }

    // Don't allow removing the owner
    const memberToRemove = await this.prisma.householdMember.findUnique({
      where: { id: memberId },
    });

    if (memberToRemove?.isOwner) {
      throw new AppError('Cannot remove household owner', 400);
    }

    await this.prisma.householdMember.delete({
      where: { id: memberId },
    });

    return { success: true };
  }

  async leaveHousehold(householdId: string, userId: string, copyData: boolean) {
    const member = await this.prisma.householdMember.findFirst({
      where: {
        householdId,
        userId,
      },
    });

    if (!member) {
      throw new AppError('Not a member of this household', 404);
    }

    if (member.isOwner) {
      throw new AppError('Owner cannot leave household. Transfer ownership first.', 400);
    }

    let newHousehold = null;

    if (copyData) {
      // Create new household with copied data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const currentHousehold = await this.getHousehold(householdId);

      newHousehold = await this.prisma.household.create({
        data: {
          name: `${user.name}'s Household`,
          members: {
            create: {
              userId,
              name: user.name,
              role: MemberRole.ADULT,
              isOwner: true,
            },
          },
          people: {
            create: currentHousehold.people.map(person => ({
              name: person.name,
              birthdayMonth: person.birthdayMonth,
              birthdayDay: person.birthdayDay,
              birthYear: person.birthYear,
              relationshipType: person.relationshipType,
              notes: person.notes,
              isDeceased: person.isDeceased,
              leapYearPref: person.leapYearPref,
              reminderDays: person.reminderDays,
              reminderTime: person.reminderTime,
            })),
          },
        },
      });
    }

    // Remove from current household
    await this.prisma.householdMember.delete({
      where: { id: member.id },
    });

    return { newHousehold };
  }

  async regenerateInviteCode(householdId: string, userId: string) {
    // Verify user is owner
    const member = await this.prisma.householdMember.findFirst({
      where: {
        householdId,
        userId,
        isOwner: true,
      },
    });

    if (!member) {
      throw new AppError('Only household owner can regenerate invite code', 403);
    }

    const household = await this.prisma.household.update({
      where: { id: householdId },
      data: {
        inviteCode: undefined, // Prisma will generate new UUID
      },
    });

    return household;
  }
}
