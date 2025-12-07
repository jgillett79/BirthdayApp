import { VercelResponse } from '@vercel/node';
import { sql } from '../db';
import { authenticate, AuthenticatedRequest, cors } from '../middleware/auth';
import { FamilyMember, CreateFamilyMember, ApiResponse } from '../../shared/types';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return getFamilyMembers(req, res);
  } else if (req.method === 'POST') {
    return createFamilyMember(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    } as ApiResponse);
  }
}

async function getFamilyMembers(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const result = await sql`
      SELECT * FROM family_members
      WHERE user_id = ${req.userId}
      ORDER BY name ASC
    `;

    const familyMembers = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      relationship: row.relationship,
      avatar: row.avatar,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return res.status(200).json({
      success: true,
      data: familyMembers,
    } as ApiResponse<FamilyMember[]>);
  } catch (error) {
    console.error('Get family members error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

async function createFamilyMember(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const memberData = req.body as CreateFamilyMember;

    if (!memberData.name || !memberData.relationship) {
      return res.status(400).json({
        success: false,
        error: 'Name and relationship are required',
      } as ApiResponse);
    }

    const result = await sql`
      INSERT INTO family_members (user_id, name, relationship, avatar)
      VALUES (${req.userId}, ${memberData.name}, ${memberData.relationship}, ${memberData.avatar || null})
      RETURNING *
    `;

    const member = result.rows[0];

    return res.status(201).json({
      success: true,
      data: {
        id: member.id,
        userId: member.user_id,
        name: member.name,
        relationship: member.relationship,
        avatar: member.avatar,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
      } as FamilyMember,
    } as ApiResponse<FamilyMember>);
  } catch (error) {
    console.error('Create family member error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
}

export default cors(authenticate(handler));
