import { PrismaClient } from '@prisma/client';
import { getFirebaseMessaging } from '../config/firebase';
import { DateUtils } from '../utils/dateUtils';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  async sendNotification(userId: string, fcmToken: string, payload: NotificationPayload) {
    try {
      const message = await getFirebaseMessaging().send({
        token: fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });

      return { success: true, messageId: message };
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  async queueBirthdayReminders() {
    // Get all people with birthdays in the next 30 days
    const people = await this.prisma.person.findMany({
      include: {
        household: {
          include: {
            members: {
              where: {
                userId: { not: null },
              },
              include: {
                user: true,
              },
            },
          },
        },
        anchors: {
          include: {
            householdMember: true,
          },
        },
      },
    });

    const notifications = [];
    const currentYear = new Date().getFullYear();

    for (const person of people) {
      const daysUntil = DateUtils.daysUntilBirthday(
        person.birthdayMonth,
        person.birthdayDay
      );

      // Get reminder days (use person's custom or default [7, 1, 0])
      const reminderDays = person.reminderDays && person.reminderDays.length > 0
        ? person.reminderDays
        : [7, 1, 0];

      // Check if we should send a reminder today
      for (const daysBefore of reminderDays) {
        if (daysUntil === daysBefore) {
          // Send to all adult members of the household
          for (const member of person.household.members) {
            if (member.user) {
              // Check if we already sent this notification
              const existing = await this.prisma.notificationLog.findUnique({
                where: {
                  userId_personId_year_daysBefore: {
                    userId: member.user.id,
                    personId: person.id,
                    year: currentYear,
                    daysBefore,
                  },
                },
              });

              if (!existing) {
                // Create notification payload
                const age = person.birthYear
                  ? DateUtils.calculateAge(person.birthYear, person.birthdayMonth, person.birthdayDay) + 1
                  : null;

                const title = this.createNotificationTitle(person.name, age, daysUntil);
                const body = this.createNotificationBody(person, member.name);

                notifications.push({
                  userId: member.user.id,
                  personId: person.id,
                  year: currentYear,
                  daysBefore,
                  title,
                  body,
                  data: {
                    personId: person.id,
                    type: 'birthday_reminder',
                    daysUntil: String(daysUntil),
                  },
                });
              }
            }
          }
        }
      }
    }

    // Log notifications (in production, send via FCM)
    for (const notif of notifications) {
      await this.prisma.notificationLog.create({
        data: {
          userId: notif.userId,
          personId: notif.personId,
          year: notif.year,
          daysBefore: notif.daysBefore,
        },
      });

      // TODO: Send actual notification via FCM when we have device tokens
      console.log(`📬 Notification: ${notif.title} - ${notif.body}`);
    }

    return { queued: notifications.length };
  }

  private createNotificationTitle(name: string, age: number | null, daysUntil: number): string {
    if (daysUntil === 0) {
      return age ? `🎂 ${name} turns ${age} today!` : `🎂 ${name}'s birthday is today!`;
    } else if (daysUntil === 1) {
      return age ? `🎂 ${name} turns ${age} tomorrow` : `🎂 ${name}'s birthday is tomorrow`;
    } else {
      return age
        ? `🎂 ${name} turns ${age} in ${daysUntil} days`
        : `🎂 ${name}'s birthday in ${daysUntil} days`;
    }
  }

  private createNotificationBody(person: any, memberName: string): string {
    // Find if this person is anchored to the member
    const anchor = person.anchors.find(
      (a: any) => a.householdMember.name === memberName
    );

    if (anchor) {
      return `${memberName}'s ${person.relationshipType?.toLowerCase() || 'connection'}`;
    }

    // Check if anchored to others
    if (person.anchors.length > 0) {
      const anchorNames = person.anchors.map((a: any) => a.householdMember.name).join(', ');
      return `${anchorNames}'s ${person.relationshipType?.toLowerCase() || 'connection'}`;
    }

    return person.relationshipType || 'Birthday reminder';
  }
}
