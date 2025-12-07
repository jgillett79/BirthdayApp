import { Response } from 'express';
import { sql, query } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { Event, CreateEvent, UpdateEvent, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: Response) {
  const { id } = req.query;

  // Handle single event operations when id is provided
  if (id && typeof id === 'string') {
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

  // Handle collection operations when no id
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

async function getEvents(req: AuthenticatedRequest, res: Response) {
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
      birthYear: row.birth_year,
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

async function createEvent(req: AuthenticatedRequest, res: Response) {
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
        birth_year,
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
        ${eventData.birthYear || null},
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
        birthYear: event.birth_year,
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

async function getEvent(req: AuthenticatedRequest, res: Response, id: string) {
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
        birthYear: event.birth_year,
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

async function updateEvent(req: AuthenticatedRequest, res: Response, id: string) {
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
    if (eventData.birthYear !== undefined) {
      updates.push(`birth_year = $${paramIndex++}`);
      values.push(eventData.birthYear);
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

    const result = await query(
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
        birthYear: event.birth_year,
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

async function deleteEvent(req: AuthenticatedRequest, res: Response, id: string) {
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
