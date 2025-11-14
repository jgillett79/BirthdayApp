import { FamilyMember, CreateFamilyMember } from '@shared/types';
import { api } from './api';

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  return api.get<FamilyMember[]>('/family-members');
}

export async function createFamilyMember(member: CreateFamilyMember): Promise<FamilyMember> {
  return api.post<FamilyMember>('/family-members', member);
}
