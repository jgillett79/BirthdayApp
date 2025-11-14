import { VercelResponse } from '@vercel/node';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { GiftIdea, CreateGiftIdea, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return getGiftIdeas(req, res);
  } else if (req.method === 'POST') {
    return createGiftIdea(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }
}

async function getGiftIdeas(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const { eventId } = req.query;

    let result;
    if (eventId) {
      result = await sql`
        SELECT * FROM gift_ideas
        WHERE user_id = ${req.userId} AND event_id = ${eventId as string}
        ORDER BY created_at DESC
      `;
    } else {
      result = await sql`
        SELECT * FROM gift_ideas
        WHERE user_id = ${req.userId}
        ORDER BY created_at DESC
      `;
    }

    const giftIdeas = result.rows.map(row => ({
      id: row.id,
      eventId: row.event_id,
      userId: row.user_id,
      idea: row.idea,
      price: row.price,
      url: row.url,
      purchased: row.purchased,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return res.status(200).json({
      success: true,
      data: giftIdeas,
    } as ApiResponse<GiftIdea[]>);
  } catch (error) {
    console.error('Get gift ideas error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function createGiftIdea(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const giftData = req.body as CreateGiftIdea;

    if (!giftData.eventId || !giftData.idea) {
      return res.status(400).json({
        success: false,
        error: 'Event ID and idea are required',
      } as ApiResponse);
    }

    const result = await sql`
      INSERT INTO gift_ideas (user_id, event_id, idea, price, url, notes)
      VALUES (
        ${req.userId},
        ${giftData.eventId},
        ${giftData.idea},
        ${giftData.price || null},
        ${giftData.url || null},
        ${giftData.notes || null}
      )
      RETURNING *
    `;

    const giftIdea = result.rows[0];

    return res.status(201).json({
      success: true,
      data: {
        id: giftIdea.id,
        eventId: giftIdea.event_id,
        userId: giftIdea.user_id,
        idea: giftIdea.idea,
        price: giftIdea.price,
        url: giftIdea.url,
        purchased: giftIdea.purchased,
        notes: giftIdea.notes,
        createdAt: giftIdea.created_at,
        updatedAt: giftIdea.updated_at,
      } as GiftIdea,
    } as ApiResponse<GiftIdea>);
  } catch (error) {
    console.error('Create gift idea error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
