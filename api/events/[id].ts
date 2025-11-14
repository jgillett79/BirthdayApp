import { VercelResponse } from '@vercel/node';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { Event, UpdateEvent, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Event ID is required',
    } as ApiResponse);
  }

  if (req.method === 'GET') {
    return getEvent(req, res, id);
  } else if (req.method === 'PUT') {
    return updateEvent(req, res, id);
  } else if (req.method === 'DELETE') {
    return deleteEvent(req, res, id);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }
}

async function getEvent(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const result = await sql`
      SELECT * FROM events
      WHERE id = ${id} AND user_id = ${req.userId}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      } as ApiResponse);
    }

    const event = result.rows[0];

    return res.status(200).json({
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
    console.error('Get event error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function updateEvent(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const eventData = req.body as Partial<UpdateEvent>;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (eventData.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(eventData.name);
    }
    if (eventData.date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(eventData.date);
    }
    if (eventData.type !== undefined) {
      updates.push(`type = $${paramIndex++}`);
      values.push(eventData.type);
    }
    if (eventData.familyMemberId !== undefined) {
      updates.push(`family_member_id = $${paramIndex++}`);
      values.push(eventData.familyMemberId);
    }
    if (eventData.relationshipToMember !== undefined) {
      updates.push(`relationship_to_member = $${paramIndex++}`);
      values.push(eventData.relationshipToMember);
    }
    if (eventData.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(eventData.notes);
    }
    if (eventData.recurringYearly !== undefined) {
      updates.push(`recurring_yearly = $${paramIndex++}`);
      values.push(eventData.recurringYearly);
    }
    if (eventData.notificationDays !== undefined) {
      updates.push(`notification_days = $${paramIndex++}`);
      values.push(eventData.notificationDays);
    }
    if (eventData.reminderEnabled !== undefined) {
      updates.push(`reminder_enabled = $${paramIndex++}`);
      values.push(eventData.reminderEnabled);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      } as ApiResponse);
    }

    values.push(id, req.userId);

    const result = await sql.query(
      `UPDATE events
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      } as ApiResponse);
    }

    const event = result.rows[0];

    return res.status(200).json({
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
    console.error('Update event error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function deleteEvent(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const result = await sql`
      DELETE FROM events
      WHERE id = ${id} AND user_id = ${req.userId}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      } as ApiResponse);
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
