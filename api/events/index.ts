import { VercelResponse } from '@vercel/node';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { Event, CreateEvent, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return getEvents(req, res);
  } else if (req.method === 'POST') {
    return createEvent(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }
}

async function getEvents(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const result = await sql`
      SELECT
        e.*,
        fm.name as family_member_name,
        fm.relationship as family_member_relationship
      FROM events e
      LEFT JOIN family_members fm ON e.family_member_id = fm.id
      WHERE e.user_id = ${req.userId}
      ORDER BY EXTRACT(MONTH FROM e.date), EXTRACT(DAY FROM e.date)
    `;

    const events = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      date: row.date,
      type: row.type,
      familyMemberId: row.family_member_id,
      relationshipToMember: row.relationship_to_member,
      notes: row.notes,
      recurringYearly: row.recurring_yearly,
      notificationDays: row.notification_days,
      reminderEnabled: row.reminder_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return res.status(200).json({
      success: true,
      data: events,
    } as ApiResponse<Event[]>);
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function createEvent(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const eventData = req.body as CreateEvent;

    // Validate required fields
    if (!eventData.name || !eventData.date || !eventData.type) {
      return res.status(400).json({
        success: false,
        error: 'Name, date, and type are required',
      } as ApiResponse);
    }

    const result = await sql`
      INSERT INTO events (
        user_id,
        name,
        date,
        type,
        family_member_id,
        relationship_to_member,
        notes,
        recurring_yearly,
        notification_days,
        reminder_enabled
      ) VALUES (
        ${req.userId},
        ${eventData.name},
        ${eventData.date},
        ${eventData.type},
        ${eventData.familyMemberId || null},
        ${eventData.relationshipToMember || null},
        ${eventData.notes || null},
        ${eventData.recurringYearly !== undefined ? eventData.recurringYearly : true},
        ${eventData.notificationDays ? eventData.notificationDays : [1, 7]},
        ${eventData.reminderEnabled !== undefined ? eventData.reminderEnabled : true}
      )
      RETURNING *
    `;

    const event = result.rows[0];

    return res.status(201).json({
      success: true,
      data: {
        id: event.id,
        userId: event.user_id,
        name: event.name,
        date: event.date,
        type: event.type,
        familyMemberId: event.family_member_id,
        relationshipToMember: event.relationship_to_member,
        notes: event.notes,
        recurringYearly: event.recurring_yearly,
        notificationDays: event.notification_days,
        reminderEnabled: event.reminder_enabled,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      } as Event,
    } as ApiResponse<Event>);
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
