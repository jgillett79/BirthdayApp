// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Family member types
export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFamilyMember {
  name: string;
  relationship: string;
  avatar?: string;
}

// Event types
export enum EventType {
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other',
}

export interface Event {
  id: string;
  userId: string;
  name: string;
  date: Date; // MM-DD format or full date
  type: EventType;
  familyMemberId?: string; // Optional: which family member this is related to
  relationshipToMember?: string; // e.g., "friend", "colleague"
  notes?: string;
  recurringYearly: boolean;
  notificationDays: number[]; // Days before to notify (e.g., [1, 7, 14])
  reminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEvent {
  name: string;
  date: Date;
  type: EventType;
  familyMemberId?: string;
  relationshipToMember?: string;
  notes?: string;
  recurringYearly?: boolean;
  notificationDays?: number[];
  reminderEnabled?: boolean;
}

export interface UpdateEvent extends Partial<CreateEvent> {
  id: string;
}

// Gift suggestion types
export interface GiftIdea {
  id: string;
  eventId: string;
  userId: string;
  idea: string;
  price?: number;
  url?: string;
  purchased: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGiftIdea {
  eventId: string;
  idea: string;
  price?: number;
  url?: string;
  notes?: string;
}

export interface GiftSuggestionRequest {
  eventId: string;
  personName: string;
  age?: number;
  interests?: string[];
  relationship?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface GiftSuggestion {
  idea: string;
  description: string;
  estimatedPrice: number;
  reasoning: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Upcoming events view
export interface UpcomingEvent extends Event {
  daysUntil: number;
  familyMember?: FamilyMember;
  age?: number;
}
