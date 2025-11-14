import { Event, CreateEvent, UpdateEvent, UpcomingEvent } from '@shared/types';
import { api } from './api';

export async function getEvents(): Promise<Event[]> {
  return api.get<Event[]>('/events');
}

export async function getEvent(id: string): Promise<Event> {
  return api.get<Event>(`/events/${id}`);
}

export async function createEvent(event: CreateEvent): Promise<Event> {
  return api.post<Event>('/events', event);
}

export async function updateEvent(id: string, event: Partial<UpdateEvent>): Promise<Event> {
  return api.put<Event>(`/events/${id}`, event);
}

export async function deleteEvent(id: string): Promise<void> {
  return api.delete(`/events/${id}`);
}

export async function getUpcomingEvents(days: number = 30): Promise<UpcomingEvent[]> {
  return api.get<UpcomingEvent[]>(`/events/upcoming?days=${days}`);
}
