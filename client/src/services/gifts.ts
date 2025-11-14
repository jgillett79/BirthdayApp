import { GiftIdea, CreateGiftIdea, GiftSuggestion, GiftSuggestionRequest } from '@shared/types';
import { api } from './api';

export async function getGiftIdeas(eventId?: string): Promise<GiftIdea[]> {
  const query = eventId ? `?eventId=${eventId}` : '';
  return api.get<GiftIdea[]>(`/gifts${query}`);
}

export async function createGiftIdea(gift: CreateGiftIdea): Promise<GiftIdea> {
  return api.post<GiftIdea>('/gifts', gift);
}

export async function getGiftSuggestions(
  request: GiftSuggestionRequest
): Promise<GiftSuggestion[]> {
  return api.post<GiftSuggestion[]>('/gifts/suggestions', request);
}
