import { VercelResponse } from '@vercel/node';
import { sql, query } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { GiftIdea, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Gift ID is required',
    } as ApiResponse);
  }

  if (req.method === 'GET') {
    return getGiftIdea(req, res, id);
  } else if (req.method === 'PUT') {
    return updateGiftIdea(req, res, id);
  } else if (req.method === 'DELETE') {
    return deleteGiftIdea(req, res, id);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }
}

async function getGiftIdea(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const result = await sql`
      SELECT * FROM gift_ideas
      WHERE id = ${id} AND user_id = ${req.userId}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Gift idea not found',
      } as ApiResponse);
    }

    const giftIdea = result.rows[0];

    return res.status(200).json({
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
    console.error('Get gift idea error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function updateGiftIdea(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const giftData = req.body as Partial<GiftIdea>;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (giftData.idea !== undefined) {
      updates.push(`idea = $${paramIndex++}`);
      values.push(giftData.idea);
    }
    if (giftData.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(giftData.price);
    }
    if (giftData.url !== undefined) {
      updates.push(`url = $${paramIndex++}`);
      values.push(giftData.url);
    }
    if (giftData.purchased !== undefined) {
      updates.push(`purchased = $${paramIndex++}`);
      values.push(giftData.purchased);
    }
    if (giftData.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(giftData.notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      } as ApiResponse);
    }

    values.push(id, req.userId);

    const result = await query(
      `UPDATE gift_ideas
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Gift idea not found',
      } as ApiResponse);
    }

    const giftIdea = result.rows[0];

    return res.status(200).json({
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
    console.error('Update gift idea error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function deleteGiftIdea(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  try {
    const result = await sql`
      DELETE FROM gift_ideas
      WHERE id = ${id} AND user_id = ${req.userId}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Gift idea not found',
      } as ApiResponse);
    }

    return res.status(200).json({
      success: true,
      message: 'Gift idea deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Delete gift idea error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
