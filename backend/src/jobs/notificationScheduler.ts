import cron from 'node-cron';
import { prisma } from '../config/database';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService(prisma);

/**
 * Schedule notification job to run daily at 00:05 UTC
 * This will queue birthday reminders for the day
 */
export function startNotificationScheduler() {
  // Run at 00:05 UTC every day
  cron.schedule('5 0 * * *', async () => {
    console.log('🕐 Running daily notification scheduler...');

    try {
      const result = await notificationService.queueBirthdayReminders();
      console.log(`✅ Queued ${result.queued} birthday notifications`);
    } catch (error) {
      console.error('❌ Failed to queue birthday notifications:', error);
    }
  });

  console.log('📅 Notification scheduler started (runs daily at 00:05 UTC)');
}

/**
 * Manual trigger for testing
 */
export async function triggerNotificationsNow() {
  console.log('🚀 Manually triggering notification queue...');

  try {
    const result = await notificationService.queueBirthdayReminders();
    console.log(`✅ Queued ${result.queued} birthday notifications`);
    return result;
  } catch (error) {
    console.error('❌ Failed to queue birthday notifications:', error);
    throw error;
  }
}
