import { VercelResponse } from '@vercel/node';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { UpcomingEvent, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }

  try {
    const { days = 30 } = req.query;
    const daysAhead = parseInt(days as string, 10);

    // Query to get upcoming events
    const result = await sql`
      WITH upcoming AS (
        SELECT
          e.*,
          fm.id as family_member_id_full,
          fm.user_id as family_member_user_id,
          fm.name as family_member_name,
          fm.relationship as family_member_relationship,
          fm.created_at as family_member_created_at,
          fm.updated_at as family_member_updated_at,
          CASE
            WHEN e.recurring_yearly THEN
              -- Calculate next occurrence for recurring events
              CASE
                WHEN DATE_PART('doy', e.date) >= DATE_PART('doy', CURRENT_DATE) THEN
                  DATE_PART('doy', e.date) - DATE_PART('doy', CURRENT_DATE)
                ELSE
                  365 + DATE_PART('doy', e.date) - DATE_PART('doy', CURRENT_DATE)
              END
            ELSE
              -- For non-recurring, calculate days until the actual date
              e.date - CURRENT_DATE
          END as days_until
        FROM events e
        LEFT JOIN family_members fm ON e.family_member_id = fm.id
        WHERE e.user_id = ${req.userId}
          AND e.reminder_enabled = true
      )
      SELECT * FROM upcoming
      WHERE days_until >= 0 AND days_until <= ${daysAhead}
      ORDER BY days_until ASC
    `;

    const upcomingEvents: UpcomingEvent[] = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      date: row.date,
      type: row.type,
      birthYear: row.birth_year,
      familyMemberId: row.family_member_id,
      relationshipToMember: row.relationship_to_member,
      notes: row.notes,
      recurringYearly: row.recurring_yearly,
      notificationDays: row.notification_days,
      reminderEnabled: row.reminder_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      daysUntil: parseInt(row.days_until, 10),
      familyMember: row.family_member_name ? {
        id: row.family_member_id_full,
        userId: row.family_member_user_id,
        name: row.family_member_name,
        relationship: row.family_member_relationship,
        createdAt: row.family_member_created_at,
        updatedAt: row.family_member_updated_at,
      } : undefined,
    }));

    return res.status(200).json({
      success: true,
      data: upcomingEvents,
    } as ApiResponse<UpcomingEvent[]>);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
