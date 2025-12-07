import { PrismaClient } from '@prisma/client';
import { getFirebaseAuth } from '../config/firebase';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async registerUser(firebaseUid: string, email: string | null, name: string) {
    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (user) {
      return user;
    }

    // Create new user
    user = await this.prisma.user.create({
      data: {
        firebaseUid,
        email,
        name,
      },
    });

    return user;
  }

  async getUser(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        householdMemberships: {
          include: {
            household: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(firebaseUid: string, data: { name?: string; email?: string }) {
    const user = await this.prisma.user.update({
      where: { firebaseUid },
      data,
    });

    return user;
  }

  async deleteUser(firebaseUid: string) {
    // Delete from Firebase
    try {
      await getFirebaseAuth().deleteUser(firebaseUid);
    } catch (error) {
      console.error('Failed to delete Firebase user:', error);
    }

    // Delete from database (will cascade to household memberships)
    await this.prisma.user.delete({
      where: { firebaseUid },
    });

    return { success: true };
  }
}
